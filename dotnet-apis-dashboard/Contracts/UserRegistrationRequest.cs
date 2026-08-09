public record UserRegistrationRequest(
    string Email,
    string Name,
    string Provider,
    string ProviderAccountId
);