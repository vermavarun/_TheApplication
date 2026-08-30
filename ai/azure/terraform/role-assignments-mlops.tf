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

# AcrPush is required in addition to AcrPull because building a custom Azure ML environment
# (base image + conda file) pushes the built image into the workspace-linked ACR.
resource "azurerm_role_assignment" "mlops_workspace_acr_push" {
  scope                = azurerm_container_registry.mlops.id
  role_definition_name = "AcrPush"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

# Grants the deploying/CI principal (used for both Terraform apply and `az ml job create`) the
# data-plane roles it needs to upload job code snapshots to the workspace's default datastore
# and read/write secrets, since Contributor alone does not include storage/Key Vault data actions.

resource "azurerm_role_assignment" "mlops_ci_storage_blob_contributor" {
  scope                = azurerm_storage_account.mlops.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_role_assignment" "mlops_ci_storage_file_contributor" {
  scope                = azurerm_storage_account.mlops.id
  role_definition_name = "Storage File Data Privileged Contributor"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_role_assignment" "mlops_ci_kv_admin" {
  scope                = azurerm_key_vault.mlops.id
  role_definition_name = "Key Vault Administrator"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_role_assignment" "mlops_ci_acr_pull" {
  scope                = azurerm_container_registry.mlops.id
  role_definition_name = "AcrPull"
  principal_id         = data.azurerm_client_config.current.object_id
}

resource "azurerm_role_assignment" "mlops_ci_acr_push" {
  scope                = azurerm_container_registry.mlops.id
  role_definition_name = "AcrPush"
  principal_id         = data.azurerm_client_config.current.object_id
}
