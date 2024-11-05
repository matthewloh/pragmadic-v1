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

interface HubComparisonData {
    hub: string
    rating: number
    reviews: number
}

const chartConfig = {
    rating: {
        label: "Rating",
        color: "hsl(var(--chart-2))",
    },
} satisfies ChartConfig

export default function HubComparison({ data }: { data: HubComparisonData[] }) {
    if (!data || data.length === 0) {
        return (
            <Card className="w-full">
                <CardHeader>
                    <CardTitle>Hub Ratings Comparison</CardTitle>
                    <CardDescription>No data available</CardDescription>
                </CardHeader>
            </Card>
        )
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle>Hub Ratings Comparison</CardTitle>
                <CardDescription>Average ratings across hubs</CardDescription>
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
                        <XAxis type="number" domain={[0, 5]} />
                        <YAxis dataKey="hub" type="category" width={150} />
                        <Bar
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
