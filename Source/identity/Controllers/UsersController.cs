using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Users.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class UsersController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UsersController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        [HttpPost]
        public async Task<IActionResult> PostUser([FromBody] User user)
        {
            var result = await _userManager.CreateAsync(user);
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser([FromBody] User user)
        {
            var result = await _userManager.DeleteAsync(user);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> PutUser([FromBody] User user)
        {
            var result = await _userManager.UpdateAsync(user);
            return Ok(result);
        }

    }
}