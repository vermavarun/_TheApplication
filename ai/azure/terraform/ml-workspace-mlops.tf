resource "azurerm_machine_learning_workspace" "mlops" {
  name                = var.ml_workspace_name
  resource_group_name = var.resource_group_name
  location            = var.location

  application_insights_id = azurerm_application_insights.mlops.id
  key_vault_id            = azurerm_key_vault.mlops.id
  storage_account_id      = azurerm_storage_account.mlops.id
  container_registry_id   = azurerm_container_registry.mlops.id

  public_network_access_enabled = true
  high_business_impact          = false

  identity {
    type = "SystemAssigned"
  }

  tags = {
    environment = var.environment
    project     = var.project
  }
}
