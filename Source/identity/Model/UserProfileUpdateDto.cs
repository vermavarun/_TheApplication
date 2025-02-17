public class UserDetailDto
{
    public string Id { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string Country { get; set; } = "";

    public IFormFile? ProfilePicture { get; set; } // Used only for API requests
}
