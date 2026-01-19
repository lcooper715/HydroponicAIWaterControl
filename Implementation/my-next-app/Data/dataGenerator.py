import numpy as np
import pandas as pd

def clamp(x, lo, hi):
    return max(lo, min(hi, x))

def do_saturation_mgL(temp_c):
    # Rough freshwater DO saturation curve approximation near sea level
    # (Good enough for synthetic data)
    return 14.6 - 0.41*temp_c + 0.008*temp_c**2

def simulate_run(
        start_ts="2026-01-01 00:00:00",
        steps=17280,                 # 60 days @ 5 min
        dt_min=5,
        volume_L=20.0,
        ph0=6.0,
        ec0=2.2,
        temp0=22.0,
        ec_target=2.2,
        ph_target=6.0,
        ph_band=0.2,
        max_AB_mL=15.0,
        max_pH_mL=3.0,
        seed=0
):
    rng = np.random.default_rng(seed)
    ts = pd.date_range(pd.Timestamp(start_ts), periods=steps, freq=f"{dt_min}min")

    # Randomize “system personality” per run
    k_ec_effect = rng.uniform(0.02, 0.05)   # mS/cm per mL effect (scaled later)
    k_ph_effect = rng.uniform(0.03, 0.08)   # pH per mL
    ph_drift_base = rng.uniform(-0.002, 0.008)
    ec_uptake_base = rng.uniform(0.0005, 0.0030)

    # DO/ORP dynamics coefficients
    k_do_reaer = rng.uniform(0.02, 0.07)    # pull toward saturation
    k_do_demand = rng.uniform(0.01, 0.05)   # biological demand
    k_orp_do = rng.uniform(12, 25)          # mV per mg/L DO influence
    k_orp_ph = rng.uniform(30, 60)          # mV per 1 pH (inverse relationship)

    pH = ph0 + rng.normal(0, 0.05)
    EC = ec0 + rng.normal(0, 0.05)
    T  = temp0 + rng.normal(0, 0.5)
    V  = volume_L

    # Initialize DO near saturation fraction
    DO = clamp(do_saturation_mgL(T) * rng.uniform(0.75, 0.95), 4.0, 11.0)
    ORP = 320 + (DO - 8)*k_orp_do - (pH - 6.0)*k_orp_ph + rng.normal(0, 15)

    rows = []
    for i in range(steps):
        # Slowly varying plant demand (adds realism)
        demand_factor = 1.0 + 0.25*np.sin(2*np.pi*i/(288*7)) + rng.normal(0, 0.05)
        demand_factor = clamp(demand_factor, 0.6, 1.6)

        # Temp random walk
        T = clamp(T + rng.normal(0, 0.03), 18, 28)

        # --- Expert controller (labels) ---
        ec_error = ec_target - EC
        k_ec_ctrl = 120.0
        dose_total = clamp(k_ec_ctrl * ec_error * (V/20.0), 0.0, 2*max_AB_mL)
        dose_A = clamp(dose_total/2, 0.0, max_AB_mL)
        dose_B = clamp(dose_total/2, 0.0, max_AB_mL)

        ph_up = 0.0
        ph_down = 0.0
        k_ph_ctrl = 18.0
        if pH < ph_target - ph_band:
            ph_up = clamp(k_ph_ctrl * (ph_target - pH), 0.0, max_pH_mL)
        elif pH > ph_target + ph_band:
            ph_down = clamp(k_ph_ctrl * (pH - ph_target), 0.0, max_pH_mL)

        # --- Process dynamics ---
        # Nutrient uptake decreases EC
        EC -= ec_uptake_base * demand_factor

        # pH drift
        pH += ph_drift_base * demand_factor

        # Dosing increases EC
        EC += (dose_A + dose_B) * k_ec_effect * (20.0/V)

        # pH adjustment
        pH += ph_up * k_ph_effect
        pH -= ph_down * k_ph_effect

        # DO dynamics: move toward saturation minus biological demand
        DO_sat = do_saturation_mgL(T)
        DO += k_do_reaer * (DO_sat - DO)            # reaeration toward saturation
        DO -= k_do_demand * demand_factor * (1 + 0.2*(EC-2.0))  # demand increases with activity/EC

        # Occasional DO drop event (e.g., aerator issue)
        if rng.random() < 0.0008:  # rare
            DO -= rng.uniform(1.0, 3.0)

        # ORP correlated with DO and pH + drift/noise
        ORP += 0.03*(320 - ORP)  # mild drift toward nominal
        ORP = 320 + (DO - 8.0)*k_orp_do - (pH - 6.0)*k_orp_ph + rng.normal(0, 10)

        # Clamp plausible ranges
        pH = clamp(pH, 4.8, 7.2)
        EC = clamp(EC, 0.8, 3.5)
        DO = clamp(DO, 3.5, 11.5)
        ORP = clamp(ORP, 150, 500)

        # Measurement noise
        pH_meas = pH + rng.normal(0, 0.02)
        EC_meas = EC + rng.normal(0, 0.03)
        DO_meas = DO + rng.normal(0, 0.15)
        ORP_meas = ORP + rng.normal(0, 8)

        rows.append({
            "timestamp": ts[i],
            "volume_L": round(V, 2),
            "temp_C": round(T, 2),
            "pH": round(pH_meas, 3),
            "EC_mScm": round(EC_meas, 3),
            "DO_mgL": round(DO_meas, 2),
            "ORP_mV": round(ORP_meas, 1),
            "dose_A_mL": round(dose_A, 2),
            "dose_B_mL": round(dose_B, 2),
            "ph_up_mL": round(ph_up, 2),
            "ph_down_mL": round(ph_down, 2),
        })

    return pd.DataFrame(rows)

def generate_dataset(runs=80, days_per_run=60):
    steps = int(days_per_run * 24 * 60 / 5)
    dfs = []
    for r in range(runs):
        df = simulate_run(
            steps=steps,
            seed=1000 + r,
            ph0=np.random.uniform(5.6, 6.6),
            ec0=np.random.uniform(1.6, 2.8),
            temp0=np.random.uniform(19, 26),
        )
        df["run_id"] = r
        dfs.append(df)
    return pd.concat(dfs, ignore_index=True)

# Example: ~1.38M rows
df = generate_dataset(runs=80, days_per_run=60)
df.to_csv("synthetic_hydroponics_recommendations_DO_ORP.csv", index=False)
print(df.head(), "\nrows:", len(df))
