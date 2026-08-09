using Microsoft.EntityFrameworkCore;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text.Json;
using System.Text.Json.Serialization;

public static class WebApplicationExtensions
{
    private static readonly JsonSerializerOptions SseJsonOptions = new()
    {
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
        DefaultIgnoreCondition = JsonIgnoreCondition.Never
    };

    public static WebApplication ConfigurePipeline(this WebApplication app)
    {
        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();
        }

        app.UseCors("FrontendPolicy");
        app.UseHttpsRedirection();
        app.UseAuthentication();
        app.UseAuthorization();

        return app;
    }

    public static WebApplication MapAppEndpoints(this WebApplication app)
    {
        app.MapGet("/health", () => Results.Ok("Healthy"))
            .WithName("HealthCheck");

        app.MapGet("/news", async (ApplicationDbContext db) => await db.News.ToListAsync());

        app.MapPost("/users/register", async (ApplicationDbContext db, UserRegistrationRequest req) =>
        {
            var existing = await db.Users.FirstOrDefaultAsync(u =>
                u.Provider == req.Provider && u.ProviderAccountId == req.ProviderAccountId);

            if (existing is not null)
            {
                return Results.Ok(new { registered = false, message = "User already exists" });
            }

            db.Users.Add(new AppUser
            {
                Email = req.Email,
                Name = req.Name,
                Provider = req.Provider,
                ProviderAccountId = req.ProviderAccountId
            });

            await db.SaveChangesAsync();
            return Results.Created($"/users/{req.ProviderAccountId}", new { registered = true });
        });

        app.MapPost("/auth/social-login", async (ApplicationDbContext db, UserRegistrationRequest req, JwtOptions jwtOptions) =>
        {
            var existing = await db.Users.FirstOrDefaultAsync(u =>
                u.Provider == req.Provider && u.ProviderAccountId == req.ProviderAccountId);

            var registered = false;
            var user = existing;

            if (user is null)
            {
                user = new AppUser
                {
                    Email = req.Email,
                    Name = req.Name,
                    Provider = req.Provider,
                    ProviderAccountId = req.ProviderAccountId
                };

                db.Users.Add(user);
                await db.SaveChangesAsync();
                registered = true;
            }

            var expiresAt = DateTime.UtcNow.AddMinutes(jwtOptions.ExpiryMinutes);
            var token = JwtTokenFactory.CreateAccessToken(user, jwtOptions, expiresAt);

            return Results.Ok(new
            {
                token,
                tokenType = "Bearer",
                expiresAt,
                registered,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.Name,
                    user.Provider,
                    user.ProviderAccountId,
                    user.CreatedAt
                }
            });
        });

        app.MapGet("/auth/me", (ClaimsPrincipal user) =>
        {
            var userId = JwtTokenFactory.GetClaimValue(user, JwtRegisteredClaimNames.Sub, ClaimTypes.NameIdentifier);
            var email = JwtTokenFactory.GetClaimValue(user, JwtRegisteredClaimNames.Email, ClaimTypes.Email);
            var name = JwtTokenFactory.GetClaimValue(user, "name", JwtRegisteredClaimNames.Name, ClaimTypes.Name);
            var provider = user.FindFirstValue("provider");
            var providerAccountId = user.FindFirstValue("providerAccountId");

            return Results.Ok(new
            {
                userId,
                email,
                name,
                provider,
                providerAccountId
            });
        })
            .RequireAuthorization();

        app.MapGet("/status/stream", async (HttpContext context, IServiceScopeFactory scopeFactory) =>
        {
            context.Response.Headers.Append("Content-Type", "text/event-stream");
            context.Response.Headers.Append("Cache-Control", "no-cache");
            context.Response.Headers.Append("Connection", "keep-alive");

            while (!context.RequestAborted.IsCancellationRequested)
            {
                var healthy = true;
                var dbHealthy = true;
                List<News> news = [];

                try
                {
                    using var scope = scopeFactory.CreateScope();
                    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();
                    news = await db.News.ToListAsync(context.RequestAborted);
                }
                catch
                {
                    dbHealthy = false;
                }

                var payload = JsonSerializer.Serialize(new
                {
                    healthy,
                    dbHealthy,
                    news
                }, SseJsonOptions);

                await context.Response.WriteAsync($"data: {payload}\n\n", context.RequestAborted);
                await context.Response.Body.FlushAsync(context.RequestAborted);

                await Task.Delay(TimeSpan.FromSeconds(3), context.RequestAborted);
            }
        });

        return app;
    }

    public static WebApplication SeedDatabase(this WebApplication app)
    {
        try
        {
            using var scope = app.Services.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

            db.Database.EnsureCreated();

            if (!db.News.Any())
            {
                db.News.AddRange(
                    new News
                    {
                        Title = "2012 was end?",
                        Description = " Don't Believe rumours"
                    },
                    new News
                    {
                        Title = "Pluto is a planet?",
                        Description = "Why to care?"
                    },
                    new News
                    {
                        Title = "Aliens Exists?",
                        Description = "Of course yes!"
                    });

                db.SaveChanges();
            }
        }
        catch (Exception ex)
        {
            app.Logger.LogWarning(ex, "Database seeding skipped — SQL Server unavailable.");
        }

        return app;
    }
}