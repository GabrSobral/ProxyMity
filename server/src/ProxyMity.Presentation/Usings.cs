﻿global using FluentValidation;
global using MediatR;
global using MessagePack;
global using Microsoft.AspNetCore.Authorization;
global using Microsoft.AspNetCore.Builder;
global using Microsoft.AspNetCore.Http;
global using Microsoft.AspNetCore.Mvc;
global using Microsoft.AspNetCore.Routing;
global using Microsoft.AspNetCore.SignalR;
global using Microsoft.Extensions.DependencyInjection;
global using Microsoft.Extensions.Logging;
global using ProxyMity.Application.Handlers.Authentication.SignIn;
global using ProxyMity.Application.Handlers.Authentication.SignUp;
global using ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;
global using ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;
global using ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;
global using ProxyMity.Application.Handlers.Conversations.Queries.GetUserConversations;
global using ProxyMity.Application.Handlers.Messages.Commands.SaveMessage;
global using ProxyMity.Application.Handlers.Messages.Commands.UpdateMessageStatus;
global using ProxyMity.Application.Handlers.Users.GetByEmail;
global using ProxyMity.Application.Handlers.Users.GetById;
global using ProxyMity.Application.Handlers.Conversations.Queries.GetConversationMessages;
global using ProxyMity.Domain.Entities;
global using ProxyMity.Domain.Enums;
global using ProxyMity.Domain.Exceptions;
global using ProxyMity.Presentation.Http.Utils;
global using ProxyMity.Presentation.WebSocket.Hubs.Contracts;
global using ProxyMity.Presentation.WebSocket.Hubs.Payloads;
global using System.Reflection;
global using System.Security.Claims;
global using ProxyMity.Application.Handlers.Messages.Queries.GetStatusFromMessage;
global using ProxyMity.Application.Handlers.Messages.Commands.ReceivePendingMessages;


