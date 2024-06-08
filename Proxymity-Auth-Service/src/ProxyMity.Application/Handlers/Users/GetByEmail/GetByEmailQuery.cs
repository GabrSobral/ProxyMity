namespace ProxyMity.Application.Handlers.Users.GetByEmail;

public record GetByEmailQuery(
    string Email
) : IQuery<GetByEmailResponse>;

public record GetByEmailResponse
{
    public Ulid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastOnline { get; set; }

    public GetByEmailResponse(User user)
    {
        Id = user.Id;
        FirstName = user.FirstName;
        LastName = user.LastName;
        Email = user.Email;
        PhotoUrl = user.PhotoUrl;
        CreatedAt = user.CreatedAt;
        LastOnline = user.LastOnline;
    }
};
