variable "resource_group_name" {
  description = "The Azure resource group to deploy the MLOps infrastructure into. Must already exist."
  type        = string
}

variable "location" {
  description = "The Azure region for the MLOps resources."
  type        = string
  default     = "eastus"
}

variable "environment" {
  description = "The environment name (e.g. dev, test, prod) used for tagging."
  type        = string
  default     = "dev"
}

variable "project" {
  description = "The project name used for tagging and naming."
  type        = string
  default     = "ai-mlops"
}

variable "ml_workspace_name" {
  description = "The name of the Azure Machine Learning workspace."
  type        = string
}

variable "storage_account_name" {
  description = "The name of the storage account used by the ML workspace. Must be globally unique, lowercase, 3-24 alphanumeric characters."
  type        = string
}

variable "storage_replication_type" {
  description = "The replication type for the storage account (e.g. LRS, GRS, ZRS)."
  type        = string
  default     = "LRS"
}

variable "acr_name" {
  description = "The name of the Azure Container Registry used by the ML workspace."
  type        = string
}

variable "key_vault_name" {
  description = "The name of the Key Vault used by the ML workspace."
  type        = string
}

variable "log_analytics_workspace_name" {
  description = "The name of the Log Analytics workspace backing Application Insights."
  type        = string
}
