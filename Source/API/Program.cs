var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

var configValue = builder.Configuration.GetValue<string>("urls:ui");


builder.Services.AddControllers();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        builder =>
        {
            builder.AllowAnyOrigin() //builder.WithOrigins("https://localhost:3000", configValue)
                    .AllowAnyHeader()
                    .AllowAnyMethod();
        });
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}



app.UseHttpsRedirection();
app.UseAuthorization();

app.MapControllers();
app.UseCors();
app.Run();
