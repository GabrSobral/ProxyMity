﻿namespace ProxyMity.Application.Handlers.Authentication.SignIn;

public record SignInCommand(
    string Email,
    string Password
) : ICommand<SignInResponse>;

public record SignInResponse
{
    public UserResponse User { get; set; }
    public string AccessToken { get; set; }

    public SignInResponse(User user, string token)
    {
        User = new UserResponse(
            user.Id,
            user.FirstName,
            user.LastName ?? "",
            user.Email,
            user.CreatedAt,
            user.LastOnline,
            user.PhotoUrl
        );
        AccessToken = token;
    }
};

public record UserResponse(
    Ulid Id,
    string FirstName,
    string LastName,
    string Email,
    DateTime CreatedAt,
    DateTime? LastOnline,
    string? PhotoUrl
);