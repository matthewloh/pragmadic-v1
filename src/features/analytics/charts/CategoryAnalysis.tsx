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

interface CategoryAnalysisData {
    category: string
    rating: number
    count: number
}

const chartConfig = {
    rating: {
        label: "Rating",
        color: "hsl(var(--chart-2))",
    },
    count: {
        label: "Reviews",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig

export default function CategoryAnalysis({
    data,
}: {
    data: CategoryAnalysisData[]
}) {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Ratings by Hub Type</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Ratings by Hub Type</CardTitle>
                <CardDescription>
                    Average ratings and review counts by hub type
                </CardDescription>
            </CardHeader>
            <CardContent className="h-full w-full">
                <ChartContainer config={chartConfig}>
                    <BarChart
                        data={data}
                        layout="vertical"
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid
                            strokeDasharray="3 3"
                            horizontal={true}
                            vertical={false}
                        />
                        <XAxis
                            type="number"
                            domain={[
                                0,
                                Math.max(5, ...data.map((d) => d.count)),
                            ]}
                        />
                        <YAxis dataKey="category" type="category" width={150} />
                        <Bar
                            name="Rating"
                            dataKey="rating"
                            fill={chartConfig.rating.color}
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                        <Bar
                            name="Reviews"
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
