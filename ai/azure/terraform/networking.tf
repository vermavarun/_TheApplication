# ── Virtual Network ──────────────────────────────────────────────────────────

resource "azurerm_virtual_network" "mlops" {
  name                = "${local.name_prefix}-vnet"
  location            = data.azurerm_resource_group.mlops.location
  resource_group_name = data.azurerm_resource_group.mlops.name
  address_space       = [var.vnet_address_space]
  tags                = local.tags
}

# ── Subnets ───────────────────────────────────────────────────────────────────

resource "azurerm_subnet" "private_endpoints" {
  name                 = "snet-private-endpoints"
  resource_group_name  = data.azurerm_resource_group.mlops.name
  virtual_network_name = azurerm_virtual_network.mlops.name
  address_prefixes     = [var.private_endpoint_subnet_prefix]

  # Required for private endpoints in azurerm 4.x
  private_endpoint_network_policies = "Disabled"
}

resource "azurerm_subnet" "compute" {
  name                 = "snet-compute"
  resource_group_name  = data.azurerm_resource_group.mlops.name
  virtual_network_name = azurerm_virtual_network.mlops.name
  address_prefixes     = [var.compute_subnet_prefix]

  private_endpoint_network_policies = "Disabled"
}

# ── Network Security Groups ───────────────────────────────────────────────────

resource "azurerm_network_security_group" "private_endpoints" {
  name                = "${local.name_prefix}-nsg-pe"
  location            = data.azurerm_resource_group.mlops.location
  resource_group_name = data.azurerm_resource_group.mlops.name
  tags                = local.tags

  # Deny all inbound from the internet; allow only intra-VNet
  security_rule {
    name                       = "DenyInternetInbound"
    priority                   = 4000
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }
}

resource "azurerm_network_security_group" "compute" {
  name                = "${local.name_prefix}-nsg-compute"
  location            = data.azurerm_resource_group.mlops.location
  resource_group_name = data.azurerm_resource_group.mlops.name
  tags                = local.tags

  security_rule {
    name                       = "DenyInternetInbound"
    priority                   = 4000
    direction                  = "Inbound"
    access                     = "Deny"
    protocol                   = "*"
    source_port_range          = "*"
    destination_port_range     = "*"
    source_address_prefix      = "Internet"
    destination_address_prefix = "*"
  }

  # AzureMachineLearning service tag required for compute cluster health probes
  security_rule {
    name                       = "AllowAmlInbound"
    priority                   = 100
    direction                  = "Inbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_ranges    = ["29876", "29877"]
    source_address_prefix      = "AzureMachineLearning"
    destination_address_prefix = "*"
  }

  security_rule {
    name                       = "AllowAzureMonitorOutbound"
    priority                   = 100
    direction                  = "Outbound"
    access                     = "Allow"
    protocol                   = "Tcp"
    source_port_range          = "*"
    destination_port_range     = "443"
    source_address_prefix      = "*"
    destination_address_prefix = "AzureMonitor"
  }
}

resource "azurerm_subnet_network_security_group_association" "private_endpoints" {
  subnet_id                 = azurerm_subnet.private_endpoints.id
  network_security_group_id = azurerm_network_security_group.private_endpoints.id
}

resource "azurerm_subnet_network_security_group_association" "compute" {
  subnet_id                 = azurerm_subnet.compute.id
  network_security_group_id = azurerm_network_security_group.compute.id
}

# ── Private DNS Zones ─────────────────────────────────────────────────────────

resource "azurerm_private_dns_zone" "zones" {
  for_each            = local.private_dns_zones
  name                = each.value
  resource_group_name = data.azurerm_resource_group.mlops.name
  tags                = local.tags
}

resource "azurerm_private_dns_zone_virtual_network_link" "zones" {
  for_each              = local.private_dns_zones
  name                  = "${each.key}-vnet-link"
  resource_group_name   = data.azurerm_resource_group.mlops.name
  private_dns_zone_name = azurerm_private_dns_zone.zones[each.key].name
  virtual_network_id    = azurerm_virtual_network.mlops.id
  registration_enabled  = false
  tags                  = local.tags
}
