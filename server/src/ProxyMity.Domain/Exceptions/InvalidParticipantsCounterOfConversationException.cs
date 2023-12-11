namespace ProxyMity.Domain.Exceptions;

public class InvalidParticipantsCounterOfConversationException : Exception
{
    public InvalidParticipantsCounterOfConversationException(int participantsCount)
        : base($"Private conversation cannot be created with a number of participants different than {participantsCount}") { }

    public InvalidParticipantsCounterOfConversationException()
        : base($"Group conversation cannot be created with a number of participants less than 2") { }
}
