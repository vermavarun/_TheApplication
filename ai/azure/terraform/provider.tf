# Azure Terraform Provider Configuration
# This file configures the Terraform provider for Microsoft Azure

terraform {
  # Specifies the minimum required version of Terraform
  required_version = ">= 1.6.0"

  # Configures the backend for storing Terraform state
  # Using AzureRM backend for remote state management
  backend "azurerm" {}

  # Defines required providers and their versions
  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

# Configures the Azure provider with default features enabled
# This block initializes the Azure provider for resource creation
provider "azurerm" {
  features {
    key_vault {
      # Managed identity lacks purge permission at subscription scope; leave soft-deleted vault to expire naturally
      purge_soft_delete_on_destroy = false
    }
  }
}
