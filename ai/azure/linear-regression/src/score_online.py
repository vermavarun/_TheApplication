"""Real-time (online) endpoint scoring script — accepts feature data directly in the request payload."""
import glob
import json
import os

import joblib
import pandas as pd

from data_pipeline import FEATURE_COLUMNS

model = None


def init() -> None:
    global model
    model_dir = os.environ["AZUREML_MODEL_DIR"]
    model_path = glob.glob(os.path.join(model_dir, "**", "model.joblib"), recursive=True)[0]
    model = joblib.load(model_path)


def run(raw_data: str) -> list:
    """Accepts JSON payload: {"data": [[f1, f2, f3, f4], ...]} or {"data": [{"feature_1": ..., ...}, ...]}."""
    payload = json.loads(raw_data)["data"]

    # Works for both [[f1, f2, f3, f4], ...] rows and [{"feature_1": ..., ...}, ...] records.
    input_df = pd.DataFrame(payload, columns=FEATURE_COLUMNS)

    predictions = model.predict(input_df)
    return predictions.tolist()
