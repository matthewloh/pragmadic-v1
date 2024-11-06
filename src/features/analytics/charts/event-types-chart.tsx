"use client"

import { Cell, Pie, PieChart, ResponsiveContainer, Legend } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { type HubAnalytics } from "../types"

type EventTypesChartProps = {
    data?: HubAnalytics["hub_events"]
}

export function EventTypesChart({ data }: EventTypesChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Event Types Distribution</CardTitle>
                    <CardDescription>
                        Breakdown of event types in the hub
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex h-[350px] items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No event data available
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Count events by type
    const eventTypeCounts = data.reduce(
        (acc, event) => {
            const type = event.type_of_event
            acc[type] = (acc[type] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const chartData = Object.entries(eventTypeCounts).map(([type, count]) => ({
        name: type,
        value: count,
    }))

    const COLORS = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
    ]

    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        index,
    }: {
        cx: number
        cy: number
        midAngle: number
        innerRadius: number
        outerRadius: number
        percent: number
        index: number
    }) => {
        const RADIAN = Math.PI / 180
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return (
            <text
                x={x}
                y={y}
                fill="hsl(var(--background))"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        )
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">
                    Event Types Distribution
                </CardTitle>
                <CardDescription className="text-center">
                    Breakdown of event types in the hub
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer
                    config={chartData.reduce(
                        (acc: any, item: any, index: number) => {
                            acc[item.name] = {
                                label: item.name,
                                color: COLORS[index % COLORS.length],
                            }
                            return acc
                        },
                        {},
                    )}
                    className="h-full w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={chartData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={renderCustomizedLabel}
                                outerRadius={120}
                                fill="#8884d8"
                                dataKey="value"
                            >
                                {chartData.map((entry, index) => (
                                    <Cell
                                        key={`cell-${index}`}
                                        fill={COLORS[index % COLORS.length]}
                                    />
                                ))}
                            </Pie>
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(value: any, name: any) => [
                                            `${value} events of type ${name}`,
                                        ]}
                                    />
                                }
                            />
                            <Legend formatter={(value: string) => value} />
                        </PieChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
