using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;

public static class UserEndpointsExt
{
    public static void MapUserEndpoints(this WebApplication app, IConfiguration _configuration)
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
         ///////////////////////////////////////////////////////////////////////////////////////////////////
        app.MapGet("/userlist",  () => {

             using(var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var users = userManager.Users.ToList();
                return Results.Ok(users);
            }
        })
        .WithName("userList")
        .WithOpenApi();
        ///////////////////////////////////////////////////////////////////////////////////////////////////
        /// ///////////////////////////////////////////////////////////////////////////////////////////////////
        app.MapGet("/signin",  (string email, string password) => {
            using(var scope = app.Services.CreateScope())
            {
                var userManager = scope.ServiceProvider.GetRequiredService<UserManager<IdentityUser>>();
                var user = userManager.FindByEmailAsync(email).Result;
                if(user != null)
                {
                    var result = userManager.CheckPasswordAsync(user, password).Result;
                    if(result)
                    {
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(new Claim[]
                            {
                                new Claim(ClaimTypes.Name, user.Id),
                                new Claim(ClaimTypes.Email, user.Email!),
                                new Claim(ClaimTypes.Role, "admin")
                            }),
                            Expires = DateTime.UtcNow.AddHours(1),
                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                        };
                        var token = tokenHandler.CreateToken(tokenDescriptor);
                        return Results.Ok(tokenHandler.WriteToken(token));

                    }
                    else
                    {
                        return Results.BadRequest("Invalid password");
                    }
                }
                else
                {
                    return Results.BadRequest("User not found");
                }
            }
        });
    }
}