resource "azurerm_linux_web_app" "dotnet_dashboard" {
  name                = var.dotnet_web_app_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.common_app_service_plan.id

  https_only               = true
  client_affinity_enabled  = false

  site_config {
    always_on           = true
    ftps_state          = "FtpsOnly"
    minimum_tls_version = "1.2"

    application_stack {
      dotnet_version = "10.0"
    }
  }

  app_settings = {
    WEBSITES_PORT = "8080"
    ASPNETCORE_ENVIRONMENT = "Production"
  }
}
