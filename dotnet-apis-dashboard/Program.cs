var builder = WebApplication.CreateBuilder(args);
builder.Services.AddAppServices(builder.Configuration);

var app = builder.Build();

app.ConfigurePipeline();
app.MapAppEndpoints();
app.SeedDatabase();
app.Run();
