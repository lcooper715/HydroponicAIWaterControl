from dataclasses import dataclass
import os
import psycopg2
import requests
import pandas as pd

@dataclass
class QuestDBPGConfig:
    host: str = os.getenv("QDB_HOST", "localhost")
    port: int = int(os.getenv("QDB_PG_PORT", "8812"))
    user: str = os.getenv("QDB_USER", "admin")
    password: str = os.getenv("QDB_PASSWORD", "quest")
    database: str = os.getenv("QDB_DATABASE", "qdb")


def connect_qdb_pg(cfg: QuestDBPGConfig):
    return psycopg2.connect(
        host=cfg.host,
        port=cfg.port,
        user=cfg.user,
        password=cfg.password,
        database=cfg.database,
    )

# ---------- HTTP config (reads, metadata, training) ----------




if __name__ == "__main__":
    cfg = QuestDBPGConfig()
    print("Using config:", cfg)

    conn = connect_qdb_pg(cfg)
    cur = conn.cursor()

    cur.execute("SELECT 1;")
    print("Connection test:", cur.fetchone())

    conn.close()
