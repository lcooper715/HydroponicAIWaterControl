"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarRail,
    useSidebar,
} from "@/components/layout/sidebar"
import {
    Activity,
    AlertTriangle,
    ChevronLeft,
    ChevronRight,
    Droplets,
    Home,
    LineChart,
    Settings,
    Thermometer,
    Waves,
} from "lucide-react"
import { cn } from "@/lib/utils"

// Desktop-only round handle on the right edge of the sidebar
function DesktopSidebarHandle() {
    const { state, toggleSidebar, isMobile } = useSidebar()
    if (isMobile) return null

    const isCollapsed = state === "collapsed"

    return (
        <button
            type="button"
            onClick={toggleSidebar}
            aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            className={cn(
                "pointer-events-auto absolute -right-4 top-1/2 z-30 hidden",
                "h-9 w-9 -translate-y-1/2 items-center justify-center",
                "rounded-full border border-sky-200 bg-white text-sky-700 shadow-md hover:bg-sky-50 lg:flex",
            )}
        >
            {isCollapsed ? (
                <ChevronRight className="h-4 w-4" />
            ) : (
                <ChevronLeft className="h-4 w-4" />
            )}
        </button>
    )
}

export function AppSidebar() {
    const pathname = usePathname()
    const { state } = useSidebar()
    const isCollapsed = state === "collapsed"

    const navItems = [
        { icon: Home, label: "Overview", href: "/" },
        { icon: LineChart, label: "Analytics", href: "/analytics" },
        { icon: Droplets, label: "Water Quality", href: "/water-quality" }, // pH / EC / ORP
        { icon: Thermometer, label: "Temperature", href: "/temperature" },
        { icon: Activity, label: "Sensors", href: "/sensors" },
        { icon: AlertTriangle, label: "Anomalies", href: "/anomalies" },
        { icon: Settings, label: "Settings", href: "/settings" },
    ]

    const isActive = (href: string) =>
        pathname === href || (href !== "/" && pathname?.startsWith(href + "/"))

    return (
        <Sidebar
            collapsible="icon"
            className={cn(
                "border-r border-sky-100",
                "bg-gradient-to-b from-sky-50 via-white to-emerald-50",
                "text-slate-800",
            )}
        >
            <DesktopSidebarHandle />

            <SidebarHeader className="flex items-center gap-3 px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
                {!isCollapsed && (
                    <div className="space-y-0.5">
                        <p className="text-sm font-semibold leading-tight text-slate-900">
                            Hydroponics Water Monitor
                        </p>
                        <p className="text-xs text-slate-500">pH • EC • ORP • Temp</p>
                    </div>
                )}
            </SidebarHeader>

            <SidebarContent className="px-3 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
                <SidebarMenu className="gap-1 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:justify-center">
                    {navItems.map((item) => {
                        const Icon = item.icon
                        const active = isActive(item.href)

                        return (
                            <SidebarMenuItem key={item.href}>
                                <SidebarMenuButton
                                    asChild
                                    isActive={active}
                                    className={cn(
                                        "group rounded-lg border border-sky-100 bg-white/80 px-3 py-2",
                                        "text-slate-800 shadow-sm transition",
                                        "hover:border-sky-200 hover:bg-sky-50",
                                        "data-[active=true]:border-sky-300 data-[active=true]:bg-sky-100/70 data-[active=true]:text-sky-900",
                                    )}
                                >
                                    <Link href={item.href}>
                                        <Icon className="h-4 w-4 text-sky-600" />
                                        {!isCollapsed && <span>{item.label}</span>}
                                    </Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        )
                    })}
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter className="px-3 py-4 group-data-[collapsible=icon]:items-center group-data-[collapsible=icon]:px-2">
                <div className="flex items-center gap-2 rounded-lg border border-sky-100 bg-white/80 px-3 py-2 text-[11px] text-slate-600 shadow-sm">
                    <Waves className="h-4 w-4 text-sky-500" />
                    {!isCollapsed && <span>Stable water, healthy roots</span>}
                </div>
            </SidebarFooter>

            <SidebarRail className="hover:bg-white/5" />
        </Sidebar>
    )
}
