namespace ProxyMity.Application.Handlers.Authentication.SignIn;

public record SignInCommand(
    string Email,
    string Password
) : ICommand<SignInResponse>;

public record SignInResponse {
    public string Name { get; set; }
    public string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastOnline { get; set; }
    public string? PhotoUrl { get; set; }
    public string Token { get; set; }

    public SignInResponse(User user, string token) {
        Name = user.Name;
        Email = user.Email;
        CreatedAt = user.CreatedAt;
        LastOnline = user.LastOnline;
        PhotoUrl = user?.PhotoUrl;
        Token = token;
    }
};