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
    [HttpGet("add/",Name="Add")]
    public int Add(int num1, int num2)
    {
       return num1 + num2;
    }

    [HttpGet("sub/", Name="Sub")]
    public int Sub(int num1, int num2)
    {
       return num1 - num2;
    }

    [HttpGet("mul/", Name="Mul")]
    public int Mul(int num1, int num2)
    {
       return num1 * num2;
    }

    [HttpGet("div/", Name="Div")]
    public int Div(int num1, int num2)
    {
       return num1 / num2;
    }
}
