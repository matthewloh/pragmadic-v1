import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardDescription,
} from "@/components/ui/card"

interface TopRatedHubData {
    name: string
    rating: number
    reviews: number
}

const chartConfig = {
    rating: {
        label: "Rating",
        color: "hsl(var(--chart-2))",
    },
    reviews: {
        label: "Reviews",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function TopRatedHubs({ data }: { data: TopRatedHubData[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Top Rated Hubs</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Top Rated Hubs</CardTitle>
                <CardDescription>
                    Highest rated hubs (minimum 5 reviews)
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis
                            type="number"
                            domain={[0, 5]}
                            tickFormatter={(value) => `${value}⭐`}
                        />
                        <YAxis
                            dataKey="name"
                            type="category"
                            width={120}
                            tick={{ fontSize: 12 }}
                        />
                        <Bar
                            name="Rating"
                            dataKey="rating"
                            fill={chartConfig.rating.color}
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                        <Bar
                            name="Reviews"
                            dataKey="reviews"
                            fill={chartConfig.reviews.color}
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
