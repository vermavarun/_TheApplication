"""Builds train/test/inference datasets for the linear regression pipeline."""
import argparse
from pathlib import Path

import pandas as pd
from sklearn.datasets import make_regression
from sklearn.model_selection import train_test_split

FEATURE_COLUMNS = ["feature_1", "feature_2", "feature_3", "feature_4"]
TARGET_COLUMN = "target"


def generate_dataset(n_samples: int = 500, noise: float = 12.0, random_state: int = 42) -> pd.DataFrame:
    X, y = make_regression(
        n_samples=n_samples,
        n_features=len(FEATURE_COLUMNS),
        noise=noise,
        random_state=random_state,
    )
    df = pd.DataFrame(X, columns=FEATURE_COLUMNS)
    df[TARGET_COLUMN] = y
    return df


def build_datasets(output_dir: Path, random_state: int = 42) -> None:
    output_dir.mkdir(parents=True, exist_ok=True)

    df = generate_dataset(random_state=random_state)
    train_df, remainder_df = train_test_split(df, test_size=0.3, random_state=random_state)
    test_df, inference_df = train_test_split(remainder_df, test_size=0.33, random_state=random_state)

    train_df.to_csv(output_dir / "train.csv", index=False)
    test_df.to_csv(output_dir / "test.csv", index=False)
    inference_df.drop(columns=[TARGET_COLUMN]).to_csv(output_dir / "inference_input.csv", index=False)


def main() -> None:
    parser = argparse.ArgumentParser(description="Build train/test/inference datasets for the linear regression pipeline.")
    parser.add_argument("--output-dir", type=Path, default=Path(__file__).resolve().parent.parent / "data")
    args = parser.parse_args()

    build_datasets(args.output_dir)
    print(f"Datasets written to {args.output_dir}")


if __name__ == "__main__":
    main()
