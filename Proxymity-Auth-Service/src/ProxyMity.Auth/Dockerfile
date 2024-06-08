FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5001

ENV ASPNETCORE_URLS=http://+:5001

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release

WORKDIR /src

COPY ["ProxyMity.Auth/ProxyMity.Auth.csproj", "ProxyMity.Auth/"]
COPY ["ProxyMity.Domain/ProxyMity.Domain.csproj", "ProxyMity.Domain/"]
COPY ["ProxyMity.Application/ProxyMity.Application.csproj", "ProxyMity.Application/"]
COPY ["ProxyMity.Presentation/ProxyMity.Presentation.csproj", "ProxyMity.Presentation/"]
COPY ["ProxyMity.Infra.Database/ProxyMity.Infra.Database.csproj", "ProxyMity.Infra.Database/"]

RUN dotnet restore "ProxyMity.Auth/ProxyMity.Auth.csproj"
COPY . . 
WORKDIR "/src/ProxyMity.Auth"
RUN dotnet build "ProxyMity.Auth.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "ProxyMity.Auth.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProxyMity.Auth.dll"]