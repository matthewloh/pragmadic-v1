"use client"

import * as React from "react"
import { Label, Pie, PieChart, Sector } from "recharts"
import { PieSectorDataItem } from "recharts/types/polar/Pie"
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
    ChartStyle,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

const memberData = [
    { category: "active", count: 186, fill: "var(--color-active)" },
    { category: "new_joiners", count: 85, fill: "var(--color-new-joiners)" },
    { category: "regular", count: 237, fill: "var(--color-regular)" },
    { category: "inactive", count: 43, fill: "var(--color-inactive)" },
    { category: "premium", count: 129, fill: "var(--color-premium)" },
]

const chartConfig = {
    members: {
        label: "Members",
    },
    active: {
        label: "Active Members",
        color: "hsl(var(--chart-1))",
    },
    new_joiners: {
        label: "New Joiners",
        color: "hsl(var(--chart-2))",
    },
    regular: {
        label: "Regular Members",
        color: "hsl(var(--chart-3))",
    },
    inactive: {
        label: "Inactive Members",
        color: "hsl(var(--chart-4))",
    },
    premium: {
        label: "Premium Members",
        color: "hsl(var(--chart-5))",
    },
} satisfies ChartConfig

export function MemberDistributionChart() {
    const id = "member-distribution"
    const [activeCategory, setActiveCategory] = React.useState(
        memberData[0].category,
    )

    const activeIndex = React.useMemo(
        () => memberData.findIndex((item) => item.category === activeCategory),
        [activeCategory],
    )
    const categories = React.useMemo(
        () => memberData.map((item) => item.category),
        [],
    )

    const totalMembers = memberData.reduce((sum, item) => sum + item.count, 0)

    return (
        <Card data-chart={id}>
            <ChartStyle id={id} config={chartConfig} />
            <CardHeader className="flex-row items-start space-y-0 pb-0">
                <div className="grid gap-1">
                    <CardTitle>Member Distribution</CardTitle>
                    <CardDescription>
                        Total Members: {totalMembers}
                    </CardDescription>
                </div>
                <Select
                    value={activeCategory}
                    onValueChange={setActiveCategory}
                >
                    <SelectTrigger
                        className="ml-auto h-7 w-[180px] rounded-lg pl-2.5"
                        aria-label="Select category"
                    >
                        <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent align="end" className="rounded-xl">
                        {categories.map((key) => {
                            const config =
                                chartConfig[key as keyof typeof chartConfig]
                            if (!config) return null

                            return (
                                <SelectItem
                                    key={key}
                                    value={key}
                                    className="rounded-lg [&_span]:flex"
                                >
                                    <div className="flex items-center gap-2 text-xs">
                                        <span
                                            className="flex h-3 w-3 shrink-0 rounded-sm"
                                            style={{
                                                backgroundColor: `var(--color-${key})`,
                                            }}
                                        />
                                        {config?.label}
                                    </div>
                                </SelectItem>
                            )
                        })}
                    </SelectContent>
                </Select>
            </CardHeader>
            <CardContent className="flex flex-1 justify-center pb-4">
                <ChartContainer
                    id={id}
                    config={chartConfig}
                    className="mx-auto aspect-square w-full max-w-[300px]"
                >
                    <PieChart>
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Pie
                            data={memberData}
                            dataKey="count"
                            nameKey="category"
                            innerRadius={60}
                            strokeWidth={5}
                            activeIndex={activeIndex}
                            activeShape={({
                                outerRadius = 0,
                                ...props
                            }: PieSectorDataItem) => (
                                <g>
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 10}
                                    />
                                    <Sector
                                        {...props}
                                        outerRadius={outerRadius + 25}
                                        innerRadius={outerRadius + 12}
                                    />
                                </g>
                            )}
                        >
                            <Label
                                content={({ viewBox }) => {
                                    if (
                                        viewBox &&
                                        "cx" in viewBox &&
                                        "cy" in viewBox
                                    ) {
                                        const percentage = (
                                            (memberData[activeIndex].count /
                                                totalMembers) *
                                            100
                                        ).toFixed(1)
                                        return (
                                            <text
                                                x={viewBox.cx}
                                                y={viewBox.cy}
                                                textAnchor="middle"
                                                dominantBaseline="middle"
                                            >
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={viewBox.cy}
                                                    className="fill-foreground text-3xl font-bold"
                                                >
                                                    {percentage}%
                                                </tspan>
                                                <tspan
                                                    x={viewBox.cx}
                                                    y={(viewBox.cy || 0) + 24}
                                                    className="fill-muted-foreground text-sm"
                                                >
                                                    {
                                                        chartConfig[
                                                            memberData[
                                                                activeIndex
                                                            ]
                                                                .category as keyof typeof chartConfig
                                                        ]?.label
                                                    }
                                                </tspan>
                                            </text>
                                        )
                                    }
                                }}
                            />
                        </Pie>
                    </PieChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
