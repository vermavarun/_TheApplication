variable "resource_group_name" {
  description = "Name of the resource group for all MLOps resources"
  type        = string
}

variable "location" {
  description = "Azure region for all resources"
  type        = string
}

variable "environment" {
  description = "Deployment environment (dev, staging, prod)"
  type        = string
  default     = "prod"

  validation {
    condition     = contains(["dev", "staging", "prod"], var.environment)
    error_message = "Environment must be one of: dev, staging, prod."
  }
}

variable "project" {
  description = "Project name used in resource naming and tags"
  type        = string
  default     = "mlops"
}

# --- Networking ---

variable "vnet_address_space" {
  description = "Address space for the MLOps virtual network"
  type        = string
  default     = "10.10.0.0/16"
}

variable "private_endpoint_subnet_prefix" {
  description = "Address prefix for the private endpoint subnet"
  type        = string
  default     = "10.10.0.0/24"
}

variable "compute_subnet_prefix" {
  description = "Address prefix for the ML compute subnet"
  type        = string
  default     = "10.10.1.0/24"
}

# --- ML Workspace ---

variable "ml_workspace_name" {
  description = "Name of the Azure Machine Learning workspace"
  type        = string
}

variable "ml_workspace_sku" {
  description = "SKU of the Azure ML workspace (Basic or Enterprise)"
  type        = string
  default     = "Basic"
}

# --- Storage ---

variable "storage_account_name" {
  description = "Name of the storage account for ML artifacts (3-24 chars, lowercase alphanumeric)"
  type        = string

  validation {
    condition     = can(regex("^[a-z0-9]{3,24}$", var.storage_account_name))
    error_message = "Storage account name must be 3-24 lowercase alphanumeric characters."
  }
}

variable "storage_replication_type" {
  description = "Replication type for the storage account (GRS recommended for production)"
  type        = string
  default     = "GRS"

  validation {
    condition     = contains(["LRS", "GRS", "ZRS", "RAGRS", "RAGZRS"], var.storage_replication_type)
    error_message = "Invalid storage replication type."
  }
}

# --- Container Registry ---

variable "acr_name" {
  description = "Name of the Azure Container Registry (5-50 alphanumeric)"
  type        = string

  validation {
    condition     = can(regex("^[a-zA-Z0-9]{5,50}$", var.acr_name))
    error_message = "ACR name must be 5-50 alphanumeric characters."
  }
}

# --- Key Vault ---

variable "key_vault_name" {
  description = "Name of the Azure Key Vault (3-24 chars)"
  type        = string

  validation {
    condition     = can(regex("^[a-zA-Z][a-zA-Z0-9-]{1,22}[a-zA-Z0-9]$", var.key_vault_name))
    error_message = "Key Vault name must be 3-24 chars, start with a letter, and contain only alphanumeric and hyphens."
  }
}

variable "key_vault_soft_delete_retention_days" {
  description = "Soft-delete retention period in days (7-90)"
  type        = number
  default     = 90
}

# --- Monitoring ---

variable "log_analytics_workspace_name" {
  description = "Name of the Log Analytics workspace"
  type        = string
}

variable "log_analytics_retention_days" {
  description = "Log Analytics data retention in days (30-730)"
  type        = number
  default     = 90
}

# --- ML Compute Cluster ---

variable "compute_cluster_name" {
  description = "Name of the CPU training compute cluster"
  type        = string
  default     = "cpu-cluster"
}

variable "compute_cluster_vm_size" {
  description = "VM size for the training compute cluster"
  type        = string
  default     = "Standard_DS3_v2"
}

variable "compute_cluster_max_nodes" {
  description = "Maximum node count for the training compute cluster"
  type        = number
  default     = 4
}

variable "compute_cluster_min_nodes" {
  description = "Minimum node count (0 = scale to zero when idle)"
  type        = number
  default     = 0
}

variable "compute_cluster_idle_seconds" {
  description = "Seconds of idle time before scale-down"
  type        = number
  default     = 120
}

# --- Tags ---

variable "additional_tags" {
  description = "Additional tags to merge with the default tag set"
  type        = map(string)
  default     = {}
}
