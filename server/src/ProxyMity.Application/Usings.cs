global using FluentValidation;
global using MediatR;
global using Microsoft.EntityFrameworkCore;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Logging;
global using ProxyMity.Application.Authentication;
global using ProxyMity.Application.Core.Behaviours.Messaging;
global using ProxyMity.Application.Core.Exceptions;
global using ProxyMity.Application.Handlers.Authentication.SignIn;
global using ProxyMity.Domain.Entities;
global using ProxyMity.Domain.Enums;
global using ProxyMity.Domain.Exceptions;
global using ProxyMity.Domain.Interfaces.Authentication;
global using ProxyMity.Domain.Interfaces.Repositories.ConversationRepository;
global using ProxyMity.Domain.Interfaces.Repositories.GroupRepository;
global using ProxyMity.Domain.Interfaces.Repositories.MessageRepository;
global using ProxyMity.Domain.Interfaces.Repositories.MessageStatusRepository;
global using ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository;
global using ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository.CustomQueries;
global using ProxyMity.Domain.Interfaces.Repositories.UserRepository;
global using System.Reflection;
global using ProxyMity.Infra.Database.Contexts;





