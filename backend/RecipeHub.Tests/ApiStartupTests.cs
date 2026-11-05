using System.Net;
using System.Net.Http.Json;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using RecipeHub.Api.Controllers;
using Xunit;

namespace RecipeHub.Tests;

public sealed class ApiStartupTests : IClassFixture<TestApiFactory>
{
    private readonly WebApplicationFactory<Program> _factory;

    public ApiStartupTests(TestApiFactory factory) => _factory = factory;

    [Fact]
    public async Task Liveness_RespondsWithoutDatabaseConfiguration()
    {
        using var client = _factory.CreateClient();
        var response = await client.GetAsync("/health/live");
        Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        Assert.Equal("Healthy", await response.Content.ReadAsStringAsync());
    }

    [Fact]
    public async Task SystemEndpoint_ReturnsExpectedContract()
    {
        using var client = _factory.CreateClient();
        var info = await client.GetFromJsonAsync<SystemInfoResponse>("/api/v1/system");
        Assert.NotNull(info);
        Assert.Equal("RecipeHub.Api", info.Service);
        Assert.Equal("v1", info.ApiVersion);
    }

    [Theory]
    [InlineData("Development", HttpStatusCode.OK)]
    [InlineData("Production", HttpStatusCode.NotFound)]
    public async Task OpenApi_IsAvailableOnlyInDevelopment(string environment, HttpStatusCode expected)
    {
        using var factory = _factory.WithWebHostBuilder(builder => builder.UseEnvironment(environment));
        using var client = factory.CreateClient();
        var response = await client.GetAsync("/openapi/v1.json");
        Assert.Equal(expected, response.StatusCode);
    }

    [Theory]
    [InlineData("http://localhost:3000", true)]
    [InlineData("https://untrusted.example", false)]
    public async Task Cors_AllowsOnlyConfiguredFrontend(string origin, bool allowed)
    {
        using var factory = _factory.WithWebHostBuilder(builder => builder.UseEnvironment("Development"));
        using var client = factory.CreateClient();
        using var request = new HttpRequestMessage(HttpMethod.Options, "/api/v1/system");
        request.Headers.Add("Origin", origin);
        request.Headers.Add("Access-Control-Request-Method", "GET");
        var response = await client.SendAsync(request);
        Assert.Equal(allowed, response.Headers.Contains("Access-Control-Allow-Origin"));
        if (allowed)
        {
            Assert.Equal(origin, Assert.Single(response.Headers.GetValues("Access-Control-Allow-Origin")));
        }
    }
}
