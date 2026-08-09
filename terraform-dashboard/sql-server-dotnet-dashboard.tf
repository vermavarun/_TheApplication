# ============================================================================
# Variables
# ============================================================================

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
  description = "Azure region where Azure SQL Server will be deployed."
  type        = string
  default     = "australiaeast"
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


# ============================================================================
# Azure SQL Logical Server
#
# IMPORTANT:
# The SQL Server is deployed to sql_location because SQL provisioning
# is not available in the main application region (eastus).
# ============================================================================

resource "azurerm_mssql_server" "dashboard_sql_server" {
  name                = var.sql_server_name
  resource_group_name = var.resource_group_name

  # SQL is deployed to a region where this subscription is allowed
  # to provision Azure SQL.
  location = var.sql_location

  version = "12.0"

  administrator_login          = var.sql_admin_login
  administrator_login_password = var.sql_admin_password

  # Disable public access.
  # Application will access SQL through the Private Endpoint.
  public_network_access_enabled = false

  minimum_tls_version = "1.2"
}


# ============================================================================
# Azure SQL Database
#
# The database is automatically deployed with the SQL logical server.
# ============================================================================

resource "azurerm_mssql_database" "dashboard_sql_database" {
  name = var.sql_database_name

  # This creates an implicit dependency:
  #
  # SQL Server
  #     ↓
  # SQL Database
  #
  server_id = azurerm_mssql_server.dashboard_sql_server.id

  sku_name       = "S0"
  max_size_gb    = 2
  zone_redundant = false
}


# ============================================================================
# Private DNS Zone
#
# Used for:
#
# <server-name>.database.windows.net
#
# to resolve to the Private Endpoint IP address.
# ============================================================================

resource "azurerm_private_dns_zone" "sql" {
  name                = "privatelink.database.windows.net"
  resource_group_name = var.resource_group_name
}


# ============================================================================
# Link Private DNS Zone to the East US application VNet
#
# The VNet is in eastus.
# The DNS zone itself does not need to be in the same region.
# ============================================================================

resource "azurerm_private_dns_zone_virtual_network_link" "sql_vnet_link" {
  name = "dns-link-dashboard-sql"

  resource_group_name = var.resource_group_name

  private_dns_zone_name = azurerm_private_dns_zone.sql.name

  # Existing application VNet.
  virtual_network_id = azurerm_virtual_network.dashboard_vnet.id

  registration_enabled = false

  depends_on = [
    azurerm_private_dns_zone.sql,
    azurerm_virtual_network.dashboard_vnet
  ]
}


# ============================================================================
# Private Endpoint
#
# IMPORTANT:
#
# The Private Endpoint MUST be deployed into the same region as the VNet
# and subnet.
#
# Your VNet is in EAST US.
#
# Therefore:
#
#     Private Endpoint = eastus
#     VNet             = eastus
#     Subnet            = eastus
#
# DO NOT use var.sql_location here.
#
# The SQL Server itself can be in australiaeast.
# ============================================================================

resource "azurerm_private_endpoint" "dashboard_sql_private_endpoint" {
  name = "${var.sql_server_name}-pep"

  resource_group_name = var.resource_group_name

  # IMPORTANT:
  # This must match the region of the VNet/subnet.
  location = var.location

  # Existing Private Endpoint subnet in the East US VNet.
  subnet_id = azurerm_subnet.dashboard_private_endpoint.id

  private_service_connection {
    name = "${var.sql_server_name}-psc"

    # This references the SQL Server in Australia East.
    #
    # Terraform therefore knows:
    #
    # SQL Server
    #     ↓
    # Private Endpoint
    #
    private_connection_resource_id = azurerm_mssql_server.dashboard_sql_server.id

    subresource_names = [
      "sqlServer"
    ]

    is_manual_connection = false
  }

  # Configure Private DNS for the SQL Private Endpoint.
  private_dns_zone_group {
    name = "sql-dns-zone-group"

    private_dns_zone_ids = [
      azurerm_private_dns_zone.sql.id
    ]
  }

  # Explicit dependencies.
  #
  # Some of these dependencies are already implicit from references,
  # but keeping them explicit makes the deployment order clear.
  depends_on = [
    azurerm_mssql_server.dashboard_sql_server,
    azurerm_subnet.dashboard_private_endpoint,
    azurerm_private_dns_zone.sql,
    azurerm_private_dns_zone_virtual_network_link.sql_vnet_link
  ]
}