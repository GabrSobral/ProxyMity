
#region Packages
global using Asp.Versioning;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.OpenApi.Models;
global using Microsoft.Extensions.Options;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.IdentityModel.Tokens;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
#endregion

#region System
global using System.Net;
global using System.Text;
global using System.Text.Json;
#endregion

#region Server
global using ProxyMity.Auth.Middlewares;
global using ProxyMity.Auth.Configuration;
global using ProxyMity.Auth.OptionsSetup;
#endregion

#region Domain
global using ProxyMity.Domain.Exceptions;
#endregion

#region Application
global using ProxyMity.Application;
global using ProxyMity.Application.Core;
global using ProxyMity.Application.Core.Exceptions;
#endregion

#region Infraestruture Data
global using ProxyMity.Infra.Database;
global using ProxyMity.Infra.Database.Contexts;

#endregion

#region Presentation
global using ProxyMity.Presentation;
#endregion
