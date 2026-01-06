"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ChartNoAxesCombined, Leaf, LineChart, Sprout } from "lucide-react";


export default function Home() {
    const { user } = useUser();

    return (
        <div className="w-full">
            <main className="w-full space-y-10">
                <section className="relative overflow-hidden rounded-3xl border border-emerald-100/70 bg-linear-to-br from-emerald-50 via-white to-sky-50 p-8 shadow-lg shadow-emerald-100/60">
                    <div className="pointer-events-none absolute inset-0 -z-10 opacity-70">
                        <div className="absolute inset-x-10 -top-24 h-64 rounded-full bg-emerald-200/30 blur-3xl" />
                        <div className="absolute inset-y-0 right-0 w-1/2 rounded-full bg-sky-200/20 blur-3xl" />
                    </div>

                    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.9fr)]">
                        <section className="space-y-6 text-center lg:text-left">
                            <Badge className="w-fit gap-2 border-emerald-200/80 bg-white/70 text-xs font-medium text-emerald-700 shadow-sm backdrop-blur">
                                <Sprout className="h-3 w-3" />
                                Designed for affordable hydroponic optimization for small to midrange businesses.
                            </Badge>

                            <div className="space-y-4">
                                <h1 className="text-balance text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl">
                                    Monitor the Electrical Conductivity, pH, ORP, and Temperature of the water flow system for hydroponic Cultivation.
                                    <span className="text-emerald-600"> in real time</span>.
                                </h1>
                                <p className="text-balance text-base text-slate-600 sm:text-lg">
                                    For the monitoring of water quality for a Hydroponic system.
                                </p>
                            </div>

                            <SignedOut>
                                <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-center lg:justify-start">
                                    <SignInButton mode="modal">
                                        <Button size="lg" className="gap-2">
                                            <ChartNoAxesCombined className="h-4 w-4" />
                                            Log in to get started
                                        </Button>
                                    </SignInButton>

                                    <span className="text-xs text-slate-500">
                    No credit card required - Powered by Clerk auth
                  </span>
                                </div>
                            </SignedOut>

                            <SignedIn>
                                <div className="space-y-3">
                                    <p className="text-sm text-slate-600">
                                        Welcome{user?.firstName ? `, ${user.firstName}` : ""}! You&apos;re signed in and ready to track your water parameters.
                                    </p>

                                    <div className="flex flex-col items-center gap-3 sm:flex-row sm:justify-start">
                                        <Button asChild size="lg" className="gap-2">
                                            <Link href="/analytics">
                                                <ChartNoAxesCombined className="h-4 w-4" />
                                                Go to Analytics
                                            </Link>
                                        </Button>

                                        <span className="text-xs text-slate-500">
                      View live metrics and historical trends
                    </span>
                                    </div>
                                </div>
                            </SignedIn>
                        </section>

                        <section className="w-full">
                            <Card className="border-emerald-100/70 bg-white/80 shadow-lg shadow-emerald-100/50 backdrop-blur">
                                <CardHeader className="pb-4">
                                    <CardTitle className="flex items-center gap-2 text-base font-semibold text-slate-900">
                                        <LineChart className="h-4 w-4 text-emerald-500" />
                                        Live water metrics.
                                    </CardTitle>
                                    <CardDescription>
                                        A preview of your dashboard.
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-4">
                                    <div className="grid grid-cols-2 gap-3 text-xs sm:text-sm">
                                        <div className="rounded-xl border border-emerald-100 bg-emerald-50/70 p-3 shadow-[0_10px_30px_-24px_rgba(16,185,129,0.8)]">
                                            <div className="flex items-center gap-2">
                                                <Leaf className="h-4 w-4 text-emerald-600 " />
                                                <span className="font-medium text-slate-900">
                          Water Quality Monitoring
                        </span>
                                            </div>
                                            <p className="mt-1 text-2xl font-semibold text-emerald-700">
                                                16.2 cm
                                            </p>
                                            <p className="text-[11px] text-emerald-700/80">
                                                +1.1 cm in last 24h
                                            </p>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="rounded-xl border border-slate-100/80 bg-white/70 p-2.5 shadow-sm">
                                                <p className="text-[11px] font-medium text-slate-500">
                                                    Anomalies
                                                </p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    0
                                                    <span className="ml-1 text-[11px] text-emerald-600">
                            Optimal
                          </span>
                                                </p>
                                            </div>
                                            <div className="rounded-xl border border-slate-100/80 bg-white/70 p-2.5 shadow-sm">
                                                <p className="text-[11px] font-medium text-slate-500">
                                                    Active sensors
                                                </p>
                                                <p className="text-lg font-semibold text-slate-900">
                                                    16
                                                    <span className="ml-1 text-[11px] text-red-600">
                            4 inactive
                          </span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="mt-2 space-y-2">
                                        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                                            Today&apos;s growth trend
                                        </p>
                                        <div className="h-20 rounded-xl border border-dashed border-emerald-200 bg-linear-to-r from-emerald-50 via-white to-sky-50 px-2 py-1 shadow-inner">

                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </section>
                    </div>
                </section>

                <footer className="text-center text-xs text-slate-500">
                    Built by greentechlab at Fontys in Venlo, and a love for tomatoes.
                </footer>
            </main>
        </div>
    );
}
