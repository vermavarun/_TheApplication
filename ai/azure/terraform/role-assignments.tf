# ── ML Workspace system-assigned identity ────────────────────────────────────

# Storage: workspace reads/writes datasets and model artifacts
resource "azurerm_role_assignment" "ml_workspace_storage_blob_contributor" {
  scope                = azurerm_storage_account.mlops.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

# ACR: workspace pulls base images for training environments
resource "azurerm_role_assignment" "ml_workspace_acr_pull" {
  scope                = azurerm_container_registry.mlops.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

# Key Vault: workspace retrieves secrets and encryption keys
resource "azurerm_role_assignment" "ml_workspace_kv_secrets_officer" {
  scope                = azurerm_key_vault.mlops.id
  role_definition_name = "Key Vault Secrets Officer"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

resource "azurerm_role_assignment" "ml_workspace_kv_crypto_officer" {
  scope                = azurerm_key_vault.mlops.id
  role_definition_name = "Key Vault Crypto Officer"
  principal_id         = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}

# ── Compute cluster system-assigned identities ────────────────────────────────

resource "azurerm_role_assignment" "cpu_cluster_storage_blob_contributor" {
  scope                = azurerm_storage_account.mlops.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_machine_learning_compute_cluster.cpu.identity[0].principal_id
}

resource "azurerm_role_assignment" "cpu_cluster_acr_pull" {
  scope                = azurerm_container_registry.mlops.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_machine_learning_compute_cluster.cpu.identity[0].principal_id
}

# gpu_cluster_storage_blob_contributor and gpu_cluster_acr_pull are disabled
# (GPU cluster is commented out due to zero vCPU quota)

# ── Deploying identity (GitHub Actions OIDC) ──────────────────────────────────
# The managed identity used by the workflow needs Contributor on the resource group
# and Key Vault Administrator to assign RBAC roles on Key Vault.
# These must be configured out-of-band (see GitHub workflow prerequisites).
