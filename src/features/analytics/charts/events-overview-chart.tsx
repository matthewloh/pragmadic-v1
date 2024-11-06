"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { HubAnalytics } from "../types"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer } from "recharts"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

type EventsOverviewChartProps = {
    data?: HubAnalytics["hub_events"]
}

export function EventsOverviewChart({ data }: EventsOverviewChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card>
                <CardHeader>
                    <CardTitle>Events Overview</CardTitle>
                    <CardDescription>
                        Monthly distribution of events
                    </CardDescription>
                </CardHeader>
                <CardContent className="flex h-[300px] items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No event data available
                    </p>
                </CardContent>
            </Card>
        )
    }

    const monthlyEvents = data.reduce(
        (acc, event) => {
            const month = new Date(event.start_date).toLocaleString("default", {
                month: "short",
            })
            acc[month] = (acc[month] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const chartData = Object.entries(monthlyEvents)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => {
            const months = [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
            ]
            return months.indexOf(a.month) - months.indexOf(b.month)
        })

    return (
        <Card>
            <CardHeader>
                <CardTitle className="text-center">Events Overview</CardTitle>
                <CardDescription className="text-center">
                    Monthly distribution of events
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer
                    config={{
                        count: {
                            label: "Number of Events",
                            color: "hsl(var(--primary))",
                        },
                    }}
                    className="h-full w-full"
                >
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={chartData}
                            margin={{
                                top: 10,
                                right: 10,
                                left: 10,
                                bottom: 20,
                            }}
                        >
                            <XAxis
                                dataKey="month"
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="hsl(var(--muted-foreground))"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={(value) => `${value}`}
                            />
                            <ChartTooltip
                                content={
                                    <ChartTooltipContent
                                        formatter={(value: any) => [
                                            `${value} Events`,
                                        ]}
                                    />
                                }
                            />
                            <Bar
                                dataKey="count"
                                fill="var(--color-count)"
                                radius={[4, 4, 0, 0]}
                                maxBarSize={50}
                            />
                        </BarChart>
                    </ResponsiveContainer>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
