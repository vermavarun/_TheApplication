using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Admin.Controllers
{
    [ApiController]
    [Authorize(Roles = "admin")]
    [Route("api/[controller]")]
    public class AdminController : ControllerBase
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public AdminController(UserManager<IdentityUser> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet ("users")]
        public async Task<IActionResult> GetUsers()
        {
            var users = await _userManager.Users.ToListAsync();
            return Ok(users);
        }

        // [HttpPost]
        // public async Task<IActionResult> PostUser([FromBody] IdentityUser user)
        // {
        //     var result = await _userManager.CreateAsync(user);
        //     return Ok(result);
        // }

        // [HttpDelete]
        // public async Task<IActionResult> DeleteUser([FromBody] IdentityUser user)
        // {
        //     var result = await _userManager.DeleteAsync(user);
        //     return Ok(result);
        // }

        // [HttpPut]
        // public async Task<IActionResult> PutUser([FromBody] IdentityUser user)
        // {
        //     var result = await _userManager.UpdateAsync(user);
        //     return Ok(result);
        // }

        // [HttpGet]
        // public async Task<IActionResult> GetRoles()
        // {
        //     var roles = await _roleManager.Roles.ToListAsync();
        //     return Ok(roles);
        // }

        // [HttpPost]
        // public async Task<IActionResult> PostRole([FromBody] IdentityRole role)
        // {
        //     var result = await _roleManager.CreateAsync(role);
        //     return Ok(result);
        // }

        // [HttpDelete]
        // public async Task<IActionResult> DeleteRole([FromBody] IdentityRole role)
        // {
        //     var result = await _roleManager.DeleteAsync(role);
        //     return Ok(result);
        // }

        // [HttpPut]
        // public async Task<IActionResult> PutRole([FromBody] IdentityRole role)
        // {
        //     var result = await _roleManager.UpdateAsync(role);
        //     return Ok(result);
        // }

    }
}