import { AnalyticsDashboard } from "@/features/analytics/components/AnalyticsDashboard"
import { AnalyticsLoading } from "@/features/analytics/components/AnalyticsLoading"
import { getHubsOfUser } from "@/lib/api/hubs/queries"
import { createClient } from "@/utils/supabase/server"
import { Suspense } from "react"

export default async function AnalyticsPage() {
    const supabase = createClient()
    const { hubs } = await getHubsOfUser()

    return (
        <div className="flex h-full flex-1 flex-col">
            <Suspense fallback={<AnalyticsLoading />}>
                <AnalyticsDashboard initialHubs={hubs} />
            </Suspense>
        </div>
    )
}
