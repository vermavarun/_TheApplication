$regions = @(
    "australiacentral",
    "australiaeast",
    "australiasoutheast",
    "austriaeast",
    "belgiumcentral",
    "brazilsouth",
    "canadacentral",
    "canadaeast",
    "centralindia",
    "centralus",
    "chilecentral",
    "denmarkeast",
    "eastasia",
    "eastus",
    "eastus2",
    "francecentral",
    "germanywestcentral",
    "indiasouthcentral",
    "indonesiacentral",
    "israelcentral",
    "italynorth",
    "japaneast",
    "japanwest",
    "koreacentral",
    "koreasouth",
    "malaysiawest",
    "mexicocentral",
    "newzealandnorth",
    "northcentralus",
    "northeurope",
    "norwayeast",
    "polandcentral",
    "qatarcentral",
    "southafricanorth",
    "southcentralus",
    "southindia",
    "southeastasia",
    "spaincentral",
    "swedencentral",
    "switzerlandnorth",
    "uaenorth",
    "uksouth",
    "ukwest",
    "westcentralus",
    "westeurope",
    "westindia",
    "westus",
    "westus2",
    "westus3"
)

$resourceGroup = "the-application"
$results = @()

foreach ($region in $regions) {

    $serverName = "testsql" + (Get-Random -Minimum 100000 -Maximum 999999)

    Write-Host ""
    Write-Host "============================================" -ForegroundColor Cyan
    Write-Host "Testing region: $region" -ForegroundColor Yellow
    Write-Host "============================================" -ForegroundColor Cyan

    $output = az sql server create `
        --resource-group $resourceGroup `
        --name $serverName `
        --location $region `
        --admin-user sqladmin `
        --admin-password "YourStrongPassword123!" `
        --only-show-errors 2>&1

    if ($LASTEXITCODE -eq 0) {

        Write-Host "SUCCESS: $region" -ForegroundColor Green

        $results += [PSCustomObject]@{
            Region = $region
            Status = "AVAILABLE"
            Error  = ""
        }

        # Delete the test server immediately
        Write-Host "Deleting test server $serverName..." -ForegroundColor Gray

        az sql server delete `
            --resource-group $resourceGroup `
            --name $serverName `
            --yes `
            --only-show-errors

    }
    else {

        $errorText = $output -join " "

        Write-Host "FAILED: $region" -ForegroundColor Red

        if ($errorText -match "ProvisioningDisabled") {
            $status = "PROVISIONING_DISABLED"
        }
        elseif ($errorText -match "quota|Quota") {
            $status = "QUOTA"
        }
        else {
            $status = "OTHER_ERROR"
        }

        $results += [PSCustomObject]@{
            Region = $region
            Status = $status
            Error  = $errorText
        }
    }
}

Write-Host ""
Write-Host "============================================" -ForegroundColor Cyan
Write-Host "RESULTS" -ForegroundColor Cyan
Write-Host "============================================" -ForegroundColor Cyan

$results | Format-Table -AutoSize