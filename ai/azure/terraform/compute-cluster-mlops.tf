resource "azurerm_machine_learning_compute_cluster" "mlops" {
  name                          = "cpu-cluster"
  location                      = var.location
  vm_priority                   = "Dedicated"
  vm_size                       = "Standard_DS3_v2"
  machine_learning_workspace_id = azurerm_machine_learning_workspace.mlops.id

  # Scales to zero nodes when idle so the cluster is only billed while a batch job/deployment runs.
  scale_settings {
    min_node_count                       = 0
    max_node_count                       = 1
    scale_down_nodes_after_idle_duration = "PT30M"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = {
    environment = var.environment
    project     = var.project
  }
}

resource "azurerm_role_assignment" "mlops_compute_storage_blob_contributor" {
  scope                = azurerm_storage_account.mlops.id
  role_definition_name = "Storage Blob Data Contributor"
  principal_id         = azurerm_machine_learning_compute_cluster.mlops.identity[0].principal_id
}

resource "azurerm_role_assignment" "mlops_compute_acr_pull" {
  scope                = azurerm_container_registry.mlops.id
  role_definition_name = "AcrPull"
  principal_id         = azurerm_machine_learning_compute_cluster.mlops.identity[0].principal_id
}
