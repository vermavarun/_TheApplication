# Terraform Dashboard Infrastructure

This folder is used to deploy the Azure infrastructure for the Next.js dashboard and the .NET API dashboard.

## What it deploys

- A shared Azure Linux App Service plan
- A Linux Web App for the Next.js frontend
- A Linux Web App for the .NET API backend

## Prerequisites

Before running the deployment workflow, the following Azure resources must exist:

- An Azure resource group for the deployment target
- A managed identity configured for federated access to this GitHub repository
- Contributor access on the target resource group for that managed identity
- A storage account with a blob container named `tfstate` to store the Terraform remote state

## GitHub Actions variables and secrets

The workflow expects the following repository variables and secrets to be configured.

| Type | Name | Purpose |
| --- | --- | --- |
| Variable | `RESOURCE_GROUP_NAME` | Azure resource group name used for deployment |
| Variable | `AZURE_LOCATION` | Azure region for the resources |
| Variable | `NEXTJS_DASHBOARD_WEB_APP_NAME` | Name of the Azure Web App for the Next.js dashboard |
| Variable | `DOTNET_DASHBOARD_WEB_APP_NAME` | Name of the Azure Web App for the .NET dashboard |
| Variable | `AZURE_SERVICE_PLAN_NAME` | Name of the shared Azure App Service plan |
| Variable | `TF_STATE_RESOURCE_GROUP` | Resource group that contains the Terraform remote state storage |
| Variable | `TF_STATE_STORAGE_ACCOUNT` | Storage account name for the Terraform remote state |
| Variable | `TF_STATE_CONTAINER` | Blob container name inside the storage account |
| Variable | `TF_STATE_KEY` | State file name to store in the container |
| Secret | `AZURE_CLIENT_ID` | Azure app registration / workload identity client ID |
| Secret | `AZURE_TENANT_ID` | Azure tenant ID |
| Secret | `AZURE_SUBSCRIPTION_ID` | Azure subscription ID |
