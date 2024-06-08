namespace ProxyMity.Application.Handlers.Users.GetById;

public record GetByIdQuery(
    Ulid Id
) : IQuery<GetByIdResponse>;

public record GetByIdResponse
{
    public Ulid Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string Email { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastOnline { get; set; }

    public GetByIdResponse(User user)
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
