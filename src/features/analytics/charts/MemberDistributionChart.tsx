"use client"

import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

interface MemberDistributionData {
    value: string
    count: number
}

interface MemberDistributionProps {
    distribution?: MemberDistributionData[]
    total?: number
}

const chartConfig = {
    count: {
        label: "Members",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export function MemberDistributionChart({
    distribution,
    total,
}: MemberDistributionProps) {
    if (total) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Total Members</CardTitle>
                    <CardDescription>Current member count</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{total}</div>
                </CardContent>
            </Card>
        )
    }

    if (!distribution || distribution.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Member Distribution</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    const chartData = distribution.map((item) => ({
        category: item.value,
        count: Number(item.count),
    }))

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Member Distribution</CardTitle>
                <CardDescription>Breakdown by category</CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={chartData}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                        />
                        <YAxis
                            dataKey="category"
                            type="category"
                            axisLine={false}
                            tickLine={false}
                            width={80}
                            tick={{ fontSize: 12 }}
                        />
                        <XAxis
                            type="number"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fontSize: 12 }}
                        />
                        <Bar
                            dataKey="count"
                            fill={chartConfig.count.color}
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
