using Microsoft.AspNetCore.Identity;

public static class UserEndpointsExt
{
    public static void MapUserEndpoints(this WebApplication app)
    {
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        app.MapGet("/users",  () => {

             using(var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var users = userManager.Users.ToList();
                return Results.Ok(users);
            }
        })
        .WithName("ListUsers")
        .WithOpenApi()
        .RequireAuthorization("admin");
        ///////////////////////////////////////////////////////////////////////////////////////////////////
         app.MapGet("/userRoles/{userEmail}",  (string userEmail) => {
            using(var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
                var user = userManager.FindByEmailAsync(userEmail).Result;
                var roles = userManager.GetRolesAsync(user).Result;
                return Results.Ok(roles);
            }
        })
        .WithName("UserRoles")
        .WithOpenApi()
        .RequireAuthorization("admin");
        ///////////////////////////////////////////////////////////////////////////////////////////////////
    }
}