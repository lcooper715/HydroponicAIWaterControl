import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type Props = {
    ph: number;
    ec: number;
    doMgL: number;     // ✅ Dissolved Oxygen
    tempC: number;
    orpMv: number;
};

export function SensorCards({ ph, ec, doMgL, tempC, orpMv }: Props) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            <MetricCard title="pH" value={ph.toFixed(2)} />
            <MetricCard title="EC" value={ec.toFixed(2)} unit="mS/cm" />
            <MetricCard title="DO" value={doMgL.toFixed(1)} unit="mg/L" />
            <MetricCard title="Temp" value={tempC.toFixed(1)} unit="°C" />
            <MetricCard title="ORP" value={Math.round(orpMv).toString()} unit="mV" />
        </div>
    );
}

function MetricCard({
                        title,
                        value,
                        unit,
                    }: {
    title: string;
    value: string;
    unit?: string;
}) {
    return (
        <Card className="text-center">
            <CardHeader className="flex flex-col items-center gap-2 pb-2">
                <CardTitle className="text-sm font-medium text-slate-600">
                    {title}
                </CardTitle>
                <Badge variant="secondary" className="px-2 py-0.5 text-xs">
                    Live
                </Badge>
            </CardHeader>

            <CardContent className="flex items-end justify-center gap-1">
        <span className="text-3xl font-semibold font-mono tracking-tight">
          {value}
        </span>
                {unit && (
                    <span className="pb-0.5 text-sm text-muted-foreground">
            {unit}
          </span>
                )}
            </CardContent>
        </Card>
    );
}
