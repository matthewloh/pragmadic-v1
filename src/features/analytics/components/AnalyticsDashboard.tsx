"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { EventTypesChart } from "@/features/analytics/charts/event-types-chart"
import { EventsOverviewChart } from "@/features/analytics/charts/events-overview-chart"
import { EventsParticipationChart } from "@/features/analytics/charts/events-participation-chart"
import { type Hub } from "@/lib/db/schema/hubs"
import useSupabaseBrowser from "@/utils/supabase/client"
import {
    HubEventRow,
    HubRow,
    UsersToEventRow,
    UsersToHubRow,
} from "@/utils/supabase/types"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { useEffect, useState } from "react"
import { MemberDistributionChart } from "../charts/member-distribution-chart"
import { OccupationsChart } from "../charts/occupations-chart"
import { HubAnalytics } from "../types"
import { AnalyticsChat } from "./AnalyticsChat"
import { AnalyticsLoading } from "./AnalyticsLoading"
import { AnalyticsStats } from "./AnalyticsStats"
import { EngagementMetrics } from "./engagement-metrics"
import { HubSelector } from "./HubSelector"

type UsersToHubsWithUserInfoAndProfile = UsersToHubRow & {
    users: {
        display_name: string | null
        email: string
        image_url: string | null
        profile: {
            bio: string
            occupation: string | null
            location: string | null
        } | null
    }
}

type UsersToEventsWithUserInfo = UsersToEventRow & {
    users: {
        display_name: string | null
        email: string
        image_url: string | null
    }
}

export function AnalyticsDashboard({ initialHubs }: { initialHubs: Hub[] }) {
    const supabase = useSupabaseBrowser()
    const [selectedHubId, setSelectedHubId] = useState<string>("")

    // Set initial hub
    useEffect(() => {
        if (initialHubs.length > 0 && !selectedHubId) {
            setSelectedHubId(initialHubs[0].id)
        }
    }, [initialHubs, selectedHubId])

    // Basic hub info
    const { data: hubInfo } = useQuery<HubRow>(
        supabase
            .from("hubs")
            .select(
                `
                id,
                name,
                description,
                type_of_hub,
                public,
                info,
                created_at,
                updated_at
            `,
            )
            .eq("id", selectedHubId)
            .single(),
        {
            enabled: !!selectedHubId,
        },
    )

    // Hub members
    const { data: hubMembers } = useQuery<UsersToHubsWithUserInfoAndProfile[]>(
        // @ts-expect-error TODO: fix this
        supabase
            .from("users_to_hubs")
            .select(
                `
                user_id,
                hub_id,
                invite_status,
                invite_role_type,
                created_at,
                updated_at,
                users (
                    display_name,
                    email,
                    image_url,
                    profile (
                        bio,
                        occupation,
                        location
                    )
                )
            `,
            )
            .eq("hub_id", selectedHubId),
        {
            enabled: !!selectedHubId,
        },
    )

    // Hub events
    const { data: hubEvents } = useQuery<HubEventRow>(
        supabase
            .from("hub_events")
            .select(
                `
                id,
                name,
                description,
                type_of_event,
                start_date,
                end_date,
                is_complete,
                info,
                created_at,
                updated_at,
                hub_id,
                user_id
            `,
            )
            .eq("hub_id", selectedHubId),
        {
            enabled: !!selectedHubId,
        },
    )

    // Event participants
    const { data: eventParticipants } = useQuery<UsersToEventsWithUserInfo[]>(
        // @ts-expect-error TODO: fix this
        supabase
            .from("users_to_events")
            .select(
                `
                user_id,
                event_id,
                pending,
                member,
                created_at,
                updated_at,
                users (
                    display_name,
                    email,
                    image_url
                )
            `,
            )
            .in("event_id", hubEvents?.map((event) => event.id) ?? []),
        {
            enabled: !!hubEvents?.length,
        },
    )

    const isLoading =
        !hubInfo || !hubMembers || !hubEvents || !eventParticipants

    if (!selectedHubId || isLoading) {
        return <AnalyticsLoading />
    }

    // Combine data for components that need it
    const analyticsData: HubAnalytics = {
        ...hubInfo,
        hub_events:
            hubEvents.map((event) => ({
                ...event,
                users_to_events:
                    eventParticipants
                        ?.filter((p) => p.event_id === event.id)
                        .map((p) => ({
                            ...p,
                            pending: p.pending === "accepted",
                            member: p.member === "member",
                            users: p.users || {
                                display_name: null,
                                email: "",
                                image_url: null,
                            },
                        })) || [],
            })) || [],
        users_to_hubs:
            hubMembers?.map((member) => ({
                ...member,
                invite_status: member.invite_status || "pending",
                invite_role_type: member.invite_role_type || "member",
            })) || [],
    }

    return (
        <ResizablePanelGroup
            direction="horizontal"
            className="h-full rounded-lg"
        >
            <ResizablePanel defaultSize={70} maxSize={70} minSize={50}>
                <ScrollArea className="h-full">
                    <div className="space-y-6 p-6">
                        <HubSelector
                            hubs={initialHubs}
                            selectedHubId={selectedHubId}
                            onHubChange={setSelectedHubId}
                        />

                        <AnalyticsStats analytics={analyticsData} />

                        <Card>
                            <CardHeader>
                                <CardTitle>Member Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="distribution">
                                    <TabsList>
                                        <TabsTrigger value="distribution">
                                            Distribution
                                        </TabsTrigger>
                                        <TabsTrigger value="occupations">
                                            Occupations
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent
                                        value="distribution"
                                        className="h-full w-full"
                                    >
                                        <div className="space-y-4">
                                            <div className="text-sm text-muted-foreground">
                                                Breakdown of member roles in the
                                                hub
                                            </div>
                                            <MemberDistributionChart
                                                data={
                                                    analyticsData.users_to_hubs
                                                }
                                            />
                                        </div>
                                    </TabsContent>
                                    <TabsContent
                                        value="occupations"
                                        className="h-full w-full"
                                    >
                                        <div className="space-y-4">
                                            <div className="text-sm text-muted-foreground">
                                                Distribution of member
                                                occupations
                                            </div>
                                            <OccupationsChart
                                                data={
                                                    analyticsData.users_to_hubs
                                                }
                                            />
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Event Analytics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Tabs defaultValue="overview">
                                    <TabsList>
                                        <TabsTrigger value="overview">
                                            Overview
                                        </TabsTrigger>
                                        <TabsTrigger value="participation">
                                            Participation
                                        </TabsTrigger>
                                        <TabsTrigger value="types">
                                            Event Types
                                        </TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="overview">
                                        <EventsOverviewChart
                                            data={analyticsData.hub_events}
                                        />
                                    </TabsContent>
                                    <TabsContent value="participation">
                                        <EventsParticipationChart
                                            data={analyticsData.hub_events}
                                        />
                                    </TabsContent>
                                    <TabsContent value="types">
                                        <EventTypesChart
                                            data={analyticsData.hub_events}
                                        />
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Engagement Metrics</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <EngagementMetrics analytics={analyticsData} />
                            </CardContent>
                        </Card>
                    </div>
                </ScrollArea>
            </ResizablePanel>

            <ResizableHandle />

            <ResizablePanel defaultSize={30} maxSize={50} minSize={30}>
                <AnalyticsChat />
            </ResizablePanel>
        </ResizablePanelGroup>
    )
}
