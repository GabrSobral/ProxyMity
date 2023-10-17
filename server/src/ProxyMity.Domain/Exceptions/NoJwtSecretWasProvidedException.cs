namespace ProxyMity.Domain.Exceptions;

public class NoJwtSecretWasProvidedException : Exception {
    public NoJwtSecretWasProvidedException() : base("No jwt secret was provided to appsettings.") { }
}
