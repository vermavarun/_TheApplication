using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Text.Json;
using System.Text.Json.Serialization;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>()
    ?? [];

var jwtOptions = builder.Configuration
    .GetSection("Jwt")
    .Get<JwtOptions>()
    ?? new JwtOptions();

if (string.IsNullOrWhiteSpace(jwtOptions.Secret))
{
    throw new InvalidOperationException("Jwt:Secret is required.");
}

if (jwtOptions.ExpiryMinutes <= 0)
{
    jwtOptions.ExpiryMinutes = 60;
}

// Add services to the container.
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();
builder.Services.AddCors(options =>
{
    options.AddPolicy("FrontendPolicy", policy =>
    {
        policy.WithOrigins(allowedOrigins)
            .AllowAnyHeader()
            .AllowAnyMethod();
    });
});

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOptions.Issuer,
            ValidAudience = jwtOptions.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret)),
            ClockSkew = TimeSpan.FromSeconds(30)
        };

        options.Events = new JwtBearerEvents
        {
            OnMessageReceived = context =>
            {
                // Prefer Authorization header, fallback to secure cookie used by Next.js.
                if (string.IsNullOrWhiteSpace(context.Token) &&
                    context.Request.Cookies.TryGetValue("backend_access_token", out var cookieToken))
                {
                    context.Token = cookieToken;
                }

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
    options.UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseCors("FrontendPolicy");
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.MapGet("/health", () => Results.Ok("Healthy"))
    .WithName("HealthCheck");

app.MapGet("/news", async (ApplicationDbContext db) =>
{
    return await db.News.ToListAsync();
});

app.MapPost("/users/register", async (ApplicationDbContext db, UserRegistrationRequest req) =>
{
    var existing = await db.Users.FirstOrDefaultAsync(u =>
        u.Provider == req.Provider && u.ProviderAccountId == req.ProviderAccountId);

    if (existing is not null)
        return Results.Ok(new { registered = false, message = "User already exists" });

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

app.MapPost("/auth/social-login", async (ApplicationDbContext db, UserRegistrationRequest req) =>
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
    var token = CreateAccessToken(user, jwtOptions, expiresAt);

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
    var userId = GetClaimValue(user, JwtRegisteredClaimNames.Sub, ClaimTypes.NameIdentifier);
    var email = GetClaimValue(user, JwtRegisteredClaimNames.Email, ClaimTypes.Email);
    var name = GetClaimValue(user, "name", JwtRegisteredClaimNames.Name, ClaimTypes.Name);
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

var sseJsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase,
    DefaultIgnoreCondition = JsonIgnoreCondition.Never
};

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
        }, sseJsonOptions);

        await context.Response.WriteAsync($"data: {payload}\n\n", context.RequestAborted);
        await context.Response.Body.FlushAsync(context.RequestAborted);

        await Task.Delay(TimeSpan.FromSeconds(3), context.RequestAborted);
    }
});

// Seed the database (best-effort — app starts even if SQL Server is unavailable)
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
    var logger = app.Services.GetRequiredService<ILogger<Program>>();
    logger.LogWarning(ex, "Database seeding skipped — SQL Server unavailable.");
}

app.Run();

static string? GetClaimValue(ClaimsPrincipal user, params string[] claimTypes)
{
    foreach (var claimType in claimTypes)
    {
        var value = user.FindFirstValue(claimType);
        if (!string.IsNullOrWhiteSpace(value))
        {
            return value;
        }
    }

    return null;
}

static string CreateAccessToken(AppUser user, JwtOptions jwtOptions, DateTime expiresAt)
{
    var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions.Secret));
    var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

    var claims = new List<Claim>
    {
        new(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
        new(JwtRegisteredClaimNames.Email, user.Email),
        new(JwtRegisteredClaimNames.Name, user.Name),
        new("provider", user.Provider),
        new("providerAccountId", user.ProviderAccountId)
    };

    var jwt = new JwtSecurityToken(
        issuer: jwtOptions.Issuer,
        audience: jwtOptions.Audience,
        claims: claims,
        expires: expiresAt,
        signingCredentials: credentials);

    return new JwtSecurityTokenHandler().WriteToken(jwt);
}

record UserRegistrationRequest(
    string Email,
    string Name,
    string Provider,
    string ProviderAccountId
);

class JwtOptions
{
    public string Issuer { get; set; } = "dotnet-apis-dashboard";
    public string Audience { get; set; } = "nextjs-dashboard";
    public string Secret { get; set; } = string.Empty;
    public int ExpiryMinutes { get; set; } = 60;
}
