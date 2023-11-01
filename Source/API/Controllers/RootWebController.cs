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

    [HttpGet("")]
    public string Get()
    {
       return "I am here!";
    }
    [HttpGet("add/")]
    public int Get(int num1, int num2)
    {
       return num1 + num2;
    }
}
