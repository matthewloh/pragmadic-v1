"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { useUser } from "@/features/auth/hooks/use-current-user"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { format } from "date-fns"
import { Calendar, Clock, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type HubData = {
    id: string
    name: string
    description: string
    type_of_hub: string
    public: boolean
    info: string
    user_id: string
    state_id: string
    created_at: string
    updated_at: string
    users_to_hubs: Array<{
        hub_id: string
        user_id: string
        created_at: string
        updated_at: string
        invite_status: string
        invite_role_type: string
        users: {
            id: string
            email: string
            display_name: string
            image_url: string | null
        }
    }>
    hub_events: Array<{
        id: string
        info: string
        name: string
        hub_id: string
        user_id: string
        end_date: string
        created_at: string
        start_date: string
        updated_at: string
        description: string
        is_complete: boolean
        type_of_event: string
    }>
    states: {
        id: string
        name: string
        region_id: string
        capital_city: string
        description: string
    }
}

type OwnerHubs = {
    id: string
    name: string
    state_id: string
    states: {
        name: string
    }
}

function DashboardOwnerSkeleton() {
    return <div className="flex-1 space-y-4 p-4 pt-6 md:p-8"></div>
}

export default function DashboardOwner() {
    const router = useRouter()
    const supabase = useSupabaseBrowser()
    const { data: user, isPending: isUserPending } = useUser()
    const [selectedHubId, setSelectedHubId] = useState<string>("")

    const { data: ownerHubs, isPending: isOwnerHubsPending } = useQuery<
        OwnerHubs[]
    >(
        // @ts-expect-error - TODO: fix this
        supabase
            .from("hubs")
            .select(
                `
                id,
                name,
                state_id,
                states (
                    name
                )
            `,
            )
            .eq("user_id", user?.id || ""),
        {
            enabled: !!user?.id,
        },
    )

    useEffect(() => {
        if (ownerHubs && ownerHubs.length > 0 && !selectedHubId) {
            setSelectedHubId(ownerHubs[0].id)
        }
    }, [ownerHubs, selectedHubId])

    const { data: ownerHub, isPending: isHubPending } = useQuery<HubData>(
        supabase
            .from("hubs")
            .select(
                `
                *,
                users_to_hubs (
                    *,
                    users (
                        id,
                        email,
                        display_name,
                        image_url
                    )
                ),
                hub_events (*),
                states (
                    id,
                    name,
                    region_id,
                    capital_city,
                    description
                )
            `,
            )
            .eq("id", selectedHubId)
            .single(),
        {
            enabled: !!selectedHubId,
        },
    )

    if (
        isUserPending ||
        isOwnerHubsPending ||
        (!!selectedHubId && isHubPending)
    ) {
        return <DashboardOwnerSkeleton />
    }

    return (
        <div className="flex-1 space-y-6 p-4 pt-6 md:p-8">
            {/* Header with Hub Selector */}
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-1">
                    <div className="flex items-center space-x-4">
                        <h2 className="text-3xl font-bold tracking-tight">
                            Hub Dashboard
                        </h2>
                        {ownerHubs && ownerHubs.length > 0 && (
                            <Select
                                value={selectedHubId}
                                onValueChange={setSelectedHubId}
                            >
                                <SelectTrigger className="w-[280px]">
                                    <SelectValue placeholder="Select a hub to view" />
                                </SelectTrigger>
                                <SelectContent>
                                    {ownerHubs.map((hub) => (
                                        <SelectItem key={hub.id} value={hub.id}>
                                            <span className="font-medium">
                                                {hub.name}
                                            </span>
                                            <span className="ml-2 text-muted-foreground">
                                                in {hub.states?.name}
                                            </span>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        )}
                    </div>
                    {ownerHub && (
                        <p className="text-muted-foreground">
                            Managing {ownerHub.name} in {ownerHub.states?.name}
                        </p>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <Button variant="outline" asChild>
                        <Link href="/hubs">Create New Hub</Link>
                    </Button>
                    {ownerHub && (
                        <Button variant="outline" asChild>
                            <Link href={`/hubs/${ownerHub.id}`}>
                                View {ownerHub.name}
                            </Link>
                        </Button>
                    )}
                </div>
            </div>

            {/* Show message if no hubs */}
            {!ownerHubs || ownerHubs.length === 0 ? (
                <Card>
                    <CardHeader>
                        <CardTitle>No Hubs Found</CardTitle>
                        <CardDescription>
                            You haven&apos;t created any hubs yet. Create your
                            first hub to get started.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild>
                            <Link href="/hubs">Create Your First Hub</Link>
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                // Rest of the dashboard content
                <>
                    {/* Stats Grid */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Total Members
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {ownerHub?.users_to_hubs?.length || 0}
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="col-span-2">
                            <CardHeader>
                                <CardTitle className="text-sm font-medium">
                                    Total Events
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="text-2xl font-bold">
                                    {ownerHub?.hub_events?.length || 0}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Members Grid */}
                    <div className="grid gap-6 md:grid-cols-2">
                        {/* Recent Members */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Members</CardTitle>
                                <CardDescription>
                                    Latest members to join your hub
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {ownerHub?.users_to_hubs
                                        ?.slice(0, 5)
                                        .map((member) => (
                                            <div
                                                key={member.user_id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center space-x-4">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={
                                                                member.users
                                                                    ?.image_url ||
                                                                ""
                                                            }
                                                        />
                                                        <AvatarFallback>
                                                            {member.users?.display_name
                                                                ?.slice(0, 2)
                                                                .toUpperCase() ||
                                                                member.users?.email
                                                                    ?.slice(
                                                                        0,
                                                                        2,
                                                                    )
                                                                    .toUpperCase()}
                                                        </AvatarFallback>
                                                    </Avatar>
                                                    <div>
                                                        <p className="text-sm font-medium">
                                                            {member.users
                                                                ?.display_name ||
                                                                member.users
                                                                    ?.email}
                                                        </p>
                                                        <p className="text-xs text-muted-foreground">
                                                            Joined{" "}
                                                            {format(
                                                                new Date(
                                                                    member.created_at,
                                                                ),
                                                                "MMM d, yyyy",
                                                            )}
                                                        </p>
                                                    </div>
                                                </div>
                                                <Badge>
                                                    {member.invite_role_type}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>

                        {/* Recent Events */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Recent Events</CardTitle>
                                <CardDescription>
                                    Latest events in your hub
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {ownerHub?.hub_events
                                        ?.slice(0, 5)
                                        .map((event) => (
                                            <div
                                                key={event.id}
                                                className="flex items-center space-x-4 rounded-lg border p-4"
                                            >
                                                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                                                    <Calendar className="h-6 w-6 text-primary" />
                                                </div>
                                                <div className="flex-1 space-y-1">
                                                    <p className="text-sm font-medium">
                                                        {event.name}
                                                    </p>
                                                    <div className="flex items-center text-xs text-muted-foreground">
                                                        <Clock className="mr-1 h-3 w-3" />
                                                        {format(
                                                            new Date(
                                                                event.start_date,
                                                            ),
                                                            "MMM d, h:mm a",
                                                        )}
                                                    </div>
                                                </div>
                                                <Badge>
                                                    {event.type_of_event}
                                                </Badge>
                                            </div>
                                        ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Location Info */}
                    <Card>
                        <CardHeader>
                            <div className="flex items-center space-x-2">
                                <MapPin className="h-4 w-4 text-primary" />
                                <CardTitle>Hub Location</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex items-center justify-between">
                                <div className="space-y-2">
                                    <div>
                                        <p className="text-2xl font-bold">
                                            {ownerHub?.states?.name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Capital:{" "}
                                            {ownerHub?.states?.capital_city}
                                        </p>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                        {ownerHub?.states?.description}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </>
            )}
        </div>
    )
}
