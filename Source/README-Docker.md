# Docker Compose Setup

This Docker Compose configuration orchestrates the entire application stack including:
- SQL Server Database (Azure SQL Edge)
- Identity API (.NET 8)
- Next.js Frontend Application

## Quick Start

### Production Mode
```powershell
# Navigate to the Source directory
cd "d:\GitHub\_theapplication\Source"

# Build and start all services
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Development Mode
```powershell
# Navigate to the Source directory
cd "d:\GitHub\_theapplication\Source"

# Start development environment with hot reloading
docker-compose -f docker-compose.dev.yml up --build

# Or run in detached mode
docker-compose -f docker-compose.dev.yml up -d --build
```

## Services and Ports

| Service | Container Name | Port | URL |
|---------|---------------|------|-----|
| SQL Server | sql-server | 1433 | localhost:1433 |
| Identity API | identity-api | 5074 | http://localhost:5074 |
| Next.js App | next-app | 3000 | http://localhost:3000 |
| Swagger UI | identity-api | 5074 | http://localhost:5074/swagger |

## Environment Configuration

1. Copy the example environment file:
   ```powershell
   cp .env.example .env
   ```

2. Modify the `.env` file as needed for your environment.

## Database Setup

The Identity API will automatically:
1. Connect to SQL Server
2. Run Entity Framework migrations
3. Seed initial data (admin user and roles)

### Default Admin Credentials
- **Email**: admin@hotmail.com
- **Username**: admin@shaksz.com
- **Password**: Pass@123

## Useful Commands

### View logs
```powershell
# View logs for all services
docker-compose logs

# View logs for specific service
docker-compose logs identity-api
docker-compose logs next-app
docker-compose logs sqlserver
```

### Stop services
```powershell
# Stop all services
docker-compose down

# Stop and remove volumes (WARNING: This will delete database data)
docker-compose down -v
```

### Rebuild specific service
```powershell
# Rebuild only identity API
docker-compose up --build identity-api

# Rebuild only Next.js app
docker-compose up --build next-app
```

### Execute commands in containers
```powershell
# Access SQL Server
docker-compose exec sqlserver /opt/mssql-tools/bin/sqlcmd -S localhost -U sa -P Ggn@1234Ggn@1234

# Access Identity API container
docker-compose exec identity-api bash

# Access Next.js container
docker-compose exec next-app sh
```

## Development Features

The development compose file (`docker-compose.dev.yml`) includes:
- **Hot reloading** for both API and frontend
- **Volume mounting** for live code changes
- **Watch mode** for automatic rebuilds
- **Development optimizations**

## Troubleshooting

### Database Connection Issues
If you encounter database connection issues:
1. Ensure SQL Server container is fully started
2. Check connection string in environment variables
3. Verify port 1433 is not used by another service

### Port Conflicts
If ports are already in use:
1. Stop conflicting services
2. Modify port mappings in docker-compose.yml
3. Update environment variables accordingly

### Build Issues
If builds fail:
1. Clear Docker cache: `docker system prune -a`
2. Rebuild without cache: `docker-compose build --no-cache`
3. Check Dockerfile syntax and dependencies

## Network Architecture

All services communicate through a custom bridge network (`app-network`):
- Identity API connects to SQL Server using service name `sqlserver`
- Next.js app connects to Identity API using service name `identity-api`
- External access is through mapped ports only

## Data Persistence

- SQL Server data is persisted in Docker volume `sqlserver_data`
- Upload files are mounted to `./identity/Uploads` directory
- Volumes survive container restarts but not `docker-compose down -v`
