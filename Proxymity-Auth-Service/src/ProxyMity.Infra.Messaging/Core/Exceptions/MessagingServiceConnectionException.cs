namespace ProxyMity.Infra.Messaging.Core.Exceptions;

public class MessagingServiceConnectionException: Exception
{
    public MessagingServiceConnectionException() : base("Error on trying to connect on messaging service."){ }
}
