using Microsoft.AspNetCore.Identity;

public static class RoleManagerEndpointsExt
{
    public static void MapRoleManagerEndpoints(this WebApplication app)
    {
        app.MapGet("/addRole", (string role, string userEmail) => {

            using(var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var user = userManager.FindByEmailAsync(userEmail).Result;
                var result = userManager.AddToRoleAsync(user, role).Result;
                if(result.Succeeded)
                {
                    return Results.Ok();
                }
                else
                {
                    return Results.BadRequest(result.Errors);
                }
            }
        })
        .WithName("AddUserToRole")
        .WithOpenApi()
        .RequireAuthorization();
    }
}