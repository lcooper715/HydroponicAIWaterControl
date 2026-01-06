import { Pool } from "pg";

const pool = new Pool({
    host: process.env.QUESTDB_HOST,
    port: Number(process.env.QUESTDB_PG_PORT || 8812),
    user: process.env.QUESTDB_USER,
    password: process.env.QUESTDB_PASSWORD,
    database: process.env.QUESTDB_DATABASE || "qdb",
    max: 5,
});

export async function qdbQuery<T = any>(text: string, params?: any[]) {
    const client = await pool.connect();
    try {
        const res = await client.query<T>(text, params);
        return res;
    } finally {
        client.release();
    }
}
