"""Trains a linear regression model on the prepared dataset and records evaluation metrics."""
import argparse
import json
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

from data_pipeline import TARGET_COLUMN


def train_model(train_df: pd.DataFrame) -> LinearRegression:
    X = train_df.drop(columns=[TARGET_COLUMN])
    y = train_df[TARGET_COLUMN]

    model = LinearRegression()
    model.fit(X, y)
    return model


def evaluate_model(model: LinearRegression, test_df: pd.DataFrame) -> dict:
    X = test_df.drop(columns=[TARGET_COLUMN])
    y = test_df[TARGET_COLUMN]

    predictions = model.predict(X)
    return {
        "mae": mean_absolute_error(y, predictions),
        "rmse": mean_squared_error(y, predictions) ** 0.5,
        "r2": r2_score(y, predictions),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Train and evaluate the linear regression model.")
    base_dir = Path(__file__).resolve().parent.parent
    parser.add_argument("--data-dir", type=Path, default=base_dir / "data")
    parser.add_argument("--model-dir", type=Path, default=base_dir / "model")
    args = parser.parse_args()

    train_df = pd.read_csv(args.data_dir / "train.csv")
    test_df = pd.read_csv(args.data_dir / "test.csv")

    model = train_model(train_df)
    metrics = evaluate_model(model, test_df)

    args.model_dir.mkdir(parents=True, exist_ok=True)
    joblib.dump(model, args.model_dir / "model.joblib")
    (args.model_dir / "metrics.json").write_text(json.dumps(metrics, indent=2))

    print(f"Model trained. Metrics: {metrics}")


if __name__ == "__main__":
    main()
