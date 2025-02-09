using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Roles.Controllers
{
    [ApiController]
    [Route("api/roles")]
    public class RolesController : ControllerBase
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        public RolesController(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        [HttpGet]
        public async Task<IActionResult> GetRoles()
        {
            var roles = await _roleManager.Roles.ToListAsync();
            return Ok(roles);
        }

        [HttpPost]
        public async Task<IActionResult> PostRole(string role)
        {
            var result = await _roleManager.CreateAsync(new IdentityRole(role));
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteRole(string role)
        {
            var roleToDelete = await _roleManager.FindByNameAsync(role);
            if (roleToDelete == null)
            {
                return NotFound();
            }
            var result = await _roleManager.DeleteAsync(roleToDelete);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> PutRole(string role, string newRole)
        {
            var roleToUpdate = await _roleManager.FindByNameAsync(role);
            if (roleToUpdate == null)
            {
                return NotFound();
            }
            roleToUpdate.Name = newRole;
            var result = await _roleManager.UpdateAsync(roleToUpdate);
            return Ok(result);
        }

    }
}