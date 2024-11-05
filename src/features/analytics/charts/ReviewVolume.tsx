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

interface ReviewVolumeData {
    hub: string
    count: number
    rating: number
}

const chartConfig = {
    count: {
        label: "Reviews",
        color: "hsl(var(--chart-1))",
    },
    rating: {
        label: "Rating",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default function ReviewVolume({ data }: { data: ReviewVolumeData[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Review Volume by Hub</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Review Volume by Hub</CardTitle>
                <CardDescription>
                    Number of reviews and average rating per hub
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
                        <XAxis type="number" />
                        <YAxis dataKey="hub" type="category" width={150} />
                        <Bar
                            name="Reviews"
                            dataKey="count"
                            fill={chartConfig.count.color}
                            radius={[0, 4, 4, 0]}
                            barSize={20}
                        />
                        <Bar
                            name="Rating"
                            dataKey="rating"
                            fill={chartConfig.rating.color}
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
