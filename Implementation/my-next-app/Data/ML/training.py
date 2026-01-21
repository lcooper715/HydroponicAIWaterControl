import os
from typing import List, Tuple

import joblib
import numpy as np
import pandas as pd
import requests
from sklearn.metrics import mean_absolute_error, r2_score
from sklearn.multioutput import MultiOutputRegressor
from xgboost import XGBRegressor


TABLE = os.getenv("QDB_TABLE", "hydro_readings_per_day")
QDB_HTTP = os.getenv("QDB_HTTP", "http://localhost:9000")

TARGETS = ["dose_A_mL", "dose_B_mL", "ph_up_mL", "ph_down_mL"]

BASE_FEATURES = [
    "volume_L",
    "temp_C",
    "pH",
    "EC_mScm",
    "DO_mgL",
    "ORP_mV",
]

DERIVED_FEATURES = [
    "hour",
    "dayofweek",
    "pH_delta",
    "EC_mScm_delta",
    "DO_mgL_delta",
    "ORP_mV_delta",
    "temp_C_delta",
    "pH_ema",
    "EC_mScm_ema",
    "DO_mgL_ema",
    "ORP_mV_ema",
    "temp_C_ema",
]
def normalize_questdb_df(df):
    for col in df.columns:
        if df[col].apply(lambda x: isinstance(x, dict)).any():
            df[col] = df[col].apply(
                lambda x: x.get("value") if isinstance(x, dict) else x
            )
    return df


def load_training_data(table: str) -> pd.DataFrame:
    import re

    # Guard table name (prevents injection + typos)
    if not re.match(r"^[A-Za-z_][A-Za-z0-9_]*$", table):
        raise ValueError(f"Invalid table name: {table}")

    sql_query = f"""
    SELECT
      timestamp,
      run_id,
      volume_L,
      temp_C,
      pH,
      EC_mScm,
      DO_mgL,
      ORP_mV,
      dose_A_mL,
      dose_B_mL,
      ph_up_mL,
      ph_down_mL
    FROM {table}
    ORDER BY timestamp;
    """

    response = requests.get(
        f"{QDB_HTTP}/exec",
        params={"query": sql_query, "fmt": "json"},
        timeout=120,
    )
    response.raise_for_status()
    payload = response.json()

    if "dataset" not in payload or "columns" not in payload:
        raise RuntimeError(f"QuestDB /exec error: {payload}")

    col_names = [c["name"] for c in payload["columns"]]
    df = pd.DataFrame(payload["dataset"], columns=col_names)

    df = normalize_questdb_df(df)
    df["timestamp"] = pd.to_datetime(df["timestamp"], errors="coerce")

    df = df.dropna(subset=["timestamp"])
    df["run_id"] = df["run_id"].astype(int, errors="ignore")

    return df


def add_features(df: pd.DataFrame) -> Tuple[pd.DataFrame, List[str]]:
    df = df.sort_values(["run_id", "timestamp"]).reset_index(drop=True)

    # Time features
    df["hour"] = df["timestamp"].dt.hour.astype(np.int16)
    df["dayofweek"] = df["timestamp"].dt.dayofweek.astype(np.int16)

    # Trend features per run
    cols = ["pH", "EC_mScm", "DO_mgL", "ORP_mV", "temp_C"]
    for c in cols:
        df[f"{c}_delta"] = df.groupby("run_id")[c].diff()

    # Rolling/EMA features per run (span ~ 6 samples; with 5-min data that’s ~30 minutes)
    span = 6
    for c in cols:
        df[f"{c}_ema"] = (
            df.groupby("run_id")[c]
            .apply(lambda s: s.ewm(span=span, adjust=False).mean())
            .reset_index(level=0, drop=True)
        )

    # Clean up NaNs created by diff/ema at the start of each run
    feature_cols = BASE_FEATURES + DERIVED_FEATURES
    df = df.dropna(subset=feature_cols + TARGETS).reset_index(drop=True)

    return df, feature_cols


def split_by_run_id(df: pd.DataFrame, train_frac: float = 0.8):
    """Prevents leakage across runs by holding out entire runs."""
    run_ids = np.sort(df["run_id"].unique())
    cut = int(len(run_ids) * train_frac)
    train_ids = set(run_ids[:cut])
    val_ids = set(run_ids[cut:])

    train_df = df[df["run_id"].isin(train_ids)].copy()
    val_df = df[df["run_id"].isin(val_ids)].copy()
    return train_df, val_df


def train_model(X_train: pd.DataFrame, y_train: pd.DataFrame):
    base = XGBRegressor(
        n_estimators=400,
        max_depth=6,
        learning_rate=0.05,
        subsample=0.8,
        colsample_bytree=0.8,
        objective="reg:squarederror",
        tree_method="hist",
        random_state=42,
        n_jobs=4,
    )
    model = MultiOutputRegressor(base)
    model.fit(X_train, y_train)
    return model


def evaluate(model, X_val: pd.DataFrame, y_val: pd.DataFrame):
    pred = model.predict(X_val)
    pred_df = pd.DataFrame(pred, columns=y_val.columns, index=y_val.index)

    metrics = {}
    for t in y_val.columns:
        mae = mean_absolute_error(y_val[t], pred_df[t])
        r2 = r2_score(y_val[t], pred_df[t])
        metrics[t] = {"mae": float(mae), "r2": float(r2)}
    return metrics


def main():
    print("Loading data from table:", TABLE)
    print("QuestDB HTTP:", QDB_HTTP)

    df = load_training_data(TABLE)

    print("Rows loaded:", len(df))
    if len(df) < 1000:
        raise RuntimeError("Not enough rows to train. Check table name / import.")

    df, feature_cols = add_features(df)
    print("Rows after feature engineering:", len(df))
    print("Feature count:", len(feature_cols))

    train_df, val_df = split_by_run_id(df, train_frac=0.8)
    print("Train rows:", len(train_df), "Val rows:", len(val_df))

    X_train, y_train = train_df[feature_cols], train_df[TARGETS]
    X_val, y_val = val_df[feature_cols], val_df[TARGETS]

    print("Training model...")
    model = train_model(X_train, y_train)

    print("Evaluating...")
    metrics = evaluate(model, X_val, y_val)
    for k, v in metrics.items():
        print(f"{k:10s}  MAE={v['mae']:.4f}  R2={v['r2']:.4f}")

    artifact = {
        "model": model,
        "features": feature_cols,
        "targets": TARGETS,
        "table": TABLE,
        "qdb_http": QDB_HTTP,
    }

    os.makedirs("models", exist_ok=True)
    out_path = os.path.join("models", "dose_controller_xgb.joblib")
    joblib.dump(artifact, out_path)
    print("Saved model artifact:", out_path)


def main():
    ...
    return df

if __name__ == "__main__":
    df = main()
    if len(df) < 1000:
        raise RuntimeError("Not enough rows to train.")

