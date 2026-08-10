# Premium SKU required for private endpoints and geo-replication
resource "azurerm_container_registry" "mlops" {
  name                          = var.acr_name
  resource_group_name           = data.azurerm_resource_group.mlops.name
  location                      = data.azurerm_resource_group.mlops.location
  sku                           = "Premium"
  admin_enabled                 = false
  public_network_access_enabled = false

  # Retain images for audit / rollback
  retention_policy_in_days = 90

  tags = local.tags
}

resource "azurerm_monitor_diagnostic_setting" "acr" {
  name                       = "${local.name_prefix}-acr-diag"
  target_resource_id         = azurerm_container_registry.mlops.id
  log_analytics_workspace_id = azurerm_log_analytics_workspace.mlops.id

  enabled_log {
    category = "ContainerRegistryLoginEvents"
  }

  enabled_log {
    category = "ContainerRegistryRepositoryEvents"
  }

  enabled_metric {
    category = "AllMetrics"
  }
}
