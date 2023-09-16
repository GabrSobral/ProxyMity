namespace ProxyMity.Server.AutoMapper;

public class MapConfig
{
    public static MapperConfiguration RegisterMaps()
    {
        var mapConfig = new MapperConfiguration(config =>
        {
            config.CreateMap<User, AuthenticateViewModel>().ReverseMap();
            config.CreateMap<User, UserViewModel>().ReverseMap();
        });

        return mapConfig;
    }
}
