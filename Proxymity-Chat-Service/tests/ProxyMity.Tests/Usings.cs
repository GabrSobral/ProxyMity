global using FluentValidation;
global using Microsoft.Extensions.Logging;
global using Microsoft.Extensions.Options;
global using ProxyMity.Application.Authentication;
global using ProxyMity.Application.Handlers.Authentication.SignIn;
global using ProxyMity.Application.Handlers.Conversations.Commands.CreateGroupConversation;
global using ProxyMity.Application.Handlers.Conversations.Commands.CreatePrivateConversation;
global using ProxyMity.Application.Handlers.Conversations.Commands.ReadConversationMessages;
global using ProxyMity.Application.Handlers.Conversations.Commands.PinConversation;
global using ProxyMity.Application.Handlers.Conversations.Commands.UnpinConversation;
global using ProxyMity.Application.Handlers.Friendships.Commands.CreateFriendshipInvite;
global using ProxyMity.Application.Handlers.Friendships.Commands.AcceptFriendshipInvite;
global using ProxyMity.Application.Handlers.Friendships.Commands.DenyFriendshipInvite;
global using ProxyMity.Application.Handlers.Messages.Commands.SaveMessage;
global using ProxyMity.Application.Handlers.Users.GetByEmail;
global using ProxyMity.Application.Handlers.Users.GetById;
global using ProxyMity.Domain.Entities;
global using ProxyMity.Domain.Enums;
global using ProxyMity.Domain.Exceptions;
global using ProxyMity.Domain.Interfaces.Authentication;
global using ProxyMity.Domain.Interfaces.Repositories.ConversationRepository;
global using ProxyMity.Domain.Interfaces.Repositories.GroupRepository;
global using ProxyMity.Domain.Interfaces.Repositories.MessageRepository;
global using ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository;
global using ProxyMity.Domain.Interfaces.Repositories.FriendshipRepository;
global using ProxyMity.Domain.Interfaces.Repositories.ParticipantRepository.CustomQueries;
global using ProxyMity.Infra.Database.Contexts;
global using ProxyMity.Domain.Interfaces.Repositories.UserRepository;
global using ProxyMity.Unit.InMemoryRepositories;
global using ProxyMity.Unit.Interfaces;
global using ProxyMity.Unit.Utils;
global using Xunit;
global using Moq;




