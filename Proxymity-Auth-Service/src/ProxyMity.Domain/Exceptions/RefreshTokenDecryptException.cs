﻿namespace ProxyMity.Domain.Exceptions;

public class RefreshTokenDecryptException(): Exception("Error on trying to descrypt refresh token")
{
}