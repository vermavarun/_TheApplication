// Namespaces
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

// Builder
var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<ApplicationDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("identitydb"));
});

builder.Services.AddIdentityApiEndpoints<IdentityUser>()
    .AddEntityFrameworkStores<ApplicationDbContext>();
builder.Services.AddAuthorization();

// App
var app = builder.Build();
// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// order is important here
app.UseRouting();
app.UseAuthentication();
app.UseAuthorization();
app.UseHttpsRedirection();
app.MapIdentityApi<IdentityUser>();


////////////////////////////////
app.MapGet("/secretinfo", () =>
{
    return "This is a secret information. You should not be able to see this unless you are authenticated.";
})
.WithName("GetSecretInfo")
.WithOpenApi()
.RequireAuthorization();
////////////////////////////////
app.MapGet("/ping", () =>
{
    return "pong";
})
.WithName("ping")
.WithOpenApi();
////////////////////////////////

app.Run();
