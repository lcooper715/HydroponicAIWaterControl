import { MetricLineCard } from "@/components/charts/metric-line-card";

export default function AnalyticsPage() {
    // Demo data — replace with API later
    const phData = [
        { t: "10:00", v: 6.15 },
        { t: "10:10", v: 6.17 },
        { t: "10:20", v: 6.18 },
        { t: "10:30", v: 6.21 },
    ];

    const ecData = [
        { t: "10:00", v: 2.25 },
        { t: "10:10", v: 2.28 },
        { t: "10:20", v: 2.31 },
        { t: "10:30", v: 2.30 },
    ];

    const doData = [
        { t: "10:00", v: 7.8 },
        { t: "10:10", v: 7.7 },
        { t: "10:20", v: 7.6 },
        { t: "10:30", v: 7.65 },
    ];

    const tempData = [
        { t: "10:00", v: 22.4 },
        { t: "10:10", v: 22.5 },
        { t: "10:20", v: 22.7 },
        { t: "10:30", v: 22.8 },
    ];

    const orpData = [
        { t: "10:00", v: 410 },
        { t: "10:10", v: 412 },
        { t: "10:20", v: 415 },
        { t: "10:30", v: 418 },
    ];

    return (
        <main className="mx-auto w-full max-w-7xl p-4 lg:p-8 space-y-6 min-w-0">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Analytics</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Trend charts for water metrics (demo data for now).
                    </p>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3 min-w-0">
                <MetricLineCard title="pH" unit="pH" data={phData} domain={[4, 9]} />
                <MetricLineCard title="EC" unit="mS/cm" data={ecData} domain={["auto", "auto"]} />
                <MetricLineCard title="Dissolved Oxygen (DO)" unit="mg/L" data={doData} domain={["auto", "auto"]} />
                <MetricLineCard title="Temperature" unit="°C" data={tempData} domain={["auto", "auto"]} />
                <MetricLineCard title="ORP" unit="mV" data={orpData} domain={["auto", "auto"]} />
            </div>
        </main>
    );
}
