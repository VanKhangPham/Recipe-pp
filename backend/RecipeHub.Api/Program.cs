using RecipeHub.Infrastructure;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using RecipeHub.Api.Identity;
using Microsoft.OpenApi;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.AddRecipeHubAuthentication(builder.Configuration, builder.Environment);

builder.Services.AddControllers();
builder.Services.AddOpenApi(options => options.AddDocumentTransformer((document, context, cancellationToken) =>
{
    document.Components ??= new OpenApiComponents();
    document.Components.SecuritySchemes ??= new Dictionary<string, IOpenApiSecurityScheme>();
    document.Components.SecuritySchemes["Bearer"] = new OpenApiSecurityScheme
    {
        Type = SecuritySchemeType.Http, Scheme = "bearer", BearerFormat = "JWT",
        Description = "Paste the access token from login."
    };
    foreach (var description in context.DescriptionGroups.SelectMany(group => group.Items))
    {
        var metadata = description.ActionDescriptor.EndpointMetadata;
        var optionalAuthentication = description.HttpMethod == "GET" && description.RelativePath == "api/v1/recipes/{id}";
        if ((!metadata.OfType<IAuthorizeData>().Any() && !optionalAuthentication) || metadata.OfType<IAllowAnonymous>().Any()) continue;
        var path = "/" + description.RelativePath?.Split('?')[0];
        if (document.Paths.TryGetValue(path, out var item) && item.Operations is not null)
            foreach (var operation in item.Operations.Where(pair => pair.Key.ToString().Equals(description.HttpMethod, StringComparison.OrdinalIgnoreCase)))
            {
                operation.Value.Security = [new OpenApiSecurityRequirement { [new OpenApiSecuritySchemeReference("Bearer", document)] = [] }];
                if (optionalAuthentication) operation.Value.Security.Add(new OpenApiSecurityRequirement());
            }
    }
    return Task.CompletedTask;
}));
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
if (args.Contains("--dataset", StringComparer.Ordinal))
{
    var position = Array.IndexOf(args, "--dataset");
    if (position + 1 >= args.Length) throw new InvalidOperationException("Provide a dataset file path.");
    var json = await File.ReadAllTextAsync(args[position + 1]);
    var rows = RecipeHub.Infrastructure.Recipes.DatasetImporter.Read(json);
    if (!args.Contains("--apply", StringComparer.Ordinal))
        Console.WriteLine($"Dry-run passed: {rows.Length} drafts. No database writes.");
    else
    {
        var authorPosition = Array.IndexOf(args, "--author");
        if (authorPosition < 0 || authorPosition + 1 >= args.Length || !Guid.TryParse(args[authorPosition + 1], out var authorId))
            throw new InvalidOperationException("Provide --author with an existing user UUID.");
        using var scope = app.Services.CreateScope();
        var db = scope.ServiceProvider.GetRequiredService<RecipeHub.Infrastructure.Persistence.RecipeHubDbContext>();
        var databaseName = db.Database.GetDbConnection().Database;
        if (databaseName != "recipehub_dev" && !databaseName.EndsWith("_test", StringComparison.Ordinal))
            throw new InvalidOperationException("Dataset import requires recipehub_dev or a _test database.");
        var result = await RecipeHub.Infrastructure.Recipes.DatasetImporter.ImportAsync(db, json, authorId);
        Console.WriteLine($"Import completed: created={result.Created}, skipped={result.Skipped}.");
    }
    return;
}
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
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/openapi/v1.json", "RecipeHub v1");
        options.UseRequestInterceptor("""
            function(request) {
                const url = new URL(request.url, window.location.origin);
                if (url.origin === window.location.origin && (request.method || 'GET').toUpperCase() === 'POST'
                    && url.pathname.startsWith('/api/v1/auth/')) {
                    return fetch('/api/v1/auth/csrf', { credentials: 'same-origin' })
                        .then(function(response) {
                            if (!response.ok) throw new Error('Cannot fetch CSRF token.');
                            return response.json();
                        })
                        .then(function(csrf) {
                            request.headers['X-CSRF-TOKEN'] = csrf.requestToken;
                            return request;
                        });
                }
                return request;
            }
            """);
    });
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
