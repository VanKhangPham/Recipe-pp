using Microsoft.AspNetCore.Mvc;

namespace RecipeHub.Api.Controllers;

[ApiController]
[Route("api/v1/system")]
public sealed class SystemController : ControllerBase
{
    [HttpGet]
    [ProducesResponseType<SystemInfoResponse>(StatusCodes.Status200OK)]
    public ActionResult<SystemInfoResponse> Get() =>
        Ok(new SystemInfoResponse("RecipeHub.Api", "v1"));
}

public sealed record SystemInfoResponse(string Service, string ApiVersion);
