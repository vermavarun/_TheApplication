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
        public async Task<IActionResult> PostRole([FromBody] IdentityRole role)
        {
            var result = await _roleManager.CreateAsync(role);
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteRole([FromBody] IdentityRole role)
        {
            var result = await _roleManager.DeleteAsync(role);
            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> PutRole([FromBody] IdentityRole role)
        {
            var result = await _roleManager.UpdateAsync(role);
            return Ok(result);
        }

    }
}