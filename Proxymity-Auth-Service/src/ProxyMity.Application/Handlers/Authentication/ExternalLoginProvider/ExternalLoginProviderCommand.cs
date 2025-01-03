﻿namespace ProxyMity.Application.Handlers.Authentication.ExternalLoginProvider;

public record ExternalLoginProviderCommand(
    EAuthProviders Provider,
    string ProviderKey,
    string Email,
    string FirstName,
    string? LastName
): ICommand<ExternalLoginProviderResponse>;

public record ExternalLoginProviderResponse(
    Guid Id,
    string FirstName,
    string? LastName,
    string Email,
    DateTime CreatedAt,
    DateTime? UpdatedAt,
    bool IsEmailConfirmed);