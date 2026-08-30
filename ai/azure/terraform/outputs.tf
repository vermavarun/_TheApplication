output "ml_workspace_id" {
  description = "The resource ID of the Azure Machine Learning workspace."
  value       = azurerm_machine_learning_workspace.mlops.id
}

output "ml_workspace_name" {
  description = "The name of the Azure Machine Learning workspace."
  value       = azurerm_machine_learning_workspace.mlops.name
}

output "storage_account_name" {
  description = "The name of the storage account backing the ML workspace."
  value       = azurerm_storage_account.mlops.name
}

output "acr_login_server" {
  description = "The login server of the Azure Container Registry."
  value       = azurerm_container_registry.mlops.login_server
}

output "key_vault_uri" {
  description = "The URI of the Key Vault used by the ML workspace."
  value       = azurerm_key_vault.mlops.vault_uri
}

output "log_analytics_workspace_id" {
  description = "The resource ID of the Log Analytics workspace."
  value       = azurerm_log_analytics_workspace.mlops.id
}
