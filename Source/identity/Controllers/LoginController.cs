using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;

namespace Login.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class LoginController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IConfiguration _configuration;
        public LoginController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration)
        {
            _userManager = userManager;
            _roleManager = roleManager;
            _configuration = configuration;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] LoginModel login)
        {
            var user = await _userManager.FindByNameAsync(login.Email);
            if (user == null)
            {
                return Unauthorized();
            }
            var userRoles = await _userManager.GetRolesAsync(user);
            var result = await _userManager.CheckPasswordAsync(user, login.Password);
            if (result)
            {
                if(result)
                    {
                        var tokenHandler = new JwtSecurityTokenHandler();
                        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!);

                        var tokenDescriptor = new SecurityTokenDescriptor
                        {
                            Subject = new ClaimsIdentity(
                            [
                                new Claim(ClaimTypes.Name, user.Id),
                                new Claim(ClaimTypes.Email, user.NormalizedEmail!)
                            ]),
                            Expires = DateTime.UtcNow.AddHours(100),
                            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
                        };
                        // Add roles to the token
                        foreach (var role in userRoles)
                        {
                            tokenDescriptor.Subject.AddClaim(new Claim(ClaimTypes.Role, role));
                        }
                        var token = tokenHandler.CreateToken(tokenDescriptor);
                        return Ok(tokenHandler.WriteToken(token));
                    }
                    else
                    {
                        return BadRequest("Invalid password");
                    }
            }
            return Unauthorized();
        }
    }
}