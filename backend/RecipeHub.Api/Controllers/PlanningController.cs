using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeHub.Api.Identity;
using RecipeHub.Application.Features;
using RecipeHub.Application.Recipes;

namespace RecipeHub.Api.Controllers;

[ApiController, Authorize, ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
[Route("api/v1")]
public sealed class PlanningController(IPlanningService planning) : ControllerBase
{
    [HttpGet("meal-plans")]
    public Task<MealPlanDto> Plan([FromQuery] DateOnly weekStart, CancellationToken ct) => planning.PlanAsync(User.RequiredId(), weekStart, ct);
    [HttpPost("meal-plans")]
    public async Task<ActionResult<MealPlanDto>> Create(PlanWrite request, CancellationToken ct)
    {
        var plan = await planning.CreatePlanAsync(User.RequiredId(), request, ct); return Created($"/api/v1/meal-plans?weekStart={plan.WeekStart:yyyy-MM-dd}", plan);
    }
    [HttpPost("meal-plans/{id:guid}/items")]
    public async Task<ActionResult<MealItemDto>> AddItem(Guid id, MealItemWrite request, CancellationToken ct)
    {
        var item = await planning.SaveItemAsync(User.RequiredId(), id, null, request, ct); return Created($"/api/v1/meal-plans/{id}/items/{item.Id}", item);
    }
    [HttpPut("meal-plans/{id:guid}/items/{itemId:guid}")]
    public Task<MealItemDto> UpdateItem(Guid id, Guid itemId, MealItemWrite request, CancellationToken ct) => planning.SaveItemAsync(User.RequiredId(), id, itemId, request, ct);
    [HttpDelete("meal-plans/{id:guid}/items/{itemId:guid}")]
    public async Task<IActionResult> DeleteItem(Guid id, Guid itemId, CancellationToken ct) { await planning.DeleteItemAsync(User.RequiredId(), id, itemId, ct); return NoContent(); }
    [HttpPut("meal-plans/{id:guid}/shopping-list")]
    public async Task<ActionResult<ShoppingListDto>> Generate(Guid id, CancellationToken ct)
    {
        var result = await planning.GenerateAsync(User.RequiredId(), id, ct);
        return result.Created ? Created($"/api/v1/shopping-lists/{result.List.Id}", result.List) : Ok(result.List);
    }
    [HttpGet("shopping-lists")]
    public Task<PageResult<ShoppingSummary>> Lists([FromQuery] PageQuery page, CancellationToken ct) => planning.ListsAsync(User.RequiredId(), page, ct);
    [HttpGet("shopping-lists/{id:guid}")]
    public Task<ShoppingListDto> List(Guid id, CancellationToken ct) => planning.ListAsync(User.RequiredId(), id, ct);
    [HttpPatch("shopping-lists/{id:guid}/items/{itemId:guid}")]
    public Task<ShoppingItemDto> Patch(Guid id, Guid itemId, ShoppingPatch request, CancellationToken ct) => planning.PatchItemAsync(User.RequiredId(), id, itemId, request, ct);
}
