"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { type HubAnalytics } from "../types"

type OccupationsChartProps = {
    data?: HubAnalytics["users_to_hubs"]
}

export function OccupationsChart({ data }: OccupationsChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>Member Occupations</CardTitle>
                </CardHeader>
                <CardContent className="flex h-full w-full items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No member data available
                    </p>
                </CardContent>
            </Card>
        )
    }

    // Count accepted members by occupation from profile
    const occupationCounts = data.reduce(
        (acc, member) => {
            if (
                member.invite_status === "accepted" &&
                member.users?.profile?.occupation
            ) {
                const occupation = member.users.profile.occupation
                acc[occupation] = (acc[occupation] || 0) + 1
            }
            return acc
        },
        {} as Record<string, number>,
    )

    const chartData = Object.entries(occupationCounts)
        .map(([occupation, count]) => ({
            occupation,
            count,
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10) // Show top 10 occupations

    return (
        <div className="h-full w-full">
            <ChartContainer
                config={{
                    count: {
                        label: "Members",
                        color: "hsl(var(--chart-2))",
                    },
                }}
                className="h-full w-full"
            >
                <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{
                        left: 80,
                        right: 16,
                        top: 0,
                        bottom: 0,
                    }}
                >
                    <XAxis
                        type="number"
                        tickFormatter={(value: any) =>
                            Math.floor(value).toString()
                        }
                        domain={[0, "dataMax"]}
                    />
                    <YAxis
                        dataKey="occupation"
                        type="category"
                        width={70}
                        tick={{ fontSize: 10 }}
                        tickFormatter={(value) =>
                            value.length > 12
                                ? `${value.substring(0, 12)}...`
                                : value
                        }
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar
                        dataKey="count"
                        fill="var(--color-count)"
                        radius={[0, 4, 4, 0]}
                        barSize={16}
                    />
                </BarChart>
            </ChartContainer>
        </div>
    )
}
