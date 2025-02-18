using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Identity;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace Users.Controllers
{
    [ApiController]
    [Route("api/users")]
    public class FilesController : ControllerBase
    {
        private readonly UserManager<UserModel> _userManager;
        private readonly ApplicationDbContext _context;
        public FilesController(UserManager<UserModel> userManager, ApplicationDbContext context)
        {
            _userManager = userManager;
            _context = context;
        }

        

        [HttpPost("upload-large-file")]
        [RequestSizeLimit(1024 * 1024 * 1024 * 1)] // 1GB limit
        public async Task<IActionResult> UploadLargeFile(CancellationToken cancellationToken)
        {
            var request = HttpContext.Request;
            if (!request.HasFormContentType || !request.Form.Files.Any())
            {
                return BadRequest("No file uploaded.");
            }

            var file = request.Form.Files[0];
            var filePath = Path.Combine("Uploads", file.FileName); // Store in "Uploads" folder

            // Create the directory if not exists
            Directory.CreateDirectory("Uploads");

            // Open file stream and write in chunks
            await using var fileStream = new FileStream(filePath, FileMode.Create, FileAccess.Write, FileShare.None, 4096, true);
            await file.CopyToAsync(fileStream, cancellationToken);

            return Ok(new { message = "File uploaded successfully", fileName = file.FileName });
        }


        [HttpGet("download-large-file/{fileName}")]
        public async Task<IActionResult> DownloadLargeFile(string fileName)
        {
            var filePath = Path.Combine("Uploads", fileName);

            if (!System.IO.File.Exists(filePath))
            {
                return NotFound("File not found.");
            }

            var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
            return File(fileStream, "application/octet-stream", fileName, enableRangeProcessing: true);
        }




    }
}