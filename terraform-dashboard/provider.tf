terraform {
  required_version = ">= 1.6.0"

  backend "azurerm" {}

  required_providers {
    azurerm = {
      source  = "hashicorp/azurerm"
      version = "~> 4.0"
    }
  }
}

provider "azurerm" {
  features {}
}

variable "resource_group_name" {
  description = "The Azure resource group to deploy into."
  type        = string
}

variable "location" {
  description = "The Azure region for the web apps."
  type        = string
  default     = "eastus"
}

variable "nextjs_web_app_name" {
  description = "The name of the Next.js web app."
  type        = string
}

variable "dotnet_web_app_name" {
  description = "The name of the .NET web app."
  type        = string
}

variable "service_plan_name" {
  description = "The shared service plan name for the dashboard apps."
  type        = string
  default     = "asp-dashboard-linux"
}
