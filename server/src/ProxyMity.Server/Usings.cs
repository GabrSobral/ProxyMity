
#region Packages
global using Microsoft.OpenApi.Models;
global using Microsoft.Extensions.Options;
global using Microsoft.IdentityModel.Tokens;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Mvc.Versioning;
global using Microsoft.AspNetCore.Authentication.JwtBearer;
#endregion

#region System
global using System.Net;
global using System.Text.Json;
global using System.Text;
#endregion

#region Server
global using ProxyMity.Server.Middlewares;
global using ProxyMity.Server.Configuration;
global using ProxyMity.Server.OptionsSetup;
#endregion

#region Domain
global using ProxyMity.Domain.Exceptions;
#endregion

#region Application
global using ProxyMity.Application.Core.Exceptions;
global using ProxyMity.Application.Authentication;
global using ProxyMity.Application;
#endregion

#region Infraestruture Data
global using ProxyMity.Infra.Database;
#endregion

#region Presentation
global using ProxyMity.Presentation.Http.Endpoints;
global using ProxyMity.Presentation.WebSocket.Hubs;
global using ProxyMity.Presentation;
#endregion
