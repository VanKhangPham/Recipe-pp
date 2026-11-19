import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(fs.readFileSync(new URL("../lib/services/auth-request.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function client(api) {
  const context = { exports: {}, require: () => api };
  vm.runInNewContext(source, context);
  return context.exports.authRequest;
}
test("register preserves conflict and never displays server internals", async () => {
  const request = client({ fetchCsrfToken: async () => "csrf", authenticatedFetch: async () => new Response("sensitive server details", { status: 409 }) });
  await assert.rejects(request("register", {}), /Email này đã được sử dụng/);
});
test("network and rate limit errors have different recovery messages", async () => {
  const limited = client({ fetchCsrfToken: async () => "csrf", authenticatedFetch: async () => new Response(null, { status: 429 }) });
  await assert.rejects(limited("login", {}), /quá nhiều lần/);
  let posted = false;
  const offline = client({ fetchCsrfToken: async () => null, authenticatedFetch: async () => { posted = true; } });
  await assert.rejects(offline("register", {}), /Không kết nối/);
  assert.equal(posted, false);
});
test("successful registration sends CSRF and returns the server account", async () => {
  const request = client({ fetchCsrfToken: async () => "csrf", authenticatedFetch: async (path, options) => {
    assert.equal(path, "/api/v1/auth/register");
    assert.equal(options.headers["X-CSRF-TOKEN"], "csrf");
    assert.equal(JSON.parse(options.body).displayName, "Khánh");
    return Response.json({ id: "new-account" }, { status: 201 });
  } });
  assert.equal((await request("register", { displayName: "Khánh" })).id, "new-account");
});
