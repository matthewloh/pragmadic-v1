import { Card, CardContent } from "@/components/ui/card"
import { HubAnalytics } from "../types"
import {
    calculateParticipationRate,
    calculateGrowthRate,
} from "@/features/analytics/utils/calculations"

type EngagementMetricsProps = {
    analytics?: HubAnalytics
}

export function EngagementMetrics({ analytics }: EngagementMetricsProps) {
    if (!analytics) return null

    const metrics = {
        totalMembers: analytics.users_to_hubs.filter(
            (u) => u.invite_status === "accepted",
        ).length,
        activeEvents: analytics.hub_events.filter((e) => !e.is_complete).length,
        participationRate: calculateParticipationRate(analytics.hub_events),
        memberGrowth: calculateGrowthRate(analytics.users_to_hubs),
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
                title="Total Members"
                value={metrics.totalMembers}
                description="Active members in the hub"
            />
            <MetricCard
                title="Active Events"
                value={metrics.activeEvents}
                description="Currently running events"
            />
            <MetricCard
                title="Participation Rate"
                value={`${metrics.participationRate}%`}
                description="Average event participation"
            />
            <MetricCard
                title="Member Growth"
                value={`${metrics.memberGrowth}%`}
                description="Last 30 days"
            />
        </div>
    )
}

function MetricCard({
    title,
    value,
    description,
}: {
    title: string
    value: string | number
    description: string
}) {
    return (
        <Card>
            <CardContent className="p-4">
                <p className="text-sm font-medium text-muted-foreground">
                    {title}
                </p>
                <p className="text-2xl font-bold">{value}</p>
                <p className="text-xs text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    )
}
