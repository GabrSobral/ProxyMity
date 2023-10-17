namespace ProxyMity.Domain.Interfaces.Authentication;

public interface IJsonWebToken {
    public string Sign(User user);
}
