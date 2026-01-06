import { SensorCards } from "@/components/charts/sensor-cards";
import { CombinedMetricsChart } from "@/components/charts/combined-metrics-chart";

export default function HomePage() {
    const latest = {
        ph: 6.18,
        ec: 2.31,
        doMgL: 7.6,
        tempC: 22.7,
        orpMv: 415,
    };

    const combinedData = [
        { t: "10:00", ph: 6.15, ec: 2.25, do: 7.8, temp: 22.4, orp: 410 },
        { t: "10:10", ph: 6.17, ec: 2.28, do: 7.7, temp: 22.5, orp: 412 },
        { t: "10:20", ph: 6.18, ec: 2.31, do: 7.6, temp: 22.7, orp: 415 },
        { t: "10:30", ph: 6.21, ec: 2.30, do: 7.65, temp: 22.8, orp: 418 },
    ];

    return (
        <main className="mx-auto w-full max-w-7xl space-y-6 p-4 lg:p-8 min-w-0">
            {/* Product paragraph + title */}
            <div className="text-center space-y-3">
                <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
                    Hydroponic Water Monitoring System
                </h1>
                <p className="mx-auto max-w-2xl text-sm text-slate-600">
                    Hydroponics Monitoring System helps small to midrange growers track water quality in real time.
                    Monitor pH, EC, dissolved oxygen, temperature, and ORP to keep plants healthy and detect issues early.
                </p>

                <div>
                    <h1 className="text-2xl font-semibold tracking-tight">Dashboard</h1>
                    <p className="mt-1 text-sm text-slate-500">
                        Quick overview with normalized water metrics.
                    </p>
                </div>
            </div>

            <SensorCards {...latest} />

            <CombinedMetricsChart data={combinedData} />
        </main>
    );
}
