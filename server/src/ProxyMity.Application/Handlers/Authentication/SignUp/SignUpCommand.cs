namespace ProxyMity.Application.Handlers.Authentication.SignUp;

public record SignUpCommand(
    string Name,
    string Email,
    string Password
) : ICommand<SignUpResponse>;

public record SignUpResponse {
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastOnline { get; set; }
    public string? PhotoUrl { get; set; }
    public string Token { get; set; }

    public SignUpResponse(User user, string token) {
        Name = user.Name;
        Email = user.Email;
        CreatedAt = user.CreatedAt;
        LastOnline = user.LastOnline;
        PhotoUrl = user?.PhotoUrl;
        Token = token;
    }
};