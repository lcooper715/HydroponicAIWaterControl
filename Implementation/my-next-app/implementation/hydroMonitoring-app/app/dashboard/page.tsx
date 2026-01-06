import { SensorCards } from "@/components/charts/sensor-cards"
import { MetricLineCard } from "@/components/charts/metric-line-card"

export default function DashboardPage() {
    // Demo “latest” values — replace with real API data later
    const latest = {
        ph: 6.18,
        ec: 2.31,
        tempC: 22.7,
        orpMv: 415,
    }

    // Demo time-series data — replace with real readings later
    const phData = [
        { t: "10:00", v: 6.15 },
        { t: "10:10", v: 6.17 },
        { t: "10:20", v: 6.18 },
        { t: "10:30", v: 6.21 },
    ]
    const ecData = [
        { t: "10:00", v: 2.25 },
        { t: "10:10", v: 2.28 },
        { t: "10:20", v: 2.31 },
        { t: "10:30", v: 2.30 },
    ]
    const tempData = [
        { t: "10:00", v: 22.4 },
        { t: "10:10", v: 22.5 },
        { t: "10:20", v: 22.7 },
        { t: "10:30", v: 22.8 },
    ]
    const orpData = [
        { t: "10:00", v: 410 },
        { t: "10:10", v: 412 },
        { t: "10:20", v: 415 },
        { t: "10:30", v: 418 },
    ]

    return (
        <main className="w-full max-w-6xl p-6 space-y-6">
            <h1 className="text-2xl font-semibold">Dashboard</h1>

            <SensorCards {...latest} />

            <div className="grid gap-4 lg:grid-cols-2">
                <MetricLineCard title="pH over time" unit="pH" data={phData} domain={[4, 9]} />
                <MetricLineCard title="EC over time" unit="mS/cm" data={ecData} domain={["auto", "auto"]} />
                <MetricLineCard title="Temperature over time" unit="°C" data={tempData} domain={["auto", "auto"]} />
                <MetricLineCard title="ORP over time" unit="mV" data={orpData} domain={["auto", "auto"]} />
            </div>
        </main>
    )
}
