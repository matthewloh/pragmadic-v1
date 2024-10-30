import { AnalyticsDashboard } from "@/features/analytics/components/AnalyticsDashboard"
import React from "react"
import { Suspense } from "react"
import { AnalyticsLoading } from "@/features/analytics/components/AnalyticsLoading"

export default function AnalyticsPage() {
    return (
        <div className="flex h-full flex-grow flex-col gap-4 p-4">
            <h1 className="text-2xl font-bold">Analytics Dashboard</h1>
            <Suspense fallback={<AnalyticsLoading />}>
                <AnalyticsDashboard />
            </Suspense>
        </div>
    )
}
