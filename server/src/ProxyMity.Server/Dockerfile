#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:7.0 AS base
WORKDIR /app
EXPOSE 80
EXPOSE 443

ENV ASPNETCORE_URLS=http://+:5000

FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /src
COPY ["ProxyMity.Server/ProxyMity.Server.csproj", "ProxyMity.Server/"]
COPY ["ProxyMity.Presentation/ProxyMity.Presentation.csproj", "ProxyMity.Presentation/"]
COPY ["ProxyMity.Application.Authentication/ProxyMity.Application.Authentication.csproj", "ProxyMity.Application.Authentication/"]
COPY ["ProxyMity.Domain/ProxyMity.Domain.csproj", "ProxyMity.Domain/"]
COPY ["ProxyMity.Application/ProxyMity.Application.csproj", "ProxyMity.Application/"]
COPY ["ProxyMity.Infra.Database/ProxyMity.Infra.Database.csproj", "ProxyMity.Infra.Database/"]
RUN dotnet restore "ProxyMity.Server/ProxyMity.Server.csproj"
COPY . .
WORKDIR "/src/ProxyMity.Server"
RUN dotnet build "ProxyMity.Server.csproj" -c Release -o /app/build

FROM build AS publish
RUN dotnet publish "ProxyMity.Server.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "ProxyMity.Server.dll"]