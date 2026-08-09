variable "sql_server_name" {
  description = "The Azure SQL logical server name."
  type        = string
}

variable "sql_database_name" {
  description = "The Azure SQL database name used by the .NET dashboard."
  type        = string
  default     = "dashboarddb"
}

variable "sql_location" {
  description = "The Azure region for Azure SQL Server and its private endpoint."
  type        = string
  default     = null
}

variable "sql_admin_login" {
  description = "Admin login name for Azure SQL Server."
  type        = string
}

variable "sql_admin_password" {
  description = "Admin password for Azure SQL Server."
  type        = string
  sensitive   = true
}

resource "azurerm_mssql_server" "dashboard_sql_server" {
  name                          = var.sql_server_name
  resource_group_name           = var.resource_group_name
  location                      = coalesce(var.sql_location, var.location)
  version                       = "12.0"
  administrator_login           = var.sql_admin_login
  administrator_login_password  = var.sql_admin_password
  public_network_access_enabled = false
  minimum_tls_version           = "1.2"
}

resource "azurerm_mssql_database" "dashboard_sql_database" {
  name           = var.sql_database_name
  server_id      = azurerm_mssql_server.dashboard_sql_server.id
  sku_name       = "S0"
  max_size_gb    = 2
  zone_redundant = false
}

resource "azurerm_private_dns_zone" "sql" {
  name                = "privatelink.database.windows.net"
  resource_group_name = var.resource_group_name
}

resource "azurerm_private_dns_zone_virtual_network_link" "sql_vnet_link" {
  name                  = "dns-link-dashboard-sql"
  resource_group_name   = var.resource_group_name
  private_dns_zone_name = azurerm_private_dns_zone.sql.name
  virtual_network_id    = azurerm_virtual_network.dashboard_vnet.id
  registration_enabled  = false
}

resource "azurerm_private_endpoint" "dashboard_sql_private_endpoint" {
  name                = "${var.sql_server_name}-pep"
  location            = coalesce(var.sql_location, var.location)
  resource_group_name = var.resource_group_name
  subnet_id           = azurerm_subnet.dashboard_private_endpoint.id

  private_service_connection {
    name                           = "${var.sql_server_name}-psc"
    private_connection_resource_id = azurerm_mssql_server.dashboard_sql_server.id
    subresource_names              = ["sqlServer"]
    is_manual_connection           = false
  }

  private_dns_zone_group {
    name                 = "sql-dns-zone-group"
    private_dns_zone_ids = [azurerm_private_dns_zone.sql.id]
  }
}
