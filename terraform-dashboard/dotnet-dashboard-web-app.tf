resource "azurerm_linux_web_app" "dotnet_dashboard" {
  name                          = var.dotnet_web_app_name
  resource_group_name           = var.resource_group_name
  location                      = var.location
  service_plan_id               = azurerm_service_plan.common_app_service_plan.id
  virtual_network_subnet_id     = azurerm_subnet.dashboard_integration.id
  public_network_access_enabled = false

  https_only              = true
  client_affinity_enabled = false

  site_config {
    always_on              = true
    ftps_state             = "FtpsOnly"
    minimum_tls_version    = "1.2"
    vnet_route_all_enabled = true

    application_stack {
      dotnet_version = "10.0"
    }
  }

  app_settings = {
    WEBSITES_PORT                        = "8080"
    ASPNETCORE_ENVIRONMENT               = "Production"
    ConnectionStrings__DefaultConnection = "Server=tcp:${azurerm_mssql_server.dashboard_sql_server.fully_qualified_domain_name},1433;Initial Catalog=${azurerm_mssql_database.dashboard_sql_database.name};Persist Security Info=False;User ID=${var.sql_admin_login};Password=${var.sql_admin_password};MultipleActiveResultSets=False;Encrypt=True;TrustServerCertificate=False;Connection Timeout=30;"
  }
}
