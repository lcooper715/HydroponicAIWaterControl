// app/layout.tsx
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import { SidebarInset, SidebarProvider } from "@/components/layout/sidebar";
import SidebarBuild from "@/components/sidebar-build";
import { Toaster } from "@/components/ui/sonner";

export const metadata: Metadata = {
    title: "Hydroponics Monitoring System",
    description: "A Next.js app",
};

export default function RootLayout({ children }: { children: ReactNode }) {
    return (
        <html lang="en">
        <body className="antialiased">
        <ClerkProvider>
            <Toaster position="top-center" closeButton />

            <SidebarProvider
                style={
                    {
                        "--sidebar-width": "16rem",
                        "--sidebar-width-mobile": "18rem",
                    } as React.CSSProperties
                }
            >
                <SidebarBuild />

                <SidebarInset className="flex min-h-screen flex-1 flex-col">
                    {/* the previous top bar was here*/}
                    <main className="flex w-full justify-center bg-gradient-to-b from-blue-200 via-slate-200 to-emerald-200">
                        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-1 flex-col items-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
        </ClerkProvider>
        </body>
        </html>
    );
}
