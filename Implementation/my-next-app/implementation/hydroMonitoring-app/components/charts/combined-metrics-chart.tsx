"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts";

type Point = {
    t: string; // time label
    ph: number;
    ec: number;
    do: number;
    temp: number;
    orp: number;
};

function normalizeSeries(data: Point[], key: keyof Point) {
    const values = data.map((d) => Number(d[key]));
    const min = Math.min(...values);
    const max = Math.max(...values);
    const range = max - min;

    // avoid divide by 0 if flat line
    return data.map((d) => ({
        ...d,
        [key]: range === 0 ? 0.5 : (Number(d[key]) - min) / range,
    }));
}

function normalizeAll(data: Point[]) {
    let out = data;
    (["ph", "ec", "do", "temp", "orp"] as const).forEach((k) => {
        out = normalizeSeries(out, k);
    });
    return out;
}

export function CombinedMetricsChart({
                                         title = "All water metrics (normalized)",
                                         data,
                                     }: {
    title?: string;
    data: Point[];
}) {
    const normalized = normalizeAll(data);

    return (
        <Card className="min-w-0">
            <CardHeader className="pb-2">
                <CardTitle className="text-base">{title}</CardTitle>
                <div className="text-xs text-slate-500">
                    Each line is normalized 0→1 so trends are comparable (not raw units).
                </div>
            </CardHeader>

            <CardContent>
                <div className="h-80 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={normalized} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
                            <XAxis dataKey="t" />
                            <YAxis domain={[0, 1]} />
                            <Tooltip />
                            <Legend />

                            <Line type="monotone" dataKey="ph" dot={false} strokeWidth={2} />
                            <Line type="monotone" dataKey="ec" dot={false} strokeWidth={2} />
                            <Line type="monotone" dataKey="do" dot={false} strokeWidth={2} />
                            <Line type="monotone" dataKey="temp" dot={false} strokeWidth={2} />
                            <Line type="monotone" dataKey="orp" dot={false} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
