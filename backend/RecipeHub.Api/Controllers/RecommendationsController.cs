using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using RecipeHub.Api.Identity;
using RecipeHub.Application.Features;

namespace RecipeHub.Api.Controllers;

[ApiController]
[Route("api/v1")]
public sealed class RecommendationsController(IRecommendationService recommendations) : ControllerBase
{
    [HttpGet("recommendations")]
    public Task<RecommendationDto[]> Public([FromQuery] RecommendationQuery query, CancellationToken ct) => recommendations.RecommendAsync(query, null, null, ct);
    [HttpGet("users/me/recommendations"), Authorize, ResponseCache(NoStore = true, Location = ResponseCacheLocation.None)]
    public Task<RecommendationDto[]> Personal([FromQuery, Range(1, 50)] int limit = 10, CancellationToken ct = default) => recommendations.RecommendAsync(new() { Limit = limit }, User.RequiredId(), null, ct);
    [HttpGet("recipes/{id:guid}/similar")]
    public Task<RecommendationDto[]> Similar(Guid id, [FromQuery, Range(1, 50)] int limit = 10, CancellationToken ct = default) => recommendations.RecommendAsync(new() { Limit = limit }, null, id, ct);
}
