locals {
  name_prefix = "${var.project}-${var.environment}"

  default_tags = {
    project     = var.project
    environment = var.environment
    managed_by  = "terraform"
    repository  = "vermavarun/_TheApplication"
  }

  tags = merge(local.default_tags, var.additional_tags)

  # Private DNS zone names required by each service
  private_dns_zones = {
    storage_blob = "privatelink.blob.core.windows.net"
    storage_file = "privatelink.file.core.windows.net"
    acr          = "privatelink.azurecr.io"
    key_vault    = "privatelink.vaultcore.azure.net"
    ml_api       = "privatelink.api.azureml.ms"
    ml_notebooks = "privatelink.notebooks.azure.net"
  }
}
