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
       return $"Service is Up on {Environment.MachineName}";
    }
    [HttpGet("add/",Name="Add")]
    public string Add(int num1, int num2)
    {
        var result = string.Empty;
        try{
         result = (num1 + num2).ToString();
        }
        catch (Exception e) {
            return e.Message;
        }
       return result.ToString();
    }

    [HttpGet("sub/", Name="Sub")]
    public string Sub(int num1, int num2)
    {
        var result = string.Empty;
        try{
         result = (num1 - num2).ToString();
        }
        catch (Exception e) {
            return e.Message;
        }
       return result.ToString();
    }

    [HttpGet("mul/", Name="Mul")]
    public string Mul(int num1, int num2)
    {
        var result = string.Empty;
        try{
         result = (num1 * num2).ToString();
        }
        catch (Exception e) {
            return e.Message;
        }
       return result.ToString();
    }

    [HttpGet("div/", Name="Div")]
    public string Div(int num1, int num2)
    {
        var result = string.Empty;
        try{
         result = (num1 / num2).ToString();
        }
        catch (Exception e) {
            return e.Message;
        }
       return result.ToString();
    }
}
