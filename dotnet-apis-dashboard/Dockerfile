# syntax=docker/dockerfile:1

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ["dotnet-apis-dashboard.csproj", "./"]
RUN dotnet restore "./dotnet-apis-dashboard.csproj"

COPY . .
RUN dotnet publish "./dotnet-apis-dashboard.csproj" -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app

ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080

COPY --from=build /app/publish .

ENTRYPOINT ["dotnet", "dotnet-apis-dashboard.dll"]
