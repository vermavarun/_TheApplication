resource "azurerm_log_analytics_workspace" "mlops" {
  name                = var.log_analytics_workspace_name
  resource_group_name = var.resource_group_name
  location            = var.location

  sku               = "PerGB2018"
  retention_in_days = 30

  tags = {
    environment = var.environment
    project     = var.project
  }
}

resource "azurerm_application_insights" "mlops" {
  name                = "appi-${var.project}-${var.environment}"
  resource_group_name = var.resource_group_name
  location            = var.location

  application_type = "web"
  workspace_id     = azurerm_log_analytics_workspace.mlops.id

  tags = {
    environment = var.environment
    project     = var.project
  }
}
