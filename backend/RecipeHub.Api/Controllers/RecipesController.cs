using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeHub.Api.Identity;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Api.Controllers;

[ApiController]
[Route("api/v1/recipes")]
public sealed class RecipesController(IRecipeService recipes) : ControllerBase
{
    [HttpGet]
    public Task<PageResult<RecipeSummary>> List([FromQuery] RecipeQuery query, CancellationToken ct) => recipes.ListAsync(query, null, false, ct);
    [HttpGet("{id:guid}")]
    [ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public Task<RecipeDetail> Get(Guid id, CancellationToken ct) => recipes.GetAsync(id, User.OptionalId(), User.IsInRole("Admin"), ct);
    [HttpGet("/api/v1/users/me/recipes"), Authorize, ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public Task<PageResult<RecipeSummary>> Own([FromQuery] RecipeQuery query, CancellationToken ct) => recipes.ListAsync(query, User.RequiredId(), false, ct);
    [HttpGet("/api/v1/admin/recipes"), Authorize(Policy = "Admin"), ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public Task<PageResult<RecipeSummary>> Admin([FromQuery] RecipeQuery query, CancellationToken ct) => recipes.ListAsync(query, null, true, ct);
    [HttpPost, Authorize]
    public async Task<ActionResult<RecipeDetail>> Create(RecipeWrite request, CancellationToken ct)
    {
        var result = await recipes.SaveAsync(null, request, User.RequiredId(), User.IsInRole("Admin"), ct);
        return Created($"/api/v1/recipes/{result.Summary.Id}", result);
    }
    [HttpPut("{id:guid}"), Authorize]
    public Task<RecipeDetail> Update(Guid id, RecipeWrite request, CancellationToken ct) => recipes.SaveAsync(id, request, User.RequiredId(), User.IsInRole("Admin"), ct);
    [HttpDelete("{id:guid}"), Authorize]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        await recipes.ArchiveAsync(id, User.RequiredId(), User.IsInRole("Admin"), ct); return NoContent();
    }
}
