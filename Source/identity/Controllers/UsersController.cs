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
        private readonly UserManager<UserModel> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;
        public UsersController(UserManager<UserModel> userManager, RoleManager<IdentityRole> roleManager)
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
        public async Task<IActionResult> PostUser([FromBody] UserModel user)
        {
            var result = await _userManager.CreateAsync(user);
            return Ok(result);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteUser([FromBody] UserModel user)
        {
            var userToDelete = await _userManager.FindByIdAsync(user.Id);

            if (userToDelete == null)
            {
                return NotFound();
            }
            var result = await _userManager.DeleteAsync(userToDelete);

            return Ok(result);
        }

        [HttpPut]
        public async Task<IActionResult> PutUser([FromBody] UserUpdateModel user)
        {
            var userToUpdate = await _userManager.FindByIdAsync(user.Id);

            if (userToUpdate == null)
            {
                return NotFound();
            }

            userToUpdate.FirstName = user.FirstName;
            userToUpdate.LastName = user.LastName;

            var result = await _userManager.UpdateAsync(userToUpdate);

            return Ok(result);
        }

    }
}