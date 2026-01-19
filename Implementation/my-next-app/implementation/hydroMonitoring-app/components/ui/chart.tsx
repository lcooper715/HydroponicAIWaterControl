"use client"

import * as React from "react"
import * as RechartsPrimitive from "recharts"
import type { TooltipProps } from "recharts"
import type { ValueType, NameType } from "recharts/types/component/DefaultTooltipContent"
import { cn } from "@/lib/utils"


const THEMES = { light: "", dark: ".dark" } as const

export type ChartConfig = {
    [k in string]: {
    label?: React.ReactNode
    icon?: React.ComponentType
} & (
    | { color?: string; theme?: never }
    | { color?: never; theme: Record<keyof typeof THEMES, string> }
    )
}

type ChartContextProps = {
    config: ChartConfig
}

const ChartContext = React.createContext<ChartContextProps | null>(null)

function useChart() {
    const context = React.useContext(ChartContext)

    if (!context) {
        throw new Error("useChart must be used within a <ChartContainer />")
    }

    return context
}

const ChartStyle = ({ id, config }: { id: string; config: ChartConfig }) => {
    const colorConfig = Object.entries(config).filter(
        ([, config]) => config.theme || config.color
    )

    if (!colorConfig.length) {
        return null
    }

    return (
        <style
            dangerouslySetInnerHTML={{
                __html: Object.entries(THEMES)
                    .map(
                        ([theme, prefix]) => `
${prefix} [data-chart=${id}] {
${colorConfig
                            .map(([key, itemConfig]) => {
                                const color =
                                    itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
                                    itemConfig.color
                                return color ? `  --color-${key}: ${color};` : null
                            })
                            .join("\n")}
}
`
                    )
                    .join("\n"),
            }}
        />
    )
}




export {
    useChart,
    ChartStyle,
}
