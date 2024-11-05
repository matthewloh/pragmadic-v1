"use client"

import { TrendingUp } from "lucide-react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
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

const sentimentData = [
    { month: "January", positive: 65, negative: 35, neutral: 45 },
    { month: "February", positive: 75, negative: 30, neutral: 50 },
    { month: "March", positive: 85, negative: 25, neutral: 55 },
    { month: "April", positive: 70, negative: 40, neutral: 45 },
    { month: "May", positive: 90, negative: 20, neutral: 60 },
    { month: "June", positive: 95, negative: 15, neutral: 65 },
]

const chartConfig = {
    positive: {
        label: "Positive",
        color: "hsl(var(--success))",
    },
    negative: {
        label: "Negative",
        color: "hsl(var(--destructive))",
    },
    neutral: {
        label: "Neutral",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig

export function SentimentChart() {
    const positiveChange = (
        ((sentimentData[5].positive - sentimentData[4].positive) /
            sentimentData[4].positive) *
        100
    ).toFixed(1)

    return (
        <Card>
            <CardHeader>
                <CardTitle>Sentiment Analysis</CardTitle>
                <CardDescription>
                    Last 6 Months Sentiment Trends
                </CardDescription>
            </CardHeader>
            <CardContent>
                <ChartContainer config={chartConfig}>
                    <LineChart
                        accessibilityLayer
                        data={sentimentData}
                        margin={{
                            top: 20,
                            right: 20,
                            bottom: 20,
                            left: 20,
                        }}
                    >
                        <CartesianGrid vertical={false} strokeDasharray="3 3" />
                        <XAxis
                            dataKey="month"
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => value.slice(0, 3)}
                        />
                        <YAxis
                            tickLine={false}
                            axisLine={false}
                            tickMargin={8}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <ChartTooltip
                            cursor={false}
                            content={<ChartTooltipContent />}
                        />
                        <Line
                            type="monotone"
                            dataKey="positive"
                            stroke="var(--color-positive)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="negative"
                            stroke="var(--color-negative)"
                            strokeWidth={2}
                            dot={false}
                        />
                        <Line
                            type="monotone"
                            dataKey="neutral"
                            stroke="var(--color-neutral)"
                            strokeWidth={2}
                            dot={false}
                        />
                    </LineChart>
                </ChartContainer>
            </CardContent>
            <CardFooter>
                <div className="flex w-full items-start gap-2 text-sm">
                    <div className="grid gap-2">
                        <div className="flex items-center gap-2 font-medium leading-none">
                            Positive sentiment up by {positiveChange}% this
                            month
                            <TrendingUp className="text-success h-4 w-4" />
                        </div>
                        <div className="flex items-center gap-2 leading-none text-muted-foreground">
                            Showing sentiment analysis for the last 6 months
                        </div>
                    </div>
                </div>
            </CardFooter>
        </Card>
    )
}
