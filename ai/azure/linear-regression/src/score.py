"""Batch endpoint scoring script for the registered linear regression model."""
import glob
import os

import joblib
import pandas as pd

model = None


def init() -> None:
    global model
    model_dir = os.environ["AZUREML_MODEL_DIR"]
    model_path = glob.glob(os.path.join(model_dir, "**", "model.joblib"), recursive=True)[0]
    model = joblib.load(model_path)


def run(mini_batch: list[str]) -> pd.DataFrame:
    results = []
    for file_path in mini_batch:
        input_df = pd.read_csv(file_path)
        predictions = model.predict(input_df)
        result_df = input_df.copy()
        result_df["prediction"] = predictions
        result_df["source_file"] = os.path.basename(file_path)
        results.append(result_df)

    return pd.concat(results, ignore_index=True)
