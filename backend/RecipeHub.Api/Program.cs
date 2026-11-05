using RecipeHub.Infrastructure;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using RecipeHub.Api.Identity;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddRecipeHubAuthentication(builder.Configuration, builder.Environment);

builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddProblemDetails(options => options.CustomizeProblemDetails = context =>
    context.ProblemDetails.Extensions["traceId"] = System.Diagnostics.Activity.Current?.Id ?? context.HttpContext.TraceIdentifier);
builder.Services.AddHealthChecks();

var allowedOrigins = builder.Configuration
    .GetSection("Cors:AllowedOrigins").Get<string[]>() ?? [];
builder.Services.AddCors(options => options.AddPolicy("Frontend", policy =>
{
    if (allowedOrigins.Length > 0)
    {
        policy.WithOrigins(allowedOrigins).AllowAnyHeader().AllowAnyMethod().AllowCredentials();
    }
}));

var app = builder.Build();
// Validate signing configuration at startup, after all configuration providers are loaded.
_ = app.Services.GetRequiredService<JwtSettings>();
if (args.Contains("--bootstrap-admin", StringComparer.Ordinal))
{
    await AdminBootstrap.RunAsync(app.Services);
    return;
}

app.UseExceptionHandler();
app.UseStatusCodePages();
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("Frontend");
app.UseRateLimiter();
app.UseAuthentication();
app.UseAuthorization();
app.MapHealthChecks("/health/live", new HealthCheckOptions { Predicate = _ => false });
app.MapHealthChecks("/health/ready", new HealthCheckOptions { Predicate = check => check.Tags.Contains("ready") });
app.MapControllers();

app.Run();

// Allows the integration test host to start the real API pipeline.
public partial class Program;
