namespace ProxyMity.Application.ViewModels;

public class AuthenticateViewModel
{
    public required string Name { get; set; }
    public required string Email { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastOnline { get; set; }
    public required string PhotoUrl { get; set; }
    public required string Token { get; set; }
}
