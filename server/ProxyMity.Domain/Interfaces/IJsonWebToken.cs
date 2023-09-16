namespace ProxyMity.Domain.Interfaces;

public interface IJsonWebToken
{
    public string Sign(User user);
    public bool Validate(string token);
}
