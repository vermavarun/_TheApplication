# CPU cluster: scales to zero when idle, no public IP, VNet-integrated
resource "azurerm_machine_learning_compute_cluster" "cpu" {
  name                          = var.compute_cluster_name
  location                      = data.azurerm_resource_group.mlops.location
  vm_priority                   = "Dedicated"
  vm_size                       = var.compute_cluster_vm_size
  machine_learning_workspace_id = azurerm_machine_learning_workspace.mlops.id
  subnet_resource_id            = azurerm_subnet.compute.id
  node_public_ip_enabled        = false

  scale_settings {
    min_node_count                       = var.compute_cluster_min_nodes
    max_node_count                       = var.compute_cluster_max_nodes
    scale_down_nodes_after_idle_duration = "${var.compute_cluster_idle_seconds}s"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}

# GPU cluster for model training (optional, comment out to save cost)
resource "azurerm_machine_learning_compute_cluster" "gpu" {
  name                          = "gpu-cluster"
  location                      = data.azurerm_resource_group.mlops.location
  vm_priority                   = "LowPriority"
  vm_size                       = "Standard_NC6s_v3"
  machine_learning_workspace_id = azurerm_machine_learning_workspace.mlops.id
  subnet_resource_id            = azurerm_subnet.compute.id
  node_public_ip_enabled        = false

  scale_settings {
    min_node_count                       = 0
    max_node_count                       = 2
    scale_down_nodes_after_idle_duration = "120s"
  }

  identity {
    type = "SystemAssigned"
  }

  tags = local.tags
}
