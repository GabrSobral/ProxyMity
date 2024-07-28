global using System.Reflection;
global using System.Security.Claims;

global using MediatR;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.Extensions.DependencyInjection;

global using ProxyMity.Domain.Exceptions;

global using ProxyMity.Application.Handlers.Authentication.SignIn;
global using ProxyMity.Application.Handlers.Authentication.SignUp;
global using ProxyMity.Application.Handlers.Users.Queries.GetById;
global using ProxyMity.Application.Handlers.Users.Queries.GetByEmail;
global using ProxyMity.Application.Handlers.Users.Commands.UpdateUserData;
global using ProxyMity.Application.Handlers.Users.Commands.ChangePassword;
global using ProxyMity.Application.Handlers.Authentication.RevokeAccessToken;

global using ProxyMity.Application.Handlers.Authentication.ConfirmEmail;
global using ProxyMity.Application.Handlers.Authentication.ForgotPassword;
global using ProxyMity.Application.Handlers.Authentication.ForgotPasswordSendMail;

global using ProxyMity.Presentation.Http.Utils;