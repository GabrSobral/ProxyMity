namespace ProxyMity.Application.Handlers.Users.GetById;

public record GetByIdQuery(
    Guid Id
) : IQuery<GetByIdResponse>;

public record GetByIdResponse {
    public Guid Id { get; set; }
    public string Name { get; set; }
    public string Email { get; set; }
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime? LastOnline { get; set; }

    public GetByIdResponse(User user) {
        Id = user.Id;
        Name = user.Name;
        Email = user.Email;
        PhotoUrl = user.PhotoUrl;
        CreatedAt = user.CreatedAt;
        LastOnline = user.LastOnline;
    }
};
