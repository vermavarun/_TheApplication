# Grants the ML workspace's system-assigned identity least-privilege data-plane access to its dependencies.

resource "azurerm_role_assignment" "mlops_workspace_kv_admin" {
  scope                = azurerm_key_vault.mlops.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

resource "azurerm_role_assignment" "mlops_workspace_storage_blob_contributor" {
  scope                = azurerm_storage_account.mlops.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

resource "azurerm_role_assignment" "mlops_workspace_storage_file_contributor" {
  scope                = azurerm_storage_account.mlops.id
  role_definition_name = "Storage File Data Privileged Contributor"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

resource "azurerm_role_assignment" "mlops_workspace_acr_pull" {
  scope                = azurerm_container_registry.mlops.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}
