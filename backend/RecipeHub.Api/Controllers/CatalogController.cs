using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Api.Controllers;

[ApiController]
[Route("api/v1")]
public sealed class CatalogController(IRecipeService recipes) : ControllerBase
{
    [HttpGet("ingredients")]
    public Task<PageResult<IngredientDto>> Ingredients([FromQuery, MaxLength(150)] string? q, [FromQuery] PageQuery page, CancellationToken ct) => recipes.IngredientsAsync(q, page, ct);
    [HttpGet("ingredients/{id:guid}")]
    public Task<IngredientDto> Ingredient(Guid id, CancellationToken ct) => recipes.GetIngredientAsync(id, ct);
    [HttpPost("ingredients"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<IngredientDto>> CreateIngredient(IngredientWrite request, CancellationToken ct)
    {
        var result = await recipes.SaveIngredientAsync(null, request, ct); return Created($"/api/v1/ingredients/{result.Id}", result);
    }
    [HttpPut("ingredients/{id:guid}"), Authorize(Policy = "Admin")]
    public Task<IngredientDto> UpdateIngredient(Guid id, IngredientWrite request, CancellationToken ct) => recipes.SaveIngredientAsync(id, request, ct);
    [HttpDelete("ingredients/{id:guid}"), Authorize(Policy = "Admin")]
    public async Task<IActionResult> DeleteIngredient(Guid id, CancellationToken ct) { await recipes.DeleteIngredientAsync(id, ct); return NoContent(); }
    [HttpGet("categories")]
    public Task<NamedItem[]> Categories(CancellationToken ct) => recipes.NamesAsync(false, ct);
    [HttpGet("tags")]
    public Task<NamedItem[]> Tags(CancellationToken ct) => recipes.NamesAsync(true, ct);
    [HttpGet("categories/{id:guid}")]
    public Task<NamedItem> Category(Guid id, CancellationToken ct) => recipes.GetNameAsync(false, id, ct);
    [HttpGet("tags/{id:guid}")]
    public Task<NamedItem> Tag(Guid id, CancellationToken ct) => recipes.GetNameAsync(true, id, ct);
    [HttpGet("admin/categories/{id:guid}"), Authorize(Policy = "Admin")]
    public Task<NamedItem> AdminCategory(Guid id, CancellationToken ct) => recipes.GetNameAsync(false, id, ct);
    [HttpGet("admin/tags/{id:guid}"), Authorize(Policy = "Admin")]
    public Task<NamedItem> AdminTag(Guid id, CancellationToken ct) => recipes.GetNameAsync(true, id, ct);
    [HttpPost("admin/categories"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<NamedItem>> AddCategory(NamedWrite request, CancellationToken ct) { var item = await recipes.SaveNameAsync(false, null, request, ct); return Created($"/api/v1/admin/categories/{item.Id}", item); }
    [HttpPut("admin/categories/{id:guid}"), Authorize(Policy = "Admin")]
    public Task<NamedItem> UpdateCategory(Guid id, NamedWrite request, CancellationToken ct) => recipes.SaveNameAsync(false, id, request, ct);
    [HttpDelete("admin/categories/{id:guid}"), Authorize(Policy = "Admin")]
    public async Task<IActionResult> RemoveCategory(Guid id, CancellationToken ct) { await recipes.DeleteNameAsync(false, id, ct); return NoContent(); }
    [HttpPost("admin/tags"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<NamedItem>> AddTag(NamedWrite request, CancellationToken ct) { var item = await recipes.SaveNameAsync(true, null, request, ct); return Created($"/api/v1/admin/tags/{item.Id}", item); }
    [HttpPut("admin/tags/{id:guid}"), Authorize(Policy = "Admin")]
    public Task<NamedItem> UpdateTag(Guid id, NamedWrite request, CancellationToken ct) => recipes.SaveNameAsync(true, id, request, ct);
    [HttpDelete("admin/tags/{id:guid}"), Authorize(Policy = "Admin")]
    public async Task<IActionResult> RemoveTag(Guid id, CancellationToken ct) { await recipes.DeleteNameAsync(true, id, ct); return NoContent(); }
}
