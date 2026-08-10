output "resource_group_name" {
  description = "Name of the MLOps resource group"
  value       = data.azurerm_resource_group.mlops.name
}

output "ml_workspace_name" {
  description = "Name of the Azure ML workspace"
  value       = azurerm_machine_learning_workspace.mlops.name
}

output "ml_workspace_id" {
  description = "Resource ID of the Azure ML workspace"
  value       = azurerm_machine_learning_workspace.mlops.id
}

output "storage_account_name" {
  description = "Name of the ML storage account"
  value       = azurerm_storage_account.mlops.name
}

output "acr_login_server" {
  description = "Login server URL for the container registry"
  value       = azurerm_container_registry.mlops.login_server
}

output "key_vault_uri" {
  description = "URI of the Key Vault"
  value       = azurerm_key_vault.mlops.vault_uri
}

output "log_analytics_workspace_id" {
  description = "Resource ID of the Log Analytics workspace"
  value       = azurerm_log_analytics_workspace.mlops.id
}

output "application_insights_connection_string" {
  description = "Application Insights connection string"
  value       = azurerm_application_insights.mlops.connection_string
  sensitive   = true
}

output "vnet_id" {
  description = "Resource ID of the MLOps VNet"
  value       = azurerm_virtual_network.mlops.id
}

output "cpu_compute_cluster_name" {
  description = "Name of the CPU training compute cluster"
  value       = azurerm_machine_learning_compute_cluster.cpu.name
}

output "gpu_compute_cluster_name" {
  description = "Name of the GPU training compute cluster"
  value       = azurerm_machine_learning_compute_cluster.gpu.name
}
