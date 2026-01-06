import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

type Props = {
    ph: number
    ec: number
    tempC: number
    orpMv: number
}

export function SensorCards({ ph, ec, tempC, orpMv }: Props) {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <MetricCard title="pH" value={ph.toFixed(2)} />
            <MetricCard title="EC" value={ec.toFixed(2)} unit="mS/cm" />
            <MetricCard title="Temp" value={tempC.toFixed(1)} unit="°C" />
            <MetricCard title="ORP" value={Math.round(orpMv).toString()} unit="mV" />
        </div>
    )
}

function MetricCard({ title, value, unit }: { title: string; value: string; unit?: string }) {
    return (
        <Card>
            <CardHeader className="flex-row items-center justify-between">
                <CardTitle className="text-sm">{title}</CardTitle>
                <Badge variant="secondary">Live</Badge>
            </CardHeader>
            <CardContent className="text-3xl font-semibold">
                {value}
                {unit ? <span className="ml-2 text-base font-normal text-muted-foreground">{unit}</span> : null}
            </CardContent>
        </Card>
    )
}
