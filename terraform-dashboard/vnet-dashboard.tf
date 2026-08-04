resource "azurerm_virtual_network" "dashboard_vnet" {
  name                = "vnet-dashboard"
  resource_group_name = var.resource_group_name
  location            = var.location
  address_space       = ["10.10.0.0/16"]
}

resource "azurerm_subnet" "dashboard_integration" {
  name                 = "snet-dashboard-appservice"
  resource_group_name  = var.resource_group_name
  virtual_network_name = azurerm_virtual_network.dashboard_vnet.name
  address_prefixes     = ["10.10.1.0/24"]

  delegation {
    name = "appservice-delegation"

    service_delegation {
      name = "Microsoft.Web/serverFarms"
    }
  }
}
