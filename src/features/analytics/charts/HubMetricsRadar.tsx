"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PolarAngleAxis, PolarGrid, Radar, RadarChart } from "recharts"
import { ChartConfig, ChartContainer, ChartTooltip } from "@/components/ui/chart"

interface HubMetric {
    aspect: string
    value: number
}

interface HubMetricsRadarProps {
    metrics: HubMetric[]
    timeframe: string
}

const chartConfig = {
    value: {
        label: "Score",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

const aspectLabels: Record<string, string> = {
    eventParticipation: "Event Participation",
    memberGrowth: "Member Growth",
    communityEngagement: "Community Engagement",
    skillsDiversity: "Skills Diversity",
    locationSpread: "Location Spread",
    interestOverlap: "Interest Overlap",
}

export function HubMetricsRadar({ metrics, timeframe }: HubMetricsRadarProps) {
    if (!metrics || metrics.length === 0) return null

    const chartData = metrics.map(metric => ({
        aspect: aspectLabels[metric.aspect] || metric.aspect,
        value: metric.value,
    }))

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Hub Performance Metrics</CardTitle>
                <CardDescription>
                    Analysis across key performance indicators
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig} className="mx-auto aspect-square h-[350px]">
                    <RadarChart data={chartData}>
                        <PolarGrid />
                        <PolarAngleAxis
                            dataKey="aspect"
                            tick={{ fill: "hsl(var(--foreground))", fontSize: 12 }}
                        />
                        <Radar
                            name="Metrics"
                            dataKey="value"
                            stroke="hsl(var(--primary))"
                            fill="hsl(var(--primary))"
                            fillOpacity={0.3}
                            dot={{
                                r: 4,
                                fill: "hsl(var(--primary))",
                                strokeWidth: 2,
                            }}
                        />
                        <ChartTooltip />
                    </RadarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
} 