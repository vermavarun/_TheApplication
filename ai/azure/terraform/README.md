# Azure MLOps Infrastructure

Terraform configuration for a production-grade Azure MLOps platform. All services are locked down behind private endpoints with no public network access.

## Architecture

```
VNet (10.10.0.0/16)
├── snet-private-endpoints (10.10.0.0/24)
│   ├── Private endpoint → Storage Account (blob + file)
│   ├── Private endpoint → Azure Container Registry
│   ├── Private endpoint → Key Vault
│   └── Private endpoint → AML Workspace
└── snet-compute (10.10.1.0/24)
    ├── CPU Compute Cluster (Dedicated, scales to 0)
    └── GPU Compute Cluster (LowPriority, scales to 0)

Supporting services (no public access):
  Azure ML Workspace → Storage, ACR, Key Vault, App Insights
  Log Analytics Workspace ← diagnostic logs from all resources
  Application Insights (workspace-based)
```

## Files

| File | Description |
|---|---|
| `provider.tf` | AzureRM provider + remote backend config |
| `variables.tf` | All input variables with validation |
| `locals.tf` | Name prefix, tags, private DNS zone map |
| `resource-group.tf` | Resource group |
| `networking.tf` | VNet, subnets, NSGs, private DNS zones + VNet links |
| `storage.tf` | Storage account, containers, diagnostic settings |
| `container-registry.tf` | ACR Premium, diagnostic settings |
| `key-vault.tf` | Key Vault Premium (RBAC, purge protection), diagnostic settings |
| `monitoring.tf` | Log Analytics workspace + Application Insights |
| `ml-workspace.tf` | Azure ML workspace, diagnostic settings |
| `ml-compute.tf` | CPU + GPU compute clusters (VNet-integrated, no public IP) |
| `private-endpoints.tf` | Private endpoints for all services |
| `role-assignments.tf` | RBAC for ML workspace and compute cluster managed identities |
| `outputs.tf` | Key resource IDs, names, and connection strings |

## Prerequisites

Before running the workflow for the first time:

1. **Remote state** — create a storage account and blob container named `tfstate` to hold Terraform state.
2. **Managed identity** — create a user-assigned managed identity with federated credentials for this repository (`vermavarun/_TheApplication`, branch `main`) using OIDC.
3. **Identity permissions** — assign the following roles to that managed identity on the target resource group:
   - `Contributor` — to create/manage resources
   - `User Access Administrator` — to assign RBAC roles to the ML workspace and compute cluster managed identities
4. **GitHub environment** — create an environment named `mlops-prod` in repository settings and add required reviewers to gate applies and destroys.

## GitHub Repository Variables & Secrets

Set these under **Settings → Secrets and variables → Actions**.

### Secrets

| Name | Description |
|---|---|
| `AZURE_CLIENT_ID` | Client ID of the managed identity used for OIDC login |
| `AZURE_TENANT_ID` | Azure AD tenant ID |
| `AZURE_SUBSCRIPTION_ID` | Target Azure subscription ID |

### Variables

#### Terraform remote state

| Name | Example | Description |
|---|---|---|
| `TF_STATE_RESOURCE_GROUP` | `rg-tfstate` | Resource group containing the state storage account |
| `TF_STATE_STORAGE_ACCOUNT` | `tfstatestorage001` | Storage account name for Terraform state |
| `TF_STATE_CONTAINER` | `tfstate` | Blob container name for Terraform state |
| `MLOPS_TF_STATE_KEY` | `mlops/prod.tfstate` | Blob key (path) for this stack's state file |

#### Azure location

| Name | Example | Description |
|---|---|---|
| `AZURE_LOCATION` | `eastus2` | Azure region for all MLOps resources |

#### Resource naming

| Name | Example | Description |
|---|---|---|
| `MLOPS_RESOURCE_GROUP_NAME` | `rg-mlops-prod` | Resource group to deploy into |
| `MLOPS_ENVIRONMENT` | `prod` | Environment label (`dev`, `staging`, or `prod`) |
| `MLOPS_PROJECT` | `mlops` | Project name used in resource name prefix and tags |
| `MLOPS_AML_WORKSPACE_NAME` | `mlops-aml-prod` | Azure Machine Learning workspace name |
| `MLOPS_STORAGE_ACCOUNT_NAME` | `mlopsstorage001` | Storage account name (3–24 lowercase alphanumeric) |
| `MLOPS_STORAGE_REPLICATION_TYPE` | `GRS` | Storage replication (`LRS`, `GRS`, `ZRS`, `RAGRS`, `RAGZRS`) |
| `MLOPS_ACR_NAME` | `mlopsacr001` | Container registry name (5–50 alphanumeric) |
| `MLOPS_KEY_VAULT_NAME` | `mlops-kv-prod` | Key Vault name (3–24 chars, letters/numbers/hyphens) |
| `MLOPS_LOG_ANALYTICS_NAME` | `mlops-law-prod` | Log Analytics workspace name |

## Workflow triggers

| Event | Jobs run |
|---|---|
| Pull request targeting `main` | `plan` — posts diff as PR comment |
| Push to `main` | `plan` → `apply` |
| `workflow_dispatch` → `apply` | `plan` → `apply` (with environment approval) |
| `workflow_dispatch` → `destroy` | `destroy` (with environment approval) |

## Security controls

- All services have `public_network_access_enabled = false`
- Private endpoints with auto-registered private DNS for every service
- NSGs deny inbound internet traffic on both subnets
- Compute clusters run with `node_public_ip_enabled = false`
- Key Vault uses RBAC authorization (not legacy access policies) with purge protection enabled
- ACR admin account disabled; image pulls use managed identity (`AcrPull`)
- Storage requires HTTPS, TLS 1.2+, no public blob access, and has blob versioning + soft-delete
- GitHub Actions uses OIDC — no long-lived credentials stored in secrets
- Terraform plan is saved as an artifact and reused by apply to prevent drift between jobs
