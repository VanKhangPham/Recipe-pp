using System.Diagnostics;
using Microsoft.AspNetCore.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using RecipeHub.Application.Identity;

namespace RecipeHub.Api.Identity;

public sealed class AuthExceptionHandler(IProblemDetailsService problems) : IExceptionHandler
{
    public async ValueTask<bool> TryHandleAsync(HttpContext context, Exception exception, CancellationToken cancellationToken)
    {
        if (exception is not AuthException auth) return false;
        var status = auth.Error switch
        {
            AuthError.Validation => 400, AuthError.Conflict => 409,
            AuthError.Unauthorized => 401, AuthError.NotFound => 404, _ => 500
        };
        ProblemDetails detail = auth.Errors is not null
            ? new ValidationProblemDetails(auth.Errors)
            : new ProblemDetails();
        detail.Status = status;
        detail.Title = auth.Message;
        detail.Instance = context.Request.Path;
        detail.Extensions["traceId"] = Activity.Current?.Id ?? context.TraceIdentifier;
        context.Response.StatusCode = status;
        context.Response.Headers.CacheControl = "no-store";
        return await problems.TryWriteAsync(new ProblemDetailsContext { HttpContext = context, ProblemDetails = detail });
    }
}
