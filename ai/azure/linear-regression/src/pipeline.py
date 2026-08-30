"""Orchestrates the end-to-end pipeline: build datasets, train, evaluate, then run batch inference."""
import json
from pathlib import Path

import joblib
import pandas as pd

from data_pipeline import build_datasets
from infer import run_inference
from train import evaluate_model, train_model

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
MODEL_DIR = BASE_DIR / "model"
OUTPUT_DIR = BASE_DIR / "output"


def run() -> None:
    build_datasets(DATA_DIR)

    train_df = pd.read_csv(DATA_DIR / "train.csv")
    test_df = pd.read_csv(DATA_DIR / "test.csv")

    model = train_model(train_df)
    metrics = evaluate_model(model, test_df)

    MODEL_DIR.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, MODEL_DIR / "model.joblib")
    (MODEL_DIR / "metrics.json").write_text(json.dumps(metrics, indent=2))
    print(f"Training complete. Metrics: {metrics}")

    inference_df = pd.read_csv(DATA_DIR / "inference_input.csv")
    result_df = run_inference(model, inference_df)

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    result_df.to_csv(OUTPUT_DIR / "predictions.csv", index=False)
    print(f"Inference complete. Wrote {len(result_df)} predictions to {OUTPUT_DIR / 'predictions.csv'}")


if __name__ == "__main__":
    run()
