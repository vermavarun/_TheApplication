resource "azurerm_key_vault" "mlops" {
  name                = var.key_vault_name
  location            = data.azurerm_resource_group.mlops.location
  resource_group_name = data.azurerm_resource_group.mlops.name
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "premium"

  # RBAC instead of legacy access policies
  rbac_authorization_enabled = true

  # Production: prevent accidental permanent deletion
  purge_protection_enabled   = true
  soft_delete_retention_days = var.key_vault_soft_delete_retention_days

  public_network_access_enabled = false

  network_acls {
    bypass         = "AzureServices"
    default_action = "Deny"
  }

  tags = local.tags
}

resource "azurerm_monitor_diagnostic_setting" "key_vault" {
  name                       = "${local.name_prefix}-kv-diag"
  target_resource_id         = azurerm_key_vault.mlops.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.mlops.id

  enabled_log {
    category = "AuditEvent"
  }

  enabled_log {
    category = "AzurePolicyEvaluationDetails"
  }

  enabled_metric  {
    category = "AllMetrics"
  }
}
