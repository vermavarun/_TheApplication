```
terraform init `
  -backend-config="resource_group_name=the-application" `
  -backend-config="storage_account_name=theappstoracc" `
  -backend-config="container_name=tfstate" `
  -backend-config="key=mlops/prod.tfstate"
```