
import { type Metadata } from 'next'
import {
    ClerkProvider,
    SignInButton,
    SignUpButton,
    SignedIn,
    SignedOut,
    UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import {SidebarInset, SidebarProvider, SidebarTrigger}from "@/components/layout/sidebar";
import Link from "next/link";
import {Toaster} from "@/components/ui/Sonner";



const geistSans = Geist({
    variable: '--font-geist-sans',
    subsets: ['latin'],
})

const geistMono = Geist_Mono({
    variable: '--font-geist-mono',
    subsets: ['latin'],
})

export const metadata: Metadata = {
    title: 'Hydroponics Monitoring System',
    description: 'A Next.js app',
}

export default function RootLayout({
                                        children,
                                    }: Readonly<{
    children: React.ReactNode
}>) {
    return (
        <html lang="en">
        <ClerkProvider>
            <body
                className={`${geistSans.variable} ${geistMono.variable} antialiased`}
            >
            {/* Sonner toaster */}
            <Toaster
                position="top-center"
                closeButton
            />

            <routeToast />
            <SidebarProvider
                style={
                    {
                        // optional: tweak widths
                        "--sidebar-width": "16rem",
                        "--sidebar-width-mobile": "18rem",
                    } as React.CSSProperties
                }
            >
                {/* Left collapsible sidebar */}
                <sidebar-build />

                {/* Main content area */}
                <SidebarInset className="flex min-h-screen flex-1 flex-col">
                    {/* Header */}
                    <header className="flex h-16 items-center justify-between border-b border-gray-200 px-4">
                        {/* Mobile sidebar toggle */}
                        <SidebarTrigger className="lg:hidden" />

                        {/* Logo + title (centered on desktop, nice on mobile) */}
                        <div className="flex items-center gap-6">
                            <Link
                                href="/"
                                className="flex items-center gap-3" // make the link a flex row
                            >
                                <Image
                                    src="/green-tech-logo.png"
                                    alt="Logo"
                                    height={100}
                                    width={100}
                                    className="object-contain"
                                />

                                <div className="hidden sm:flex flex-col">
                      <span className="text-sm font-semibold leading-tight">
                        Tomato Growth Monitor
                      </span>
                                    <span className="text-xs text-muted-foreground">
                        Live plant health &amp; environment tracking
                      </span>
                                </div>
                            </Link>
                        </div>


                        {/* Right-side actions */}
                        <div className="flex items-center gap-3">
                            <SignedIn>
                                <UserButton />
                            </SignedIn>

                            <SignedOut>
                                <SignInButton mode="modal">
                                    <button className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2">
                                        Log in
                                    </button>
                                </SignInButton>
                            </SignedOut>
                        </div>
                    </header>


                    {/* Centered content container */}
                    <main className="flex w-full justify-center bg-linear-to-b from-emerald-50 via-white to-sky-50">
                        <div className="w-full min-h-[calc(100vh-4rem)] mx-auto flex max-w-5xl flex-1 flex-col items-center px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
                            {children}
                        </div>
                    </main>
                </SidebarInset>
            </SidebarProvider>
            </body>
        </ClerkProvider>
        </html>
    )
}}