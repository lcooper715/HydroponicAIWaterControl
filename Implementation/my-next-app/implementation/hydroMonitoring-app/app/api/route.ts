import { NextResponse } from "next/server";
import { qdbQuery } from "@/lib/questdb";

export async function GET() {
    const res = await qdbQuery("select 1 as ok");
    return NextResponse.json({ ok: res.rows[0].ok });
}
