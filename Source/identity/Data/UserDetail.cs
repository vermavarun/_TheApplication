using System.Text.Json;
using System.Text.Json.Serialization;

public class UserDetail {
    public string Id { get; set; } = "";
    public string Address { get; set; } = "";
    public string City { get; set; } = "";
    public string State { get; set; } = "";
    public string Country {get; set;} = "";
    public byte[] ProfilePicture {get; set;} = [];
    public byte[] Resume {get; set;} = [];  
}
