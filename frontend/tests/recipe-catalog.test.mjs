import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import ts from "typescript";
const source = ts.transpileModule(fs.readFileSync(new URL("../lib/services/recipe-service.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;
function service(fetch) {
  const context = { exports: {}, AbortSignal, require: (name) => name.endsWith("api-client") ? { backendFetch: fetch } : {} };
  vm.runInNewContext(source, context);
  return context.exports.recipeService;
}
const row = (id) => ({ id, title: "Trứng", description: "Món ăn", servings: 2, prepMinutes: 5, cookMinutes: 10,
  totalMinutes: 15, difficulty: "Easy", createdAt: "2026-11-19T00:00:00Z", reviewCount: 0,
  author: { id: "author", displayName: "Khánh" }, categories: [], ingredients: [{ ingredientId: "egg", ingredientName: "Trứng gà", quantity: 2, unit: "piece" }] });
test("catalog loads 23 cards with ingredients in one request and no detail fan-out", async () => {
  const calls = [];
  const recipes = await service(async (path) => {
    calls.push(path);
    assert.match(path, /pageSize=100/);
    return { items: Array.from({ length: 23 }, (_, id) => row(String(id))), totalPages: 1 };
  }).fetchCloudNeonRecipes();
  assert.equal(calls.length, 1);
  assert.equal(recipes.length, 23);
  assert.equal(recipes[0].ingredients[0].name, "Trứng gà");
});
test("catalog still retrieves every page", async () => {
  const calls = [];
  const recipes = await service(async (path) => {
    calls.push(path);
    return { items: [row(path)], totalPages: 2 };
  }).fetchCloudNeonRecipes();
  assert.equal(calls.length, 2);
  assert.equal(recipes.length, 2);
});
