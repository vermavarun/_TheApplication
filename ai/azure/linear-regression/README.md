# Linear Regression Data Pipeline

A self-contained scikit-learn data pipeline that builds a dataset, trains a linear regression model, evaluates it, and runs batch inference. Automated end-to-end by [.github/workflows/linear-regression-azure.yaml](../../../.github/workflows/linear-regression-azure.yaml).

## Structure

```
linear-regression/
├── requirements.txt
└── src/
    ├── data_pipeline.py   # generates and splits the train/test/inference datasets
    ├── train.py           # trains the model and evaluates it (MAE, RMSE, R2)
    ├── infer.py           # runs batch inference with the trained model
    └── pipeline.py         # orchestrates the steps above end-to-end
```

Running the pipeline creates (git-ignored) `data/`, `model/`, and `output/` folders alongside `src/`.

## Usage

```bash
cd ai/azure/linear-regression
pip install -r requirements.txt
python src/pipeline.py
```

This produces:
- `data/train.csv`, `data/test.csv`, `data/inference_input.csv`
- `model/model.joblib`, `model/metrics.json`
- `output/predictions.csv`

Each step can also be run independently via `python src/data_pipeline.py`, `python src/train.py`, and `python src/infer.py`.

## Automation

The GitHub Actions workflow runs the full pipeline on a schedule and on changes to this folder, then publishes the trained model, metrics, and predictions as a workflow artifact.
