namespace ProxyMity.Application.ViewModels;

public record UserViewModel(
    string Name,
    string Email,
    string PhotoUrl,
    DateTime CreatedAt,
    DateTime LastOnline
);
