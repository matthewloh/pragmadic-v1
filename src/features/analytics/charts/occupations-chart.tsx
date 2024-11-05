"use client"

import { TrendingUp } from "lucide-react"
import { Bar, BarChart, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"

const occupationData = [
    {
        occupation: "software_engineer",
        count: 120,
        fill: "var(--color-software-engineer)",
    },
    {
        occupation: "designer",
        count: 80,
        fill: "var(--color-designer)",
    },
    {
        occupation: "product_manager",
        count: 40,
        fill: "var(--color-product-manager)",
    },
    {
        occupation: "content_creator",
        count: 30,
        fill: "var(--color-content-creator)",
    },
    {
        occupation: "digital_marketer",
        count: 60,
        fill: "var(--color-digital-marketer)",
    },
    {
        occupation: "data_scientist",
        count: 45,
        fill: "var(--color-data-scientist)",
    },
    {
        occupation: "freelancer",
        count: 55,
        fill: "var(--color-freelancer)",
    },
]

const chartConfig = {
    count: {
        label: "Members",
    },
    software_engineer: {
        label: "Software Engineer",
        color: "hsl(var(--chart-1))",
    },
    designer: {
        label: "Designer",
        color: "hsl(var(--chart-2))",
    },
    product_manager: {
        label: "Product Manager",
        color: "hsl(var(--chart-3))",
    },
    content_creator: {
        label: "Content Creator",
        color: "hsl(var(--chart-4))",
    },
    digital_marketer: {
        label: "Digital Marketer",
        color: "hsl(var(--chart-5))",
    },
    data_scientist: {
        label: "Data Scientist",
        color: "hsl(var(--chart-6))",
    },
    freelancer: {
        label: "Freelancer",
        color: "hsl(var(--chart-7))",
    },
} satisfies ChartConfig

export function OccupationsChart() {
    const totalMembers = occupationData.reduce(
        (sum, item) => sum + item.count,
        0,
    )
    const topOccupation = occupationData.reduce((max, item) =>
        item.count > max.count ? item : max,
    )
    const topPercentage = ((topOccupation.count / totalMembers) * 100).toFixed(
        1,
    )

    return (
        <Card>
            <CardHeader>
                <CardTitle>Member Occupations</CardTitle>
                <CardDescription>
                    Distribution of professional backgrounds
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <BarChart
                        accessibilityLayer
                        data={occupationData}
                        layout="vertical"
                        margin={{
                            left: 0,
                            right: 20,
                        }}
                    >
                        <YAxis
                            dataKey="occupation"
                            type="category"
                            tickLine={false}
                            tickMargin={10}
                            axisLine={false}
                            tickFormatter={(value) =>
                                chartConfig[value as keyof typeof chartConfig]
                                    ?.label
                            }
                        />
                        <XAxis dataKey="count" type="number" hide />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent hideLabel />}
                        />
                        <Bar dataKey="count" layout="vertical" radius={5} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 text-sm">
                <div className="flex gap-2 font-medium leading-none">
                    {
                        chartConfig[
                            topOccupation.occupation as keyof typeof chartConfig
                        ]?.label
                    }{" "}
                    leads at {topPercentage}%
                    <TrendingUp className="h-4 w-4" />
                </div>
                <div className="leading-none text-muted-foreground">
                    Total of {totalMembers} members across all professions
                </div>
            </CardFooter>
        </Card>
    )
}
