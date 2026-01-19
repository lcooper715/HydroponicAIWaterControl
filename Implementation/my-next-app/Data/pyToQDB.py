import psycopg2
import pandas as pd

conn = psycopg2.connect(
    host="localhost",
    port=8812,          # QuestDB PGWire port
    user="admin",
    password="quest",
    database="qdb",
)
print(pd.read_sql("tables();", conn))
sql = """
SELECT
  timestamp,
  run_id,
  temp_C,
  pH,
  EC_mScm,
  DO_mgL,
  ORP_mV,
  dose_A_mL,
  dose_B_mL,
  ph_up_mL,
  ph_down_mL
FROM hydro_readings
ORDER BY timestamp
LIMIT 5;
"""

df = pd.read_sql(sql, conn)
print(df)

conn.close()

if __name__ == "__main__":
    print(df)

