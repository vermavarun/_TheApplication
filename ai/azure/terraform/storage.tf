resource "azurerm_storage_account" "mlops" {
  name                = var.storage_account_name
  resource_group_name = data.azurerm_resource_group.mlops.name
  location            = data.azurerm_resource_group.mlops.location

  account_tier             = "Standard"
  account_replication_type = var.storage_replication_type
  account_kind             = "StorageV2"

  https_traffic_only_enabled       = true
  min_tls_version                  = "TLS1_2"
  allow_nested_items_to_be_public  = false
  public_network_access_enabled    = false
  cross_tenant_replication_enabled = false

  blob_properties {
    delete_retention_policy {
      days = 30
    }
    container_delete_retention_policy {
      days = 30
    }
    versioning_enabled = true
  }

  tags = local.tags
}

resource "azurerm_storage_container" "ml_artifacts" {
  name                  = "ml-artifacts"
  storage_account_id    = azurerm_storage_account.mlops.id
  container_access_type = "private"
}

resource "azurerm_storage_container" "ml_datasets" {
  name                  = "ml-datasets"
  storage_account_id    = azurerm_storage_account.mlops.id
  container_access_type = "private"
}

resource "azurerm_storage_container" "ml_models" {
  name                  = "ml-models"
  storage_account_id    = azurerm_storage_account.mlops.id
  container_access_type = "private"
}

# Diagnostic settings — forward storage metrics to Log Analytics
resource "azurerm_monitor_diagnostic_setting" "storage" {
  name                       = "${local.name_prefix}-storage-diag"
  target_resource_id         = "${azurerm_storage_account.mlops.id}/blobServices/default"
  log_analytics_workspace_id = azurerm_log_analytics_workspace.mlops.id

  metric {
    category = "Transaction"
  }

  metric {
    category = "Capacity"
  }
}
