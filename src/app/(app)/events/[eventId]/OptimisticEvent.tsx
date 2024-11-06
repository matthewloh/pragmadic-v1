"use client"

import { TAddOptimistic } from "@/app/(app)/events/useOptimisticEvents"
import { TAddOptimistic as TAddOptimisticMarker } from "@/app/(app)/regions/[regionId]/states/[stateId]/hubs/[hubId]/events/[eventId]/useOptimisticEventMarkers"
import { CompleteEvent, type Event } from "@/lib/db/schema/events"
import { cn } from "@/lib/utils"
import { useOptimistic, useState } from "react"
import {
    useInsertMutation,
    useUpdateMutation,
    useDeleteMutation,
    useQuery,
    useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

import EventForm from "@/components/events/EventForm"
import { EventInviteForm } from "@/components/events/EventInviteForm"
import EventMarkerForm from "@/components/map/MarkerForm"
import Modal from "@/components/shared/Modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { EventMarker, SelectUser, UsersWithInviteStatus } from "@/lib/db/schema"
import { type Hub } from "@/lib/db/schema/hubs"
import { PencilIcon } from "lucide-react"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDownIcon } from "lucide-react"

export default function OptimisticEvent({
    event,
    hubs,
    usersToHub,
    marker,
}: {
    event: CompleteEvent
    hubs: Hub[]
    usersToHub: UsersWithInviteStatus[]
    marker: EventMarker | null
}) {
    const supabase = useSupabaseBrowser()
    const { data: sessionData } = useUserRole()
    const user = sessionData?.user
    const [open, setOpen] = useState(false)
    const openModal = (_?: Event) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticEvent, setOptimisticEvent] = useOptimistic(event)
    const [optimisticMarker, setOptimisticMarker] = useOptimistic(marker)
    const router = useRouter()

    const isCreator = user?.id === event.userId
    const isHubMember = usersToHub.some(
        (userToHub) => userToHub.id === user?.id,
    )
    const { data: eventParticipants } = useQuery(
        supabase.from("users_to_events").select("*").eq("event_id", event.id),
    )
    const isEventParticipant = eventParticipants?.some(
        (participant) => participant.user_id === user?.id,
    )

    const { mutateAsync: joinEvent } = useUpsertMutation(
        supabase.from("users_to_events") as any,
        ["id"],
        "user_id",
        {
            onSuccess: () => {
                toast.success("Successfully joined event")
                router.refresh()
            },
            onError: () => {
                toast.error("Failed to join event")
            },
        },
    )

    const updateEvent: TAddOptimistic = (input) =>
        setOptimisticEvent({ ...optimisticEvent, ...input.data })

    const updateMarker: TAddOptimisticMarker = (input) =>
        setOptimisticMarker({ ...optimisticMarker, ...input.data })

    const { data: participants } = useQuery(
        supabase
            .from("users_to_events")
            .select(
                `
                *,
                users (
                    id,
                    email,
                    display_name,
                    image_url
                )
            `,
            )
            .eq("event_id", event.id),
    )

    const deleteParticipant = async () => {
        try {
            const user_id = user?.id
            if (!user_id) return
            await supabase
                .from("users_to_events")
                .delete()
                .eq("user_id", user_id)
            toast.success("Successfully left event")
            router.refresh()
        } catch (error) {
            console.error("Failed to leave event:", error)
            toast.error("Failed to leave event")
        }
    }

    const { mutateAsync: updateStatus } = useUpsertMutation(
        supabase.from("users_to_events") as any,
        ["id"],
        "user_id",
        {
            onSuccess: () => {
                toast.success("Successfully updated status")
                router.refresh()
            },
            onError: () => {
                toast.error("Failed to update status")
            },
        },
    )

    const handleStatusChange = async (newStatus: string) => {
        if (!user?.id) return
        await updateStatus({
            // @ts-expect-error GenericTable
            event_id: event.id,
            user_id: user.id,
            pending: newStatus,
            member: "member",
        })
    }

    const ParticipantStatusBadge = () => {
        const currentStatus = eventParticipants?.find(
            (p) => p.user_id === user?.id,
        )?.pending

        return (
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="outline" size="sm" className="gap-2">
                        <Badge
                            variant={
                                currentStatus === "pending"
                                    ? "secondary"
                                    : currentStatus === "accepted"
                                      ? "success"
                                      : "destructive"
                            }
                        >
                            {currentStatus}
                        </Badge>
                        <ChevronDownIcon className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuItem
                        onClick={() => handleStatusChange("accepted")}
                    >
                        Accept
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleStatusChange("pending")}
                    >
                        Pending
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => handleStatusChange("rejected")}
                    >
                        Reject
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <div className="container mx-auto p-6">
            <Modal open={open} setOpen={setOpen}>
                <EventForm
                    event={optimisticEvent}
                    hubs={hubs}
                    hubId={event.hubId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateEvent}
                />
            </Modal>

            <div className="mb-8 flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {optimisticEvent.name}
                </h1>
                <div className="flex items-center gap-2">
                    {isEventParticipant && !isCreator && (
                        <ParticipantStatusBadge />
                    )}
                    {isCreator ? (
                        <Button
                            onClick={() => setOpen(true)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <PencilIcon className="h-4 w-4" />
                            Edit Event
                        </Button>
                    ) : isHubMember ? (
                        isEventParticipant ? (
                            <Button
                                onClick={deleteParticipant}
                                variant="destructive"
                                size="sm"
                            >
                                Leave Event
                            </Button>
                        ) : (
                            <Button
                                onClick={async () =>
                                    await joinEvent({
                                        // @ts-expect-error GenericTable
                                        event_id: event.id,
                                        user_id: user?.id,
                                        pending: "pending",
                                        member: "member",
                                    })
                                }
                                variant="default"
                                size="sm"
                            >
                                Join Event
                            </Button>
                        )
                    ) : null}
                </div>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Event Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre
                            className={cn(
                                "text-wrap break-all rounded-lg bg-secondary p-4 text-sm",
                                optimisticEvent.id === "optimistic"
                                    ? "animate-pulse"
                                    : "",
                            )}
                        >
                            {JSON.stringify(optimisticEvent, null, 2)}
                        </pre>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Event Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <EventMarkerForm
                            marker={optimisticMarker}
                            event={event}
                            addOptimistic={updateMarker}
                        />
                    </CardContent>
                </Card>
            </div>

            {isCreator && (
                <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Event Participants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ScrollArea className="h-[300px] pr-4">
                                <div className="space-y-4">
                                    {participants?.map((participant) => (
                                        <div
                                            key={participant.user_id}
                                            className="flex items-center justify-between"
                                        >
                                            <div className="flex items-center gap-3">
                                                <Avatar>
                                                    <AvatarImage
                                                        src={
                                                            participant.users
                                                                ?.image_url ||
                                                            ""
                                                        }
                                                        alt={
                                                            participant.users
                                                                ?.display_name ||
                                                            ""
                                                        }
                                                    />
                                                    <AvatarFallback>
                                                        {participant.users
                                                            ?.display_name?.[0] ||
                                                            "?"}
                                                    </AvatarFallback>
                                                </Avatar>
                                                <div>
                                                    <p className="font-medium">
                                                        {
                                                            participant.users
                                                                ?.display_name
                                                        }
                                                    </p>
                                                    <p className="text-sm text-muted-foreground">
                                                        {
                                                            participant.users
                                                                ?.email
                                                        }
                                                    </p>
                                                </div>
                                            </div>
                                            <Badge
                                                variant={
                                                    participant.pending ===
                                                    "pending"
                                                        ? "secondary"
                                                        : participant.pending ===
                                                            "accepted"
                                                          ? "success"
                                                          : "destructive"
                                                }
                                            >
                                                {participant.pending}
                                            </Badge>
                                        </div>
                                    ))}
                                </div>
                            </ScrollArea>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Invite Participants</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <EventInviteForm
                                event={event}
                                hub={event.hub!}
                                usersToHub={usersToHub}
                            />
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    )
}
