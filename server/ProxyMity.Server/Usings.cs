
#region Packages
global using AutoMapper;

global using Microsoft.OpenApi.Models;
global using Microsoft.EntityFrameworkCore;

global using Microsoft.AspNetCore.Mvc;
#endregion

#region System
global using System.Net;
global using System.Text.Json;
#endregion

#region Server
global using ProxyMity.Server.AutoMapper;
global using ProxyMity.Server.Middlewares;
global using ProxyMity.Server.Configuration;
#endregion

#region Presentation 
global using ProxyMity.Application.Services;
global using ProxyMity.Application.InputModels;
#endregion

#region Domain
global using ProxyMity.Domain.Entities;
global using ProxyMity.Domain.Interfaces;
global using ProxyMity.Domain.Exceptions;
#endregion

#region Application
global using ProxyMity.Application.ViewModels;
global using ProxyMity.Application.Authentication;
#endregion

#region Infraestruture Data
global using ProxyMity.Infraestructure.Data.Context;
#endregion
