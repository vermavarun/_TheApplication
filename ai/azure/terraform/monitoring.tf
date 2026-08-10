resource "azurerm_log_analytics_workspace" "mlops" {
  name                = var.log_analytics_workspace_name
  location            = data.azurerm_resource_group.mlops.location
  resource_group_name = data.azurerm_resource_group.mlops.name
  sku                 = "PerGB2018"
  retention_in_days   = var.log_analytics_retention_days
  tags                = local.tags
}

# Workspace-based Application Insights (modern mode, linked to Log Analytics)
resource "azurerm_application_insights" "mlops" {
  name                = "${local.name_prefix}-appinsights"
  location            = data.azurerm_resource_group.mlops.location
  resource_group_name = data.azurerm_resource_group.mlops.name
  workspace_id        = azurerm_log_analytics_workspace.mlops.id
  application_type    = "web"
  tags                = local.tags
}
