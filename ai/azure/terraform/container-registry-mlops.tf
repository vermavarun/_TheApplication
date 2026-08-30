resource "azurerm_container_registry" "mlops" {
  name                = var.acr_name
  resource_group_name = var.resource_group_name
  location            = var.location

  sku = "Premium"
  # Serverless/ephemeral AML compute nodes pull custom environment images using the ACR admin
  # credentials rather than the workspace's managed identity, so admin must stay enabled.
  admin_enabled = true

  public_network_access_enabled = true

  # Firewall left open since GitHub-hosted runners and AML build compute are not on a fixed
  # allow-list; RBAC (AcrPull) is the enforced access control layer instead.
  network_rule_set {
    default_action = "Allow"
  }

  tags = {
    environment = var.environment
    project     = var.project
  }
}
