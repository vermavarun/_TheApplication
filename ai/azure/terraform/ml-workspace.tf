# ============================================================
# Azure Machine Learning Workspace
# ============================================================

resource "azurerm_machine_learning_workspace" "mlops" {
  name                = var.ml_workspace_name
  location            = azurerm_resource_group.mlops.location
  resource_group_name = azurerm_resource_group.mlops.name
  sku_name            = var.ml_workspace_sku

  application_insights_id = azurerm_application_insights.mlops.id
  key_vault_id            = azurerm_key_vault.mlops.id
  storage_account_id      = azurerm_storage_account.mlops.id
  container_registry_id   = azurerm_container_registry.mlops.id

  # Workspace is private.
  public_network_access_enabled = false

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags

  # IMPORTANT:
  # Do NOT add depends_on for the role assignments here.
  #
  # The role assignments depend on this workspace because they
  # need the workspace's System Assigned Managed Identity.
  #
  # Adding:
  #
  # depends_on = [
  #   azurerm_role_assignment.ml_workspace_storage_blob_contributor,
  #   azurerm_role_assignment.ml_workspace_acr_pull,
  #   azurerm_role_assignment.ml_workspace_kv_secrets_officer
  # ]
  #
  # would create:
  #
  # Workspace -> Role Assignment -> Workspace
  #
  # and Terraform reports a dependency cycle.
}


# ============================================================
# Storage RBAC
# ============================================================

# resource "azurerm_role_assignment" "ml_workspace_storage_blob_contributor" {
#   scope                = azurerm_storage_account.mlops.id
#   role_definition_name = "Storage Blob Data Contributor"

#   principal_id = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
# }


# # ============================================================
# # Azure Container Registry RBAC
# # ============================================================

# resource "azurerm_role_assignment" "ml_workspace_acr_pull" {
#   scope                = azurerm_container_registry.mlops.id
#   role_definition_name = "AcrPull"

#   principal_id = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
# }


# ============================================================
# Key Vault RBAC
# ============================================================

resource "azurerm_role_assignment" "ml_workspace_kv_secrets_officer" {
  scope                = azurerm_key_vault.mlops.id
  role_definition_name = "Key Vault Secrets Officer"

  principal_id = azurerm_machine_learning_workspace.mlops.identity[0].principal_id
}


# ============================================================
# Azure Monitor Diagnostic Settings
# ============================================================

resource "azurerm_monitor_diagnostic_setting" "ml_workspace" {
  name = "${local.name_prefix}-aml-diag"

  target_resource_id         = azurerm_machine_learning_workspace.mlops.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.mlops.id

  enabled_log {
    category = "AmlComputeClusterEvent"
  }

  enabled_log {
    category = "AmlComputeJobEvent"
  }

  enabled_log {
    category = "AmlRunStatusChangedEvent"
  }

  metric {
    category = "AllMetrics"
  }
}