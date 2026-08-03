# _TheApplication

A lightweight technology workspace that combines a Next.js dashboard with a .NET API service, orchestrated locally through Docker Compose and deployed to Azure through GitHub Actions and Terraform.

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

    subgraph AzureInfra[Azure Infrastructure via Terraform]
        RG[Resource Group]
        Plan[Linux App Service Plan]
        FrontendWeb[Next.js Web App]
        BackendWeb[.NET Web App]
        MI[Managed Identity\nOIDC federated access]
        State[Terraform State\nBlob Storage]
    end

    Terraform[Terraform Workflow] -->|provisions| RG
    RG --> Plan
    Plan --> FrontendWeb
    Plan --> BackendWeb
    MI -->|OIDC + Contributor access| RG
    Terraform -->|remote state| State

    FrontendWeb -->|API_BASE_URL app setting| BackendWeb
    BackendWeb -->|health endpoint| ApiService

    classDef frontend fill:#e8f5e9,stroke:#2e7d32,color:#1b5e20,stroke-width:1px;
    classDef server fill:#e3f2fd,stroke:#1565c0,color:#0d47a1,stroke-width:1px;
    classDef user fill:#fff3e0,stroke:#ef6c00,color:#e65100,stroke-width:1px;
    classDef infra fill:#f3e5f5,stroke:#6a1b9a,color:#4a148c,stroke-width:1px;

    class User user;
    class Dashboard frontend;
    class NodeRoute frontend;
    class ApiService server;
    class RG,Plan,FrontendWeb,BackendWeb,MI,State infra;
    class GitHub,GHCR,Terraform,Azure infra;
```

## Run locally

```bash
docker compose up --build
docker compose down
```

Access the apps at:
- Dashboard: `http://localhost:3000`
- API: `http://localhost:8080`

## Azure deployment with Terraform and GitHub Actions

This repository also includes a Terraform configuration for provisioning the Azure infrastructure that hosts both applications.

### Infrastructure provisioned
- Shared Azure Linux App Service Plan
- Azure Linux Web App for the Next.js dashboard
- Azure Linux Web App for the .NET API backend
- Remote Terraform state stored in Azure Storage

### Terraform workflow prerequisites
Before running the Terraform workflow, the following Azure prerequisites must already exist:
- A target Azure resource group
- A managed identity configured for GitHub OIDC federation
- Contributor access for that managed identity on the target resource group
- A storage account with a blob container named `tfstate`

### GitHub workflow and deployment model
- The Next.js workflow builds the app, pushes the container image to GHCR, and deploys it to Azure Web Apps.
- The .NET workflow follows the same build-and-push pattern, then deploys the backend container image to Azure.
- The Terraform workflow uses GitHub OIDC authentication and remote state configuration to provision and manage the Azure app infrastructure.

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