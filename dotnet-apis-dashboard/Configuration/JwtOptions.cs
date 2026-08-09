public class JwtOptions
{
    public string Issuer { get; set; } = "dotnet-apis-dashboard";
    public string Audience { get; set; } = "nextjs-dashboard";
    public string Secret { get; set; } = string.Empty;
    public int ExpiryMinutes { get; set; } = 60;
}