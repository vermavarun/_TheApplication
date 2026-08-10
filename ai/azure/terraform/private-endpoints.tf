# ── Storage Account ───────────────────────────────────────────────────────────

resource "azurerm_private_endpoint" "storage_blob" {
  name                = "${local.name_prefix}-pe-storage-blob"
  location            = azurerm_resource_group.mlops.location
  resource_group_name = azurerm_resource_group.mlops.name
  subnet_id           = azurerm_subnet.private_endpoints.id
  tags                = local.tags

  private_service_connection {
    name                           = "storage-blob-psc"
    private_connection_resource_id = azurerm_storage_account.mlops.id
    subresource_names              = ["blob"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "storage-blob-dns"
    private_dns_zone_ids = [azurerm_private_dns_zone.zones["storage_blob"].id]
  }
}

resource "azurerm_private_endpoint" "storage_file" {
  name                = "${local.name_prefix}-pe-storage-file"
  location            = azurerm_resource_group.mlops.location
  resource_group_name = azurerm_resource_group.mlops.name
  subnet_id           = azurerm_subnet.private_endpoints.id
  tags                = local.tags

  private_service_connection {
    name                           = "storage-file-psc"
    private_connection_resource_id = azurerm_storage_account.mlops.id
    subresource_names              = ["file"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "storage-file-dns"
    private_dns_zone_ids = [azurerm_private_dns_zone.zones["storage_file"].id]
  }
}

# ── Azure Container Registry ──────────────────────────────────────────────────

resource "azurerm_private_endpoint" "acr" {
  name                = "${local.name_prefix}-pe-acr"
  location            = azurerm_resource_group.mlops.location
  resource_group_name = azurerm_resource_group.mlops.name
  subnet_id           = azurerm_subnet.private_endpoints.id
  tags                = local.tags

  private_service_connection {
    name                           = "acr-psc"
    private_connection_resource_id = azurerm_container_registry.mlops.id
    subresource_names              = ["registry"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "acr-dns"
    private_dns_zone_ids = [azurerm_private_dns_zone.zones["acr"].id]
  }
}

# ── Key Vault ─────────────────────────────────────────────────────────────────

resource "azurerm_private_endpoint" "key_vault" {
  name                = "${local.name_prefix}-pe-kv"
  location            = azurerm_resource_group.mlops.location
  resource_group_name = azurerm_resource_group.mlops.name
  subnet_id           = azurerm_subnet.private_endpoints.id
  tags                = local.tags

  private_service_connection {
    name                           = "kv-psc"
    private_connection_resource_id = azurerm_key_vault.mlops.id
    subresource_names              = ["vault"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "kv-dns"
    private_dns_zone_ids = [azurerm_private_dns_zone.zones["key_vault"].id]
  }
}

# ── Azure Machine Learning Workspace ─────────────────────────────────────────

resource "azurerm_private_endpoint" "ml_workspace" {
  name                = "${local.name_prefix}-pe-aml"
  location            = azurerm_resource_group.mlops.location
  resource_group_name = azurerm_resource_group.mlops.name
  subnet_id           = azurerm_subnet.private_endpoints.id
  tags                = local.tags

  private_service_connection {
    name                           = "aml-psc"
    private_connection_resource_id = azurerm_machine_learning_workspace.mlops.id
    subresource_names              = ["amlworkspace"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name = "aml-dns"
    private_dns_zone_ids = [
      azurerm_private_dns_zone.zones["ml_api"].id,
      azurerm_private_dns_zone.zones["ml_notebooks"].id,
    ]
  }
}
