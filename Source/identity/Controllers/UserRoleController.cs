using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace UserRole.Controllers
{
    [ApiController]
    [Route("api/userrole")]
    public class UserRoleController : ControllerBase
    {
        private readonly UserManager<UserModel> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UserRoleController(UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetUserRoles(string userEmail)
        {
            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null)
            {
                return NotFound();
            }
            var roles = await _userManager.GetRolesAsync(user);
            return Ok(roles);
        }

        [HttpPost]
        public async Task<IActionResult> PostUserToRole(string userEmail, string roleName)
        {
            var user = _userManager.FindByEmailAsync(userEmail).Result;
            if (user == null)
            {
                return NotFound();
            }
            try
            {
                var result = await _userManager.AddToRoleAsync(user, roleName);
                if (result.Succeeded)
                {
                    return Ok();
                }
                else
                {
                    return BadRequest(result.Errors);
                }
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUserFromRole(string userEmail, string roleName)
        {
            var user = await _userManager.FindByEmailAsync(userEmail);
            if (user == null)
            {
                return NotFound();
            }
            var result = await _userManager.RemoveFromRoleAsync(user, roleName);
            return Ok(result);
        }

        [HttpGet("all")]
        public async Task<IActionResult> GetAllUsersWithRoles()
        {
            var users = await _userManager.Users.ToListAsync();
            var usersWithRoles = new List<object>();
            foreach (var user in users)
            {
                var roles = await _userManager.GetRolesAsync(user);
                usersWithRoles.Add(new { user, roles });
            }
            return Ok(usersWithRoles);
        }
    }
}