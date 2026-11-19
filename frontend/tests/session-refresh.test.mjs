import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source = ts.transpileModule(
  fs.readFileSync(new URL("../lib/services/api-client.ts", import.meta.url), "utf8"),
  { compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 } }
).outputText;

function deferred() {
  let resolve;
  const promise = new Promise((done) => { resolve = done; });
  return { promise, resolve };
}

function freshClient(fetch, env = {}) {
  const context = {
    exports: {}, process: { env }, Headers, AbortSignal, setTimeout,
    fetch: (url, options) => fetch(new URL(url).pathname, options),
  };
  vm.runInNewContext(source, context);
  context.exports.setAccessToken("expired-token");
  return context.exports;
}

const json = (body) => new Response(JSON.stringify(body));
const session = () => json({
  accessToken: "fresh-token",
  user: { id: "owner", email: "owner@example.test", displayName: "Owner", roles: ["User"] },
});

test("local startup skips saved cookies and begins signed out", async () => {
  let calls = 0;
  const api = freshClient(async () => { calls++; return session(); });
  assert.equal(await api.restoreSession(), null);
  assert.equal(api.getAccessToken(), null);
  assert.equal(calls, 0);
});

test("startup restores session only when explicitly enabled", async () => {
  const calls = [];
  const api = freshClient(async (url) => {
    calls.push(url);
    return url.endsWith("/csrf") ? json({ requestToken: "csrf" }) : session();
  }, { NEXT_PUBLIC_RESTORE_SESSION: "true" });
  assert.equal((await api.restoreSession()).accessToken, "fresh-token");
  assert.deepEqual(calls, ["/api/v1/auth/csrf", "/api/v1/auth/refresh"]);
});

test("simultaneous requests share refresh and replay JSON mutations once", async () => {
  let refreshes = 0;
  let oldRequests = 0;
  let newRequests = 0;
  const api = freshClient(async (url, options) => {
    if (url.endsWith("/csrf")) return json({ requestToken: "csrf" });
    if (url.endsWith("/refresh")) {
      refreshes++;
      assert.equal(options.headers["X-CSRF-TOKEN"], "csrf");
      return session();
    }
    if (options.headers.get("Authorization") === "Bearer expired-token") {
      oldRequests++;
      return new Response(null, { status: 401 });
    }
    newRequests++;
    assert.equal(options.headers.get("Authorization"), "Bearer fresh-token");
    if (options.method === "PATCH") assert.equal(options.body, '{"isPurchased":true}');
    return new Response(null, { status: 204 });
  });
  const results = await Promise.all([
    api.authenticatedFetch("/api/v1/users/me"),
    api.authenticatedFetch("/api/v1/shopping-lists/item", { method: "PATCH", body: '{"isPurchased":true}' }),
  ]);
  assert.ok(results.every((response) => response.status === 204));
  assert.equal(refreshes, 1);
  assert.equal(oldRequests, 2);
  assert.equal(newRequests, 2);
});

test("late 401 reuses the token rotated by another request", async () => {
  const slow = deferred();
  let refreshes = 0;
  const api = freshClient(async (url, options) => {
    if (url.endsWith("/csrf")) return json({ requestToken: "csrf" });
    if (url.endsWith("/refresh")) { refreshes++; return session(); }
    if (options.headers.get("Authorization") === "Bearer expired-token") {
      if (url.endsWith("/slow")) await slow.promise;
      return new Response(null, { status: 401 });
    }
    return json({ saved: true });
  });
  const pending = api.authenticatedFetch("/api/v1/slow");
  assert.equal((await api.authenticatedFetch("/api/v1/fast")).status, 200);
  slow.resolve();
  assert.equal((await pending).status, 200);
  assert.equal(refreshes, 1);
});

test("expired refresh clears the local session", async () => {
  let notification = "unchanged";
  const api = freshClient(async (url) => url.endsWith("/csrf")
    ? json({ requestToken: "csrf" }) : new Response(null, { status: 401 }));
  api.subscribeToSession((value) => { notification = value; });
  assert.equal((await api.authenticatedFetch("/api/v1/users/me")).status, 401);
  assert.equal(api.getAccessToken(), null);
  assert.equal(notification, null);
});

test("transient refresh failure preserves session and does not replay", async () => {
  let protectedCalls = 0;
  const api = freshClient(async (url) => {
    if (url.endsWith("/csrf")) return json({ requestToken: "csrf" });
    if (url.endsWith("/refresh")) return new Response(null, { status: 503 });
    protectedCalls++;
    return new Response(null, { status: 401 });
  });
  assert.equal((await api.authenticatedFetch("/api/v1/users/me")).status, 401);
  assert.equal(api.getAccessToken(), "expired-token");
  assert.equal(protectedCalls, 1);
});

test("logout waits for rotation and prevents stale refresh restoring identity", async () => {
  const started = deferred();
  const finishRefresh = deferred();
  const order = [];
  let restored = false;
  const api = freshClient(async (url) => {
    if (url.endsWith("/csrf")) return json({ requestToken: "csrf" });
    if (url.endsWith("/refresh")) {
      started.resolve();
      await finishRefresh.promise;
      order.push("refresh-response");
      return session();
    }
    if (url.endsWith("/logout")) {
      order.push("logout-request");
      return new Response(null, { status: 204 });
    }
    return new Response(null, { status: 401 });
  });
  api.subscribeToSession((value) => { if (value) restored = true; });
  const request = api.authenticatedFetch("/api/v1/users/me");
  await started.promise;
  const logout = api.endSession();
  assert.equal(api.getAccessToken(), null);
  finishRefresh.resolve();
  await Promise.all([request, logout]);
  assert.deepEqual(order, ["refresh-response", "logout-request"]);
  assert.equal(api.getAccessToken(), null);
  assert.equal(restored, false);
});

test("aborting one caller leaves shared refresh available to another", { timeout: 1000 }, async () => {
  const started = deferred();
  const finishRefresh = deferred();
  const api = freshClient(async (url, options) => {
    if (url.endsWith("/csrf")) return json({ requestToken: "csrf" });
    if (url.endsWith("/refresh")) {
      started.resolve();
      await finishRefresh.promise;
      return session();
    }
    return new Response(null, { status: options.headers.get("Authorization") === "Bearer expired-token" ? 401 : 204 });
  });
  const controller = new AbortController();
  const cancelled = api.authenticatedFetch("/api/v1/a", { signal: controller.signal });
  const surviving = api.authenticatedFetch("/api/v1/b");
  const rejected = assert.rejects(cancelled, { name: "AbortError" });
  await started.promise;
  controller.abort();
  await rejected;
  finishRefresh.resolve();
  assert.equal((await surviving).status, 204);
});

test("refresh cannot replay a request using a different signed-in account", async () => {
  const started = deferred();
  const finish = deferred();
  let protectedCalls = 0;
  const api = freshClient(async (url) => {
    if (url.endsWith("/csrf")) return json({ requestToken: "csrf" });
    if (url.endsWith("/refresh")) {
      started.resolve();
      await finish.promise;
      return session();
    }
    protectedCalls++;
    return new Response(null, { status: 401 });
  });
  const request = api.authenticatedFetch("/api/v1/users/me");
  await started.promise;
  api.setAccessToken("different-account-token");
  finish.resolve();
  assert.equal((await request).status, 401);
  assert.equal(api.getAccessToken(), "different-account-token");
  assert.equal(protectedCalls, 1);
});

test("403 and explicit authorization do not trigger refresh", async () => {
  let calls = 0;
  const api = freshClient(async () => { calls++; return new Response(null, { status: 403 }); });
  assert.equal((await api.authenticatedFetch("/api/v1/admin/users")).status, 403);
  assert.equal(calls, 1);
  const explicit = freshClient(async (url) => {
    assert.equal(url, "/api/v1/users/me");
    return new Response(null, { status: 401 });
  });
  assert.equal((await explicit.authenticatedFetch("/api/v1/users/me", { headers: { Authorization: "Bearer custom" } })).status, 401);
});

test("a retry rejected with 401 does not start a refresh loop", async () => {
  let refreshes = 0;
  let calls = 0;
  const api = freshClient(async (url) => {
    if (url.endsWith("/csrf")) return json({ requestToken: "csrf" });
    if (url.endsWith("/refresh")) { refreshes++; return session(); }
    calls++;
    return new Response(null, { status: 401 });
  });
  assert.equal((await api.authenticatedFetch("/api/v1/users/me")).status, 401);
  assert.equal(refreshes, 1);
  assert.equal(calls, 2);
});
