resource "azurerm_key_vault" "mlops" {
  name                = var.key_vault_name
  resource_group_name = var.resource_group_name
  location            = var.location
  tenant_id           = data.azurerm_client_config.current.tenant_id
  sku_name            = "standard"

  rbac_authorization_enabled = true

  # Purge protection is intentionally disabled so the vault can be permanently deleted (no soft-delete lock).
  purge_protection_enabled   = false
  soft_delete_retention_days = 7

  public_network_access_enabled = true

  network_acls {
    default_action = "Deny"
    bypass         = "AzureServices"
  }

  tags = {
    environment = var.environment
    project     = var.project
  }
}
