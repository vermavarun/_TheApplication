# Linear Regression Data Pipeline (Azure ML)

An Azure Machine Learning pipeline — data preparation, training, and batch inference — that runs entirely as jobs inside the `MLOPS_AML_WORKSPACE_NAME` workspace provisioned by [../terraform](../terraform). No step runs locally or on the GitHub Actions runner; the runner only submits the job.

## Structure

```
linear-regression/
├── environment/
│   ├── environment.yml     # Azure ML environment asset (base image + conda deps)
│   └── conda.yaml
├── components/
│   ├── data_pipeline.yml   # AML command component: generates the dataset
│   ├── train.yml           # AML command component: trains + evaluates the model
│   └── infer.yml           # AML command component: batch inference
├── pipeline.yml            # AML pipeline job chaining the 3 components together
├── endpoint/
│   ├── batch-endpoint.yml      # AML batch endpoint definition
│   ├── batch-deployment.yml    # AML batch deployment (model + scoring script + compute)
│   ├── online-endpoint.yml     # AML managed online (real-time) endpoint definition
│   ├── online-deployment.yml   # AML managed online deployment (model + scoring script + instance size)
│   └── sample-data/
│       ├── inputs.csv          # sample batch-endpoint input (CSV, read from storage)
│       └── online-request.json # sample real-time endpoint request payload
└── src/
    ├── data_pipeline.py
    ├── train.py
    ├── infer.py
    ├── score.py            # scoring script used by the batch deployment (reads CSV files)
    └── score_online.py     # scoring script used by the online deployment (reads the request payload)
```

## How it runs in Azure ML

1. `data_prep` component generates the dataset and writes it to an AML-managed `uri_folder` output (backed by the workspace's default datastore / storage account).
2. `train` component consumes that dataset as an input, trains a `LinearRegression` model, evaluates it (MAE/RMSE/R2), and writes `model.joblib` + `metrics.json` to its own AML output folder.
3. `inference` component consumes the trained model output and the same dataset folder, and writes `predictions.csv` to an AML output folder.

All data, model, and prediction artifacts live in the AML workspace's storage — nothing is downloaded to, or generated on, the CI runner.

## Model registration, batch endpoint, and online endpoint

After the pipeline job completes, the trained model isn't automatically visible in the AML Studio *Models* list or callable as an endpoint — those are separate registration/deployment steps:

1. `az ml model create` registers the job's `model` output (`azureml://jobs/<job-name>/outputs/model`) as a versioned Model asset named `linear-regression-model`.
2. `az ml batch-endpoint create` creates/updates the `linear-regression-batch-endpoint` batch endpoint.
3. `az ml batch-deployment create --set-default` deploys the latest registered model behind that endpoint, running on the `cpu-cluster` AmlCompute cluster (scales to zero when idle).
4. `az ml online-endpoint create` creates/updates the `linreg-online-endpoint` managed online endpoint.
5. `az ml online-deployment create --all-traffic` deploys the latest registered model behind that endpoint on its own dedicated `Standard_DS2_v2` instance (managed online endpoints don't use the shared `cpu-cluster`, and — unlike the batch deployment — are always-on and billed while running).

Batch endpoints require a real AmlCompute cluster — they can't run on serverless compute — so [../terraform/compute-cluster-mlops.tf](../terraform/compute-cluster-mlops.tf) provisions a small `cpu-cluster` (min 0, max 1 nodes) for this purpose. Online endpoints provision their own compute per deployment, so no extra Terraform resource is needed for them, but the subscription needs enough `Standard_DS2_v2` quota in the workspace's region.

## Calling the batch endpoint

The scoring script ([src/score.py](src/score.py)) expects one or more CSV files with the same feature columns used for training: `feature_1`, `feature_2`, `feature_3`, `feature_4` (no `target` column). A sample file is provided at [endpoint/sample-data/inputs.csv](endpoint/sample-data/inputs.csv).

### Option 1: Azure ML CLI (simplest)

```bash
az extension add -n ml -y

az ml batch-endpoint invoke \
  --name linear-regression-batch-endpoint \
  --input endpoint/sample-data/inputs.csv \
  --input-type uri_file \
  --resource-group <MLOPS_RESOURCE_GROUP_NAME> \
  --workspace-name <MLOPS_AML_WORKSPACE_NAME>
```

This uploads the local CSV and submits a scoring job. It prints a job name — track progress and fetch the `predictions.csv` output with:

```bash
az ml job stream --name <job-name> --resource-group <MLOPS_RESOURCE_GROUP_NAME> --workspace-name <MLOPS_AML_WORKSPACE_NAME>
az ml job download --name <job-name> --download-path ./results --output-name score --resource-group <MLOPS_RESOURCE_GROUP_NAME> --workspace-name <MLOPS_AML_WORKSPACE_NAME>
```

### Option 2: REST call (for other systems/pipelines)

Batch endpoints use `auth_mode: aad_token`, so requests need a Microsoft Entra bearer token for the Azure ML audience:

```bash
SCORING_URI=$(az ml batch-endpoint show --name linear-regression-batch-endpoint \
  --resource-group <MLOPS_RESOURCE_GROUP_NAME> --workspace-name <MLOPS_AML_WORKSPACE_NAME> \
  --query scoring_uri -o tsv)

TOKEN=$(az account get-access-token --resource https://ml.azure.com --query accessToken -o tsv)

curl -X POST "$SCORING_URI" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
        "properties": {
          "InputData": {
            "myInput": {
              "JobInputType": "UriFile",
              "Uri": "https://<storage-account>.blob.core.windows.net/<container>/<path-to-uploaded-inputs.csv>"
            }
          }
        }
      }'
```

The response includes a job name; monitor and retrieve its output the same way as Option 1. The input CSV must already be uploaded somewhere the workspace can read (e.g. the workspace's default storage account), since REST calls can't upload local files for you like the CLI does.

## Calling the real-time (online) endpoint

Unlike the batch endpoint, the online endpoint accepts feature data directly in the request payload — no upload to a storage account is needed, and predictions are returned synchronously. The scoring script ([src/score_online.py](src/score_online.py)) expects a JSON body of the form `{"data": [[feature_1, feature_2, feature_3, feature_4], ...]}` (rows) or `{"data": [{"feature_1": ..., "feature_2": ..., "feature_3": ..., "feature_4": ...}, ...]}` (records). A sample payload is provided at [endpoint/sample-data/online-request.json](endpoint/sample-data/online-request.json).

### Option 1: Azure ML CLI (simplest)

```bash
az extension add -n ml -y

az ml online-endpoint invoke \
  --name linreg-online-endpoint \
  --request-file endpoint/sample-data/online-request.json \
  --resource-group <MLOPS_RESOURCE_GROUP_NAME> \
  --workspace-name <MLOPS_AML_WORKSPACE_NAME>
```

This returns the list of predictions immediately (one per input row) — there's no job to stream or download.

### Option 2: REST call (for other systems/pipelines)

The online endpoint uses `auth_mode: aad_token`, so requests need a Microsoft Entra bearer token for the Azure ML audience:

```bash
SCORING_URI=$(az ml online-endpoint show --name linreg-online-endpoint \
  --resource-group <MLOPS_RESOURCE_GROUP_NAME> --workspace-name <MLOPS_AML_WORKSPACE_NAME> \
  --query scoring_uri -o tsv)

TOKEN=$(az account get-access-token --resource https://ml.azure.com --query accessToken -o tsv)

curl -X POST "$SCORING_URI" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d @endpoint/sample-data/online-request.json
```

The response body is the JSON list of predictions returned by `score_online.py`.

## Automation

[.github/workflows/linear-regression-azure.yaml](../../../.github/workflows/linear-regression-azure.yaml):
1. Logs in to Azure via OIDC.
2. Registers/updates the `linear-regression-env` Azure ML environment.
3. Submits `pipeline.yml`, streams its logs, then registers the resulting model and creates/updates the batch endpoint/deployment and the online endpoint/deployment.

## Local development (optional)

The scripts in `src/` can still be run directly for local iteration:

```bash
pip install -r requirements.txt
python src/data_pipeline.py --output-dir /tmp/lr-data
python src/train.py --data-dir /tmp/lr-data --model-dir /tmp/lr-model
python src/infer.py --data-dir /tmp/lr-data --model-dir /tmp/lr-model --output-dir /tmp/lr-output
```

This is for development only — the automated pipeline always executes inside Azure ML.

## Note on storage networking

The MLOps storage account denies public network access by default (bypassing only trusted Azure services). If Azure ML job runs fail to read/write the workspace's default datastore, add a private endpoint for the workspace or a storage account resource-instance rule for the ML workspace.
