resource "azurerm_container_registry" "mlops" {
  name                = var.acr_name
  resource_group_name = var.resource_group_name
  location            = var.location

  sku           = "Premium"
  admin_enabled = false

  public_network_access_enabled = true

  network_rule_set {
    default_action = "Deny"
  }

  tags = {
    environment = var.environment
    project     = var.project
  }
}
