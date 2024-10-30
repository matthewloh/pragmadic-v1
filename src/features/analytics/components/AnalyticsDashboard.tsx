"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { AnalyticsToolbar } from "./AnalyticsToolbar"
import { AnalyticsCharts } from "./AnalyticsCharts"
import { AnalyticsChat } from "./AnalyticsChat"

export function AnalyticsDashboard() {
    const [selectedView, setSelectedView] = useState<
        "occupations" | "sentiment" | "events"
    >("occupations")

    return (
        <div className="grid h-full grid-cols-1 gap-4 lg:grid-cols-3">
            <div className="space-y-4 lg:col-span-2">
                <AnalyticsToolbar
                    selectedView={selectedView}
                    onViewChange={setSelectedView}
                />
                <Card className="p-4">
                    <AnalyticsCharts view={selectedView} />
                </Card>
            </div>

            <div className="lg:col-span-1">
                <Card className="h-full">
                    <AnalyticsChat />
                </Card>
            </div>
        </div>
    )
}
