"use client"

import { Bar, BarChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { type HubAnalytics } from "../types"

type EventsParticipationChartProps = {
    data?: HubAnalytics["hub_events"]
}

export function EventsParticipationChart({
    data,
}: EventsParticipationChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>Event Participation</CardTitle>
                </CardHeader>
                <CardContent className="flex h-[350px] items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No event data available
                    </p>
                </CardContent>
            </Card>
        )
    }

    const participationData = data.map((event) => {
        const totalParticipants = event.users_to_events?.length ?? 0
        const acceptedParticipants =
            event.users_to_events?.filter((user) => user.pending === false)
                .length ?? 0

        const participationRate =
            totalParticipants > 0
                ? Math.round((acceptedParticipants / totalParticipants) * 100)
                : 0

        return {
            name: event.name,
            participation: participationRate,
        }
    })

    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle className="text-center">
                    Event Participation
                </CardTitle>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer
                    config={{
                        participation: {
                            label: "Participation Rate",
                            color: "hsl(var(--chart-1))",
                        },
                    }}
                    className="h-full w-full"
                >
                    <BarChart
                        data={participationData}
                        margin={{ left: 16, right: 16, top: 8, bottom: 24 }}
                    >
                        <XAxis
                            dataKey="name"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) =>
                                value.length > 20
                                    ? `${value.substring(0, 20)}...`
                                    : value
                            }
                            height={40}
                            angle={-45}
                            textAnchor="end"
                        />
                        <YAxis
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}%`}
                            domain={[0, 100]}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                        <Bar
                            dataKey="participation"
                            fill="var(--color-participation)"
                            radius={[4, 4, 0, 0]}
                            barSize={32}
                        />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
