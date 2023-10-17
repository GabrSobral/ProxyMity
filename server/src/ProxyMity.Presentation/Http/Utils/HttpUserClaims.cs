namespace ProxyMity.Presentation.Http.Utils;

public static class HttpUserClaims
{
    public static Guid GetId(HttpContext httpContext)
    {
        var userIdString = httpContext.User.Claims.FirstOrDefault(x => x.Type == ClaimTypes.NameIdentifier)?.Value
            ?? throw new UserNotFoundException();

        var userId = Guid.Parse(userIdString);

        return userId;
    }
}
