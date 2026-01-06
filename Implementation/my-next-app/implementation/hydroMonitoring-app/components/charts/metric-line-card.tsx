"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts";

type Point = { t: string; v: number };

type Props = {
    title: string;
    unit: string;
    data: Point[];
    domain?: [number, number] | ["auto", "auto"];
};

export function MetricLineCard({
                                   title,
                                   unit,
                                   data,
                                   domain = ["auto", "auto"],
                               }: Props) {
    return (
        <Card className="min-w-0">
            <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>

            <CardContent>
                {/* 👇 This wrapper fixes the -1 width/height issue */}
                <div className="h-56 w-full min-w-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={data}>
                            <XAxis dataKey="t" />
                            <YAxis domain={domain} />
                            <Tooltip formatter={(value: number) => [`${value}`, unit]} />
                            <Line type="monotone" dataKey="v" dot={false} strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </CardContent>
        </Card>
    );
}
