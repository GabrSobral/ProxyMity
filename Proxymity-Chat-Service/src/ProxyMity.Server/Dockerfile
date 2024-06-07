FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release

WORKDIR /src

COPY ["ProxyMity.Server/ProxyMity.Server.csproj", "ProxyMity.Server/"]
COPY ["ProxyMity.Domain/ProxyMity.Domain.csproj", "ProxyMity.Domain/"]
COPY ["ProxyMity.Application/ProxyMity.Application.csproj", "ProxyMity.Application/"]
COPY ["ProxyMity.Application.Authentication/ProxyMity.Application.Authentication.csproj", "ProxyMity.Application.Authentication/"]
COPY ["ProxyMity.Presentation/ProxyMity.Presentation.csproj", "ProxyMity.Presentation/"]
COPY ["ProxyMity.Infra.Database/ProxyMity.Infra.Database.csproj", "ProxyMity.Infra.Database/"]

RUN dotnet restore "ProxyMity.Server/ProxyMity.Server.csproj"
COPY . . 
WORKDIR "/src/ProxyMity.Server"
RUN dotnet build "ProxyMity.Server.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "ProxyMity.Server.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProxyMity.Server.dll"]