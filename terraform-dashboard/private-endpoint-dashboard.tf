resource "azurerm_subnet" "dashboard_private_endpoint" {
  name                 = "snet-dashboard-private-endpoint"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.dashboard_vnet.name
  address_prefixes     = ["10.10.2.0/24"]

  private_endpoint_network_policies = "Disabled"
}

resource "azurerm_private_endpoint" "dotnet_dashboard_private_endpoint" {
  name                = "${var.dotnet_web_app_name}-pep"
  location            = var.location
  resource_group_name = var.resource_group_name
  subnet_id           = azurerm_subnet.dashboard_private_endpoint.id

  private_service_connection {
    name                           = "${var.dotnet_web_app_name}-psc"
    private_connection_resource_id = azurerm_linux_web_app.dotnet_dashboard.id
    subresource_names              = ["sites"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "dotnet-dashboard-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.azurewebsites.id]
  }
}
