namespace ProxyMity.Application.Core.Behaviours.Messaging;

public interface ICommand : IRequest { }

public interface ICommand<TResponse> : IRequest<TResponse> { }
