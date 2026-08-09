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

variable "auth_github_id" {
  description = "The GitHub OAuth client ID for authentication."
  type        = string
}

variable "auth_github_secret" {
  description = "The GitHub OAuth client secret for authentication."
  type        = string
  sensitive   = true
}

variable "auth_google_id" {
  description = "The Google OAuth client ID for authentication."
  type        = string
}

variable "auth_google_secret" {
  description = "The Google OAuth client secret for authentication."
  type        = string
  sensitive   = true
}

variable "auth_secret" {
  description = "The secret key used for authentication in next js."
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "The secret key used for JWT authentication."
  type        = string
  sensitive   = true
}

variable "jwt_audience" {
  description = "The audience claim for JWT authentication."
  type        = string
}

variable "jwt_issuer" {
  description = "The issuer claim for JWT authentication."
  type        = string
}

variable "jwt_expiry_minutes" {
  description = "The expiry of JWT in minutes."
  type        = string
}