using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

var allowedOrigins = builder.Configuration
    .GetSection("AllowedOrigins")
    .Get<string[]>()
    ?? [];

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

app.MapGet("/health", () => Results.Ok("Healthy"))
    .WithName("HealthCheck");

app.MapGet("/news", async (ApplicationDbContext db) =>
{
    return await db.News.ToListAsync();
});

// Seed the database
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<ApplicationDbContext>();

    // Create the database if it doesn't exist
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

app.Run();
