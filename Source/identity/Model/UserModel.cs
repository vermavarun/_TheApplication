using Microsoft.AspNetCore.Identity;

public class UserModel: IdentityUser {
    public string FirstName { get; set; }
    public string LastName { get; set; }

}