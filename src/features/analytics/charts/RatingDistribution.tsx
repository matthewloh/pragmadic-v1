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

interface RatingDistributionData {
    rating: number
    count: number
}

const chartConfig = {
    count: {
        label: "Reviews",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function RatingDistribution({
    data,
}: {
    data: RatingDistributionData[]
}) {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Rating Distribution</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Rating Distribution</CardTitle>
                <CardDescription>Number of reviews per rating</CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={data}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis
                            dataKey="rating"
                            tickFormatter={(value) => `${value}⭐`}
                        />
                        <YAxis />
                        <Bar
                            dataKey="count"
                            fill={chartConfig.count.color}
                            radius={[4, 4, 0, 0]}
                            barSize={20}
                        />
                        <ChartTooltip content={<ChartTooltipContent />} />
                    </BarChart>
                </ChartContainer>
            </CardContent>
        </Card>
    )
}
