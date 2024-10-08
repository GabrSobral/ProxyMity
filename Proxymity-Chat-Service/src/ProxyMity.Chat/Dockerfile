FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
WORKDIR /app
EXPOSE 5000

ENV ASPNETCORE_URLS=http://+:5000

USER app
FROM --platform=$BUILDPLATFORM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG configuration=Release

WORKDIR /src

COPY ["ProxyMity.Chat/ProxyMity.Chat.csproj", "ProxyMity.Chat/"]
COPY ["ProxyMity.Domain/ProxyMity.Domain.csproj", "ProxyMity.Domain/"]
COPY ["ProxyMity.Application/ProxyMity.Application.csproj", "ProxyMity.Application/"]
COPY ["ProxyMity.Presentation/ProxyMity.Presentation.csproj", "ProxyMity.Presentation/"]
COPY ["ProxyMity.Infra.Database/ProxyMity.Infra.Database.csproj", "ProxyMity.Infra.Database/"]

RUN dotnet restore "ProxyMity.Chat/ProxyMity.Chat.csproj"
COPY . . 
WORKDIR "/src/ProxyMity.Chat"
RUN dotnet build "ProxyMity.Chat.csproj" -c $configuration -o /app/build

FROM build AS publish
ARG configuration=Release
RUN dotnet publish "ProxyMity.Chat.csproj" -c $configuration -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProxyMity.Chat.dll"]