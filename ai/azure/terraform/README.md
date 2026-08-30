# Terraform AI MLOps Infrastructure

This folder contains the Terraform configuration that provisions the Azure infrastructure for the AI/MLOps platform: an Azure Machine Learning workspace and its supporting dependencies.

## What it deploys

- A Log Analytics workspace (30-day retention) and a workspace-based Application Insights instance
- A storage account with public blob access disabled, HTTPS/TLS 1.2 enforced, blob versioning and soft-delete, and network access denied by default (bypassing trusted Azure services)
- A Premium Azure Container Registry with the admin account disabled and network access denied by default
- A Key Vault with RBAC authorization, network access denied by default (bypassing trusted Azure services), and purge protection disabled so the vault remains fully deletable
- An Azure Machine Learning workspace with a system-assigned managed identity, wired to the Key Vault, storage account, ACR, and Application Insights
- Role assignments granting the ML workspace's managed identity least-privilege data-plane access (Key Vault Administrator, Storage Blob/File Data Contributor, AcrPull) to its dependencies

## Prerequisites

Before running the deployment workflow, the following Azure resources must exist:

- An Azure resource group for the deployment target
- A managed identity configured for federated access to this GitHub repository
- Contributor access on the target resource group for that managed identity
- A storage account with a blob container named `tfstate` to store the Terraform remote state

## Deployment

Deployment is driven by the `.github/workflows/terraform-ai-mlops.yaml` GitHub Actions workflow, which authenticates to Azure via OIDC and stores state remotely in Azure Storage.
