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
app.Run();
