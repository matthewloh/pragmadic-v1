"use client"

import { Card } from "@/components/ui/card"
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from "recharts"

const mockEventData = [
    {
        event: "Workshop",
        attendance: 45,
        satisfaction: 85,
        engagement: 75,
    },
    {
        event: "Networking",
        attendance: 60,
        satisfaction: 90,
        engagement: 80,
    },
    {
        event: "Meetup",
        attendance: 35,
        satisfaction: 80,
        engagement: 70,
    },
    {
        event: "Conference",
        attendance: 80,
        satisfaction: 95,
        engagement: 85,
    },
]

export function EventsChart() {
    return (
        <Card className="p-4">
            <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={mockEventData}>
                        <XAxis
                            dataKey="event"
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                        />
                        <YAxis
                            stroke="#888888"
                            fontSize={12}
                            tickLine={false}
                            axisLine={false}
                            tickFormatter={(value) => `${value}%`}
                        />
                        <Tooltip />
                        <Legend />
                        <Bar
                            dataKey="attendance"
                            fill="#2563eb"
                            radius={[4, 4, 0, 0]}
                            stackId="stack"
                        />
                        <Bar
                            dataKey="satisfaction"
                            fill="#16a34a"
                            radius={[4, 4, 0, 0]}
                            stackId="stack"
                        />
                        <Bar
                            dataKey="engagement"
                            fill="#9333ea"
                            radius={[4, 4, 0, 0]}
                            stackId="stack"
                        />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}
