# _TheApplication

A lightweight technology workspace that combines a Next.js dashboard with a .NET API service, orchestrated locally through Docker Compose and deployed to Azure through GitHub Actions.

## Architecture

```mermaid
flowchart LR
    User[Browser] -->|localhost:3000| Dashboard[Next.js Dashboard\nNode.js frontend]
    Dashboard -->|/api/health| NodeRoute[Next.js Server Route\nreads API_BASE_URL]
    NodeRoute -->|dotnet-apis-dashboard:8080/health| ApiService[.NET API Service\nASP.NET Core]

    subgraph Local[Local Development]
        Dashboard
        ApiService
    end

    GitHub[GitHub Actions] -->|build + push images| GHCR[GitHub Container Registry]
    GHCR -->|deploy container| Azure[Azure App Service]

    classDef frontend fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20,stroke-width:1px;
    classDef server fill:#e3f2fd,stroke:#1565c0,color:#0d47a1,stroke-width:1px;
    classDef user fill:#fff3e0,stroke:#ef6c00,color:#e65100,stroke-width:1px;
    classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c,stroke-width:1px;

    class User user;
    class Dashboard frontend;
    class NodeRoute frontend;
    class ApiService server;
    class GitHub,GHCR,Azure infra;
```

  Terraform-specific infrastructure details live in [terraform-dashboard/README.md](terraform-dashboard/README.md).

## Run locally

```bash
docker compose up --build
docker compose down
```

Access the apps at:
- Dashboard: `http://localhost:3000`
- API: `http://localhost:8080`

## Azure deployment

The Azure deployment is handled through GitHub Actions and container images. For the Terraform infrastructure details, see [terraform-dashboard/README.md](terraform-dashboard/README.md).

## Projects

### 1) Next.js Dashboard
- Build local and docker
  [![nextjs-dashboard-build](https://github.com/vermavarun/_TheApplication/actions/workflows/nextjs-dashboard.yaml/badge.svg)](https://github.com/vermavarun/_TheApplication/actions/workflows/nextjs-dashboard.yaml)

### 2) .NET APIs
- Build local and docker
  [![dotnet-apis-dashboard-build](https://github.com/vermavarun/_TheApplication/actions/workflows/dotnet-apis-dashboard.yaml/badge.svg)](https://github.com/vermavarun/_TheApplication/actions/workflows/dotnet-apis-dashboard.yaml)

### 3) Terraform Azure Infrastructure
- Provision Azure infrastructure and remote state
  [![terraform-dashboard](https://github.com/vermavarun/_TheApplication/actions/workflows/terraform-dashboard.yaml/badge.svg)](https://github.com/vermavarun/_TheApplication/actions/workflows/terraform-dashboard.yaml)