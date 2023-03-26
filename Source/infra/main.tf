resource "azurerm_service_plan" "vv-infra-plan" {
  name                = "vv-infra-plan"
  resource_group_name = "sbox-skillathonq1-dev-rg"
  location            = "East US"
  os_type             = "Linux"
  sku_name            = "P1v2"
}

resource "azurerm_linux_web_app" "vv-infra-app-api" {
  name                = "vv-infra-app-api"
  resource_group_name = "sbox-skillathonq1-dev-rg"
  location            = "East US"
  service_plan_id     = azurerm_service_plan.vv-infra-plan.id
  https_only          = true

  site_config {}
}

resource "azurerm_linux_web_app" "vv-infra-app-ui" {
  name                = "vv-infra-app-ui"
  resource_group_name = "sbox-skillathonq1-dev-rg"
  location            = "East US"
  service_plan_id     = azurerm_service_plan.vv-infra-plan.id
  https_only          = true

  site_config {}
}