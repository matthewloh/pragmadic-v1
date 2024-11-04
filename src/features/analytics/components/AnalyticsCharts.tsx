"use client"

import {
    BarChart,
    RadarChart,
    ScatterChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    Radar,
    PolarGrid,
    PolarAngleAxis,
    PolarRadiusAxis,
    Scatter,
    ZAxis,
} from "recharts"
import { BarCharts } from "../charts/bar-charts"

interface AnalyticsChartsProps {
    view: "occupations" | "sentiment" | "events"
}

export function AnalyticsCharts({ view }: AnalyticsChartsProps) {
    // Sample data - replace with real data from your API
    const occupationData = [
        { name: "Software Engineer", count: 120 },
        { name: "Designer", count: 80 },
        { name: "Product Manager", count: 40 },
        { name: "Content Creator", count: 30 },
        { name: "Digital Marketer", count: 60 },
    ]

    const sentimentData = [
        { subject: "Community", A: 120, B: 110 },
        { subject: "Workspace", A: 98, B: 130 },
        { subject: "Events", A: 86, B: 130 },
        { subject: "Location", A: 99, B: 100 },
        { subject: "Amenities", A: 85, B: 90 },
    ]

    const eventData = [
        { x: 10, y: 30, z: 200, name: "Networking" },
        { x: 30, y: 50, z: 100, name: "Workshop" },
        { x: 45, y: 80, z: 150, name: "Meetup" },
        { x: 70, y: 40, z: 250, name: "Conference" },
    ]

    const renderChart = () => {
        switch (view) {
            case "occupations":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart data={occupationData}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                )
            case "sentiment":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <RadarChart data={sentimentData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="subject" />
                            <PolarRadiusAxis />
                            <Radar
                                name="Current"
                                dataKey="A"
                                stroke="#8884d8"
                                fill="#8884d8"
                                fillOpacity={0.6}
                            />
                            <Radar
                                name="Previous"
                                dataKey="B"
                                stroke="#82ca9d"
                                fill="#82ca9d"
                                fillOpacity={0.6}
                            />
                            <Legend />
                        </RadarChart>
                    </ResponsiveContainer>
                )
            case "events":
                return (
                    <ResponsiveContainer width="100%" height={400}>
                        <ScatterChart>
                            <XAxis dataKey="x" name="participation" />
                            <YAxis dataKey="y" name="satisfaction" />
                            <ZAxis
                                dataKey="z"
                                range={[60, 400]}
                                name="attendance"
                            />
                            <Tooltip cursor={{ strokeDasharray: "3 3" }} />
                            <Legend />
                            <Scatter
                                name="Events Analysis"
                                data={eventData}
                                fill="#8884d8"
                            />
                        </ScatterChart>
                    </ResponsiveContainer>
                )
            default:
                return null
        }
    }

    return (
        <div className="h-[400px] w-full">
            {renderChart()}
        </div>
    )
}
