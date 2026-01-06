"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
} from "recharts"

type Point = { t: string; v: number }

type Props = {
    title: string
    unit: string
    data: Point[]
    domain?: [number, number] | ["auto", "auto"]
}

export function MetricLineCard({ title, unit, data, domain = ["auto", "auto"] }: Props) {
    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-sm">{title}</CardTitle>
            </CardHeader>
            <CardContent className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data}>
                        <XAxis dataKey="t" />
                        <YAxis domain={domain} />
                        <Tooltip formatter={(value: number) => [`${value}`, unit]} />
                        <Line type="monotone" dataKey="v" dot={false} />
                    </LineChart>
                </ResponsiveContainer>
            </CardContent>
        </Card>
    )
}
