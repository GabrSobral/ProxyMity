namespace ProxyMity.Application.Authentication;

public class PasswordEncrypter : IPasswordEncrypter
{
    private readonly byte[] _salt = new byte[32];
    private readonly int _iterations = 4;
    private readonly int _memorySize = 8192;

    public string Encrypt<T>(string rawPassword, T? userId)
    {
        byte[] password = Encoding.UTF8.GetBytes(rawPassword);
        byte[] userUuidBytes = Encoding.UTF8.GetBytes(userId == null ? "" : userId.ToString()!);

        using var argon2 = new Argon2i(password);

        argon2.DegreeOfParallelism = Environment.ProcessorCount; // Threads number of server
        argon2.MemorySize = _memorySize;
        argon2.Iterations = _iterations;
        argon2.Salt = _salt;
        argon2.AssociatedData = userUuidBytes;

        byte[] encryptedPassword = argon2.GetBytes(64);

        Console.WriteLine(Convert.ToBase64String(encryptedPassword));

        return Convert.ToBase64String(encryptedPassword);
    }

    public bool Compare<T>(string storedPassword, string enteredPassword, T? userId)
    {
        var encryptedPassword = Encrypt(enteredPassword, userId);

        return encryptedPassword == storedPassword;
    }
}
