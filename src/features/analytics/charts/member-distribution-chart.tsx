"use client"

import * as React from "react"
import { PieChart, Pie, Cell, Legend } from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

interface MemberDistributionChartProps {
    data: {
        invite_role_type: string
        invite_status: string
    }[]
}

export function MemberDistributionChart({
    data,
}: MemberDistributionChartProps) {
    if (!data || data.length === 0) {
        return (
            <Card className="h-full w-full">
                <CardHeader>
                    <CardTitle>Member Role Distribution</CardTitle>
                </CardHeader>
                <CardContent className="flex h-[350px] items-center justify-center">
                    <p className="text-sm text-muted-foreground">
                        No member data available
                    </p>
                </CardContent>
            </Card>
        )
    }

    const distribution = data.reduce(
        (acc, member) => {
            const role = member.invite_role_type
            acc[role] = (acc[role] || 0) + 1
            return acc
        },
        {} as Record<string, number>,
    )

    const total = Object.values(distribution).reduce((a, b) => a + b, 0)
    const chartData = Object.entries(distribution).map(([role, count]) => ({
        name: role.charAt(0).toUpperCase() + role.slice(1),
        value: count,
        percentage: Math.round((count / total) * 100),
    }))

    const COLORS = {
        Admin: "hsl(var(--chart-1))",
        Member: "hsl(var(--chart-2))",
        Owner: "hsl(var(--chart-3))",
    }

    const RADIAN = Math.PI / 180
    const renderCustomizedLabel = ({
        cx,
        cy,
        midAngle,
        innerRadius,
        outerRadius,
        percent,
        name,
    }: any) => {
        const radius = innerRadius + (outerRadius - innerRadius) * 0.6
        const x = cx + radius * Math.cos(-midAngle * RADIAN)
        const y = cy + radius * Math.sin(-midAngle * RADIAN)

        return percent > 0.05 ? (
            <text
                x={x}
                y={y}
                fill="white"
                textAnchor={x > cx ? "start" : "end"}
                dominantBaseline="central"
                className="text-xs font-medium"
            >
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null
    }

    return (
        <Card className="h-full w-full">
            <CardHeader>
                <CardTitle>Member Role Distribution</CardTitle>
                <p className="text-sm text-muted-foreground">
                    Breakdown of member roles in the hub
                </p>
            </CardHeader>
            <CardContent>
                <ChartContainer
                    config={Object.fromEntries(
                        chartData.map(({ name }) => [
                            name.toLowerCase(),
                            {
                                label: `${name} Members`,
                                color: COLORS[name as keyof typeof COLORS],
                            },
                        ]),
                    )}
                    className="h-full w-full"
                >
                    <PieChart>
                        <Pie
                            data={chartData}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            label={renderCustomizedLabel}
                            outerRadius={100}
                            fill="#8884d8"
                            dataKey="value"
                        >
                            {chartData.map((entry, index) => (
                                <Cell
                                    key={`cell-${index}`}
                                    fill={
                                        COLORS[
                                            entry.name as keyof typeof COLORS
                                        ]
                                    }
                                />
                            ))}
                        </Pie>
                        <ChartTooltip
                            content={
                                <ChartTooltipContent
                                    formatter={(value: any, name: any) =>
                                        `${value} (${chartData.find((d) => d.name === name)?.percentage}%)`
                                    }
                                />
                            }
                        />
                        <Legend
                            formatter={(value: string) => `${value} Members`}
                            className="text-xs"
                        />
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
