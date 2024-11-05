import { AnalyticsDashboard } from "@/features/analytics/components/AnalyticsDashboard"
import React from "react"
import { Suspense } from "react"
import { AnalyticsLoading } from "@/features/analytics/components/AnalyticsLoading"

export default async function AnalyticsPage() {
    return (
        <div className="flex h-full flex-1 flex-col">
            <Suspense fallback={<AnalyticsLoading />}>
                <AnalyticsDashboard />
            </Suspense>
        </div>
    )
}
