"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, Calendar, Star, TrendingUp } from "lucide-react"
import { type HubAnalytics } from "../types"
import {
    calculateGrowthRate,
    calculateMonthlyChange,
    calculateParticipationRate,
} from "@/features/analytics/utils/calculations"

interface AnalyticsStatsProps {
    analytics: HubAnalytics | null | undefined
}

export function AnalyticsStats({ analytics }: AnalyticsStatsProps) {
    if (!analytics?.users_to_hubs || !analytics?.hub_events) {
        return (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: 4 }).map((_, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Loading...
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">-</div>
                            <p className="text-xs text-muted-foreground">
                                Calculating...
                            </p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        )
    }

    const stats = {
        members: {
            total: analytics.users_to_hubs.filter(
                (u) => u.invite_status === "accepted",
            ).length,
            change: calculateMonthlyChange(analytics.users_to_hubs),
        },
        events: {
            total: analytics.hub_events.length,
            change: calculateMonthlyChange(analytics.hub_events),
        },
        participation: {
            rate: calculateParticipationRate(analytics.hub_events),
            change: calculateMonthlyChange(analytics.hub_events),
        },
        growth: {
            rate: calculateGrowthRate(analytics.users_to_hubs),
            change: calculateMonthlyChange(analytics.users_to_hubs),
        },
    }

    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Members
                    </CardTitle>
                    <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.members.total}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.members.change > 0 ? "+" : ""}
                        {stats.members.change}% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Total Events
                    </CardTitle>
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.events.total}
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.events.change > 0 ? "+" : ""}
                        {stats.events.change}% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Participation Rate
                    </CardTitle>
                    <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.participation.rate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.participation.change > 0 ? "+" : ""}
                        {stats.participation.change}% from last month
                    </p>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        Growth Rate
                    </CardTitle>
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">
                        {stats.growth.rate}%
                    </div>
                    <p className="text-xs text-muted-foreground">
                        {stats.growth.change > 0 ? "+" : ""}
                        {stats.growth.change}% from last month
                    </p>
                </CardContent>
            </Card>
        </div>
    )
}
