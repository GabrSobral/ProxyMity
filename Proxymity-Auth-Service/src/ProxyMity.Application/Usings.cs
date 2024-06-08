global using MediatR;
global using FluentValidation;
global using System.Reflection;
global using Microsoft.Extensions.Options;
global using Microsoft.Extensions.Logging;
global using Microsoft.IdentityModel.Tokens;
global using Konscious.Security.Cryptography;
global using Microsoft.Extensions.DependencyInjection;

global using ProxyMity.Domain.Entities;
global using ProxyMity.Domain.Exceptions;
global using ProxyMity.Domain.Interfaces.Authentication;
global using ProxyMity.Domain.Interfaces.Repositories.UserRepository;

global using ProxyMity.Application.Core;
global using ProxyMity.Application.Core.Exceptions;
global using ProxyMity.Application.Core.Behaviours;
global using ProxyMity.Application.Core.Behaviours.Messaging;
global using ProxyMity.Application.Handlers.Authentication.SignIn;

global using ProxyMity.Infra.Database.Contexts;

global using System.Text;
global using System.IdentityModel.Tokens.Jwt;
global using System.Security.Claims;