using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[ApiController]
[Route("")]
public class RootWebController : ControllerBase
{
  
    private readonly ILogger<RootWebController> _logger;

    public RootWebController(ILogger<RootWebController> logger)
    {
        _logger = logger;
    }

    [HttpGet(Name = "")]
    public string Get()
    {
       return "I am here!";
    }
}
