"""Runs batch inference using the trained linear regression model."""
import argparse
from pathlib import Path

import joblib
import pandas as pd
from sklearn.linear_model import LinearRegression


def run_inference(model: LinearRegression, input_df: pd.DataFrame) -> pd.DataFrame:
    predictions = model.predict(input_df)
    result_df = input_df.copy()
    result_df["prediction"] = predictions
    return result_df


def main() -> None:
    parser = argparse.ArgumentParser(description="Run batch inference with the trained linear regression model.")
    base_dir = Path(__file__).resolve().parent.parent
    parser.add_argument("--data-dir", type=Path, default=base_dir / "data")
    parser.add_argument("--model-dir", type=Path, default=base_dir / "model")
    parser.add_argument("--output-dir", type=Path, default=base_dir / "output")
    parser.add_argument("--input-file", type=str, default="inference_input.csv")
    args = parser.parse_args()

    model = joblib.load(args.model_dir / "model.joblib")
    input_df = pd.read_csv(args.data_dir / args.input_file)

    result_df = run_inference(model, input_df)

    args.output_dir.mkdir(parents=True, exist_ok=True)
    result_df.to_csv(args.output_dir / "predictions.csv", index=False)
    print(f"Wrote {len(result_df)} predictions to {args.output_dir / 'predictions.csv'}")


if __name__ == "__main__":
    main()
