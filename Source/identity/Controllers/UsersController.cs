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
        private readonly ApplicationDbContext _context;
        public UsersController(UserManager<UserModel> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
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

        [HttpPost]
        [RequestSizeLimit(100 * 1024 * 1024)] // 100MB limit
        [Route("profile")]
        public async Task<IActionResult> PostProfile([FromForm] UserDetailDto userDetailDto)
        {
            try {
            var userDetail = new UserDetail
            {
                Id = userDetailDto.Id,
                Address = userDetailDto.Address,
                City = userDetailDto.City,
                State = userDetailDto.State,
                Country = userDetailDto.Country
            };

            if (userDetailDto.ProfilePicture != null)
            {
                using var memoryStream = new MemoryStream();
                await userDetailDto.ProfilePicture.CopyToAsync(memoryStream);
                userDetail.ProfilePicture = memoryStream.ToArray();
            }



            _context.UserDetails.Add(userDetail);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User details uploaded successfully" });
            } catch (Exception ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPut]
        [RequestSizeLimit(100 * 1024 * 1024)] // 100MB limit
        [Route("profile")]
        public async Task<IActionResult> PutProfile([FromForm] UserDetailDto userDetailDto)
        {
            try {
            var userDetail = new UserDetail
            {
                Id = userDetailDto.Id,
                Address = userDetailDto.Address,
                City = userDetailDto.City,
                State = userDetailDto.State,
                Country = userDetailDto.Country
            };

            if (userDetailDto.ProfilePicture != null)
            {
                using var memoryStream = new MemoryStream();
                await userDetailDto.ProfilePicture.CopyToAsync(memoryStream);
                userDetail.ProfilePicture = memoryStream.ToArray();
            }



            _context.UserDetails.Update(userDetail);
            await _context.SaveChangesAsync();

            return Ok(new { message = "User details updated successfully" });
            } catch (Exception ex) {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet]
        [RequestSizeLimit(100 * 1024 * 1024)] // 100MB limit
        [Route("profile/{id}")]
        public async Task<IActionResult> GetProfile(string id)
        {
            var userDetail = await _context.UserDetails.FirstOrDefaultAsync(ud => ud.Id == id);

            if (userDetail == null)
            {
                return NotFound();
            }

            return Ok(userDetail);
        }

        // Individual profile picture download
        [HttpGet]
        [RequestSizeLimit(100 * 1024 * 1024)] // 100MB limit
        [Route("profile/picture/{id}")]
        public async Task<IActionResult> GetProfilePicture(string id)
        {
            var userDetail = await _context.UserDetails.FirstOrDefaultAsync(ud => ud.Id == id);

            if (userDetail == null)
            {
                return NotFound();
            }

            return File(userDetail.ProfilePicture, "image/jpeg");
        }



    }
}