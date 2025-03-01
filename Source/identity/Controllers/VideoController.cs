using Microsoft.AspNetCore.Mvc;
using System.IO;

[Route("api/video")]
[ApiController]
public class VideoController : ControllerBase
{
    [HttpGet("stream")]
    public IActionResult StreamVideo()
    {
        var filePath = Path.Combine("Uploads", "file1.mp4");

        if (!System.IO.File.Exists(filePath))
        {
            return NotFound("Video not found.");
        }

        var stream = new FileStream(filePath, FileMode.Open, FileAccess.Read, FileShare.Read);
        return File(stream, "video/mp4", enableRangeProcessing: true);
    }
}
