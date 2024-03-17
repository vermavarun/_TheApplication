public static class UserEndpointsExt
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        app.MapGet("/users/{id}", (int id) => { return Results.Ok(); });
    }
}