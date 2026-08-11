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
  # Enables default features for the Azure provider
  # These features include resource cleanup, soft deletes, and other enhancements
  features {}
}

