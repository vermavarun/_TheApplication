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
[RequestSizeLimit(1024L * 1024 * 1024 * 5)] // 5GB limit
public async Task<IActionResult> UploadLargeFile(CancellationToken cancellationToken)
{
    var request = HttpContext.Request;

    if (!request.HasFormContentType || !request.Form.Files.Any())
    {
        return BadRequest("No file uploaded.");
    }

    var file = request.Form.Files[0];
    var fileName = request.Form["fileName"].ToString();
    var chunkStart = long.Parse(request.Form["chunkStart"].ToString()); // Position of this chunk

    var filePath = Path.Combine("Uploads", fileName);
    Directory.CreateDirectory("Uploads"); // Ensure directory exists

    try
    {
        // Open or create file and allow appending
        await using var fileStream = new FileStream(filePath, FileMode.OpenOrCreate, FileAccess.Write, FileShare.ReadWrite);

        // Move to the correct chunk position
        fileStream.Seek(chunkStart, SeekOrigin.Begin);

        // Write the chunk data
        await file.CopyToAsync(fileStream, cancellationToken);

        // Ensure all data is written before releasing the file
        await fileStream.FlushAsync(cancellationToken);

        return Ok(new { message = "Chunk uploaded successfully", fileName });
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = "File upload failed", details = ex.Message });
    }
}





        [HttpGet("download-large-file")]
public async Task<IActionResult> DownloadLargeFile([FromQuery] string fileName, [FromQuery] bool metadata = false,
    [FromQuery] long? start = null, [FromQuery] int? chunkSize = null, CancellationToken cancellationToken = default)
{
    var filePath = Path.Combine("Uploads", fileName);
    if (!System.IO.File.Exists(filePath))
    {
        return NotFound(new { error = "File not found" });
    }

    // Return metadata (file size)
    if (metadata)
    {
        var fileInfo = new FileInfo(filePath);
        return Ok(new { fileSize = fileInfo.Length });
    }

    // Validate chunk request
    if (start == null || chunkSize == null)
    {
        return BadRequest(new { error = "Invalid chunk request" });
    }

    try
    {
        var fileInfo = new FileInfo(filePath);
        var totalSize = fileInfo.Length;
        var buffer = new byte[chunkSize.Value];

        await using var fileStream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        fileStream.Seek(start.Value, SeekOrigin.Begin);

        var bytesRead = await fileStream.ReadAsync(buffer, 0, buffer.Length, cancellationToken);
        var chunk = new MemoryStream(buffer, 0, bytesRead);

        return File(chunk, "application/octet-stream", fileName);
    }
    catch (Exception ex)
    {
        return StatusCode(500, new { error = "Error streaming file", details = ex.Message });
    }
}





    }
}