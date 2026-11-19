import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";

const source = ts.transpileModule(fs.readFileSync(new URL("../lib/context/favorites-context.tsx", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022, jsx: ts.JsxEmit.ReactJSX },
}).outputText;

function session(user, restoring = false) {
  const routes = [];
  let writes = 0;
  const jsx = (type, props) => ({ type, props });
  const react = {
    createContext: () => ({ Provider: "provider" }),
    useState: (value) => [value, () => {}],
    useRef: (value) => ({ current: value }),
    useEffect: () => {}, useMemo: (compute) => compute(),
  };
  const context = { exports: {}, require: (name) => {
    if (name === "react") return react;
    if (name === "react/jsx-runtime") return { jsx, jsxs: jsx };
    if (name === "next/navigation") return { useRouter: () => ({ push: (url) => routes.push(url) }), usePathname: () => "/recipes/example" };
    if (name.endsWith("auth-context")) return { useAuth: () => ({ user, isRestoringSession: restoring }) };
    if (name.endsWith("recipes-context")) return { useRecipes: () => ({ getRecipeById: () => undefined }) };
    if (name.endsWith("favorites-service")) return { INITIAL_COLLECTIONS: [], favoritesService: new Proxy({}, { get: () => () => { writes++; } }) };
    if (name.endsWith("api-client")) return { backendFetch: () => { writes++; } };
    return {};
  } };
  vm.runInNewContext(source, context);
  const element = context.exports.FavoritesProvider({ children: null });
  const rendered = element.type(element.props);
  return { api: rendered.props.value, routes, writes: () => writes };
}
test("guest saving a favorite opens login without writing local or API data", () => {
  const state = session(null);
  assert.equal(state.api.toggleFavorite("recipe"), false);
  state.api.removeFavorite("recipe");
  assert.deepEqual(state.routes, ["/login?returnUrl=%2Frecipes%2Fexample"]);
  assert.equal(state.writes(), 0);
  assert.equal(state.api.favorites.length, 0);
});
test("restoring authentication cannot save or redirect before identity is known", () => {
  const state = session(null, true);
  assert.equal(state.api.toggleFavorite("recipe"), false);
  assert.equal(state.routes.length, 0);
  assert.equal(state.writes(), 0);
});
