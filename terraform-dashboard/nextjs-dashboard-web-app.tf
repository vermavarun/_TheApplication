resource "azurerm_service_plan" "nextjs" {
  name                = var.service_plan_name
  resource_group_name = var.resource_group_name
  location            = var.location
  os_type             = "Linux"
  sku_name            = "B1"
}

resource "azurerm_linux_web_app" "nextjs_dashboard" {
  name                = var.nextjs_web_app_name
  resource_group_name = var.resource_group_name
  location            = var.location
  service_plan_id     = azurerm_service_plan.nextjs.id

  https_only          = true
  client_affinity_enabled = false

  site_config {
    always_on                 = true
    ftps_state                = "FtpsOnly"
    minimum_tls_version       = "1.2"
    application_stack {
      node_version = "20-lts"
    }
  }

  app_settings = {
    WEBSITES_PORT = "3000"
    NODE_ENV      = "production"
  }
}
