"use client"

import { TAddOptimistic } from "@/app/(app)/events/useOptimisticEvents"
import { TAddOptimistic as TAddOptimisticMarker } from "@/app/(app)/regions/[regionId]/states/[stateId]/hubs/[hubId]/events/[eventId]/useOptimisticEventMarkers"
import { CompleteEvent, type Event } from "@/lib/db/schema/events"
import {
    useDeleteMutation,
    useQuery,
    useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query"
import { useRouter } from "next/navigation"
import { useOptimistic, useState } from "react"
import { toast } from "sonner"

import EventForm from "@/components/events/EventForm"
import { EventInviteForm } from "@/components/events/EventInviteForm"
import EventMarkerForm from "@/components/map/MarkerForm"
import Modal from "@/components/shared/Modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { EventMarker, UsersWithInviteStatus } from "@/lib/db/schema"
import { type Hub } from "@/lib/db/schema/hubs"
import useSupabaseBrowser from "@/utils/supabase/client"
import {
    CalendarIcon,
    CheckCircle,
    ChevronDownIcon,
    Clock,
    InfoIcon,
    MapPinIcon,
    PencilIcon,
    RefreshCcw,
    Shield,
    TagIcon,
    UserIcon,
    Users,
    XCircle,
} from "lucide-react"

type UserCreatorEvent = {
    display_name: string
    email: string
    image_url: string
}

const ParticipantStatusDisplay = ({
    status,
    role,
    participantUserId,
    showActions = false,
    onDeleteParticipant,
}: {
    status: "pending" | "accepted" | "rejected"
    role: "admin" | "member" | null
    participantUserId: string
    showActions?: boolean
    onDeleteParticipant?: (userId: string) => Promise<void>
}) => {
    const router = useRouter()
    const statusConfig = {
        pending: {
            icon: Clock,
            variant: "secondary" as const,
            label: "Pending",
        },
        accepted: {
            icon: CheckCircle,
            variant: "success" as const,
            label: "Accepted",
        },
        rejected: {
            icon: XCircle,
            variant: "destructive" as const,
            label: "Rejected",
        },
    }

    const { icon: StatusIcon, variant, label } = statusConfig[status]

    return (
        <div className="flex items-center gap-2">
            <div className="flex items-center gap-2">
                <Badge variant={variant} className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    {label}
                </Badge>
                {role && (
                    <Badge
                        variant="outline"
                        className="flex items-center gap-1"
                    >
                        <Shield className="h-3 w-3" />
                        {role === "admin" ? "Admin" : "Member"}
                    </Badge>
                )}
            </div>
            {showActions && (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                            <ChevronDownIcon className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                                onDeleteParticipant?.(participantUserId)
                                router.refresh()
                            }}
                        >
                            Remove Participant
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )}
        </div>
    )
}

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
    const { data: eventParticipants, refetch: refetchEventParticipants } =
        useQuery(
            supabase
                .from("users_to_events")
                .select("*")
                .eq("event_id", event.id),
        )
    const isEventParticipant = eventParticipants?.some(
        (participant) => participant.user_id === user?.id,
    )

    const { data: eventUser, isPending: isLoadingEventUser } =
        useQuery<UserCreatorEvent>(
            supabase
                .from("users")
                .select("display_name, email, image_url")
                .eq("id", event.userId)
                .limit(1)
                .single(),
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

    const { mutateAsync: deleteParticipantMutationQuery } = useDeleteMutation(
        supabase.from("users_to_events") as any,
        ["user_id", "event_id"],
    )

    const deleteParticipantAsOwner = async (participantUserId: string) => {
        try {
            await deleteParticipantMutationQuery({
                user_id: participantUserId,
                event_id: event.id,
            })
            toast.success("Successfully removed participant")
            router.refresh()
        } catch (error) {
            console.error("Failed to remove participant:", error)
            toast.error("Failed to remove participant")
        }
    }

    const updateEvent: TAddOptimistic = (input) =>
        setOptimisticEvent({ ...optimisticEvent, ...input.data })

    const updateMarker: TAddOptimisticMarker = (input) =>
        setOptimisticMarker({ ...optimisticMarker, ...input.data })

    const { data: participants, refetch: refetchParticipants } = useQuery(
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
            await deleteParticipantMutationQuery({
                user_id,
                event_id: event.id,
            })
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
            <Modal
                title="Edit Event"
                open={open}
                setOpen={setOpen}
                className="max-w-[1000px]"
            >
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
                    {isEventParticipant && <ParticipantStatusBadge />}
                    {isCreator && (
                        <Button
                            onClick={() => setOpen(true)}
                            variant="outline"
                            size="sm"
                            className="gap-2"
                        >
                            <PencilIcon className="h-4 w-4" />
                            Edit Event
                        </Button>
                    )}
                    {isHubMember || isCreator ? (
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
                                        member: "admin",
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
                    <CardContent className="space-y-8">
                        <div className="space-y-6">
                            {/* Event Title & Description */}
                            <div className="border-b pb-4">
                                <h3 className="text-2xl font-semibold tracking-tight">
                                    {optimisticEvent.name}
                                </h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                                    {optimisticEvent.description}
                                </p>
                            </div>

                            {/* Date & Time */}
                            <div className="grid gap-6 rounded-lg border p-4 md:grid-cols-2">
                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>Start Date</span>
                                    </div>
                                    <p className="text-lg">
                                        {new Date(
                                            optimisticEvent.startDate,
                                        ).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <div className="mb-2 flex items-center gap-2 text-sm font-medium">
                                        <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>End Date</span>
                                    </div>
                                    <p className="text-lg">
                                        {new Date(
                                            optimisticEvent.endDate,
                                        ).toLocaleDateString("en-GB", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                </div>
                            </div>

                            {/* Location */}
                            <div>
                                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                    <MapPinIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>Location</span>
                                </div>
                                <div className="rounded-lg border bg-muted/50 p-4">
                                    <p className="text-lg font-medium">
                                        {optimisticEvent.hub?.name}
                                    </p>
                                    <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                                        {optimisticEvent.hub?.description}
                                    </p>
                                </div>
                            </div>

                            {/* Event Type */}
                            <div>
                                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                    <TagIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>Event Type</span>
                                </div>
                                <Badge variant="secondary" className="text-sm">
                                    {optimisticEvent.typeOfEvent}
                                </Badge>
                            </div>

                            {/* Organizer */}
                            <div>
                                <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                    <UserIcon className="h-4 w-4 text-muted-foreground" />
                                    <span>Organized by</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <Avatar className="h-10 w-10">
                                        <AvatarImage
                                            src={eventUser?.image_url}
                                        />
                                        <AvatarFallback>
                                            {eventUser?.display_name?.[0] ||
                                                "?"}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="font-medium">
                                            {eventUser?.display_name}
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            {eventUser?.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Additional Information */}
                            {optimisticEvent.info && (
                                <div>
                                    <div className="mb-3 flex items-center gap-2 text-sm font-medium">
                                        <InfoIcon className="h-4 w-4 text-muted-foreground" />
                                        <span>Additional Information</span>
                                    </div>
                                    <div className="rounded-lg border bg-muted/50 p-4">
                                        <p className="text-sm leading-relaxed text-muted-foreground">
                                            {optimisticEvent.info}
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
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

            <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
                {isEventParticipant && !isCreator && (
                    <div className="col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />

                                        <span>Event Participants</span>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={async () => {
                                                toast.info(
                                                    "Refetching participants...",
                                                )
                                                await refetchParticipants()
                                            }}
                                        >
                                            <RefreshCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
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
                                                                participant
                                                                    .users
                                                                    ?.image_url ||
                                                                ""
                                                            }
                                                        />
                                                    </Avatar>
                                                    <div>
                                                        <p className="font-medium">
                                                            {
                                                                participant
                                                                    .users
                                                                    ?.display_name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                participant
                                                                    .users
                                                                    ?.email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                    </div>
                )}
                {isCreator && (
                    <div className="col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>
                                    <div className="flex items-center gap-2">
                                        <Users className="h-4 w-4" />

                                        <span>Event Participants</span>

                                        <Button
                                            variant="outline"
                                            size="icon"
                                            onClick={async () => {
                                                toast.info(
                                                    "Refetching participants...",
                                                )
                                                await refetchParticipants()
                                            }}
                                        >
                                            <RefreshCcw className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="col-span-2">
                                <ScrollArea className="h-full min-h-[300px] space-y-4 pr-4">
                                    <div className="col-span-2 space-y-4">
                                        {participants?.map((participant) => (
                                            <div
                                                key={participant.user_id}
                                                className="flex items-center justify-between"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Avatar>
                                                        <AvatarImage
                                                            src={
                                                                participant
                                                                    .users
                                                                    ?.image_url ||
                                                                ""
                                                            }
                                                            alt={
                                                                participant
                                                                    .users
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
                                                                participant
                                                                    .users
                                                                    ?.display_name
                                                            }
                                                        </p>
                                                        <p className="text-sm text-muted-foreground">
                                                            {
                                                                participant
                                                                    .users
                                                                    ?.email
                                                            }
                                                        </p>
                                                    </div>
                                                </div>
                                                <ParticipantStatusDisplay
                                                    status={
                                                        participant.pending ||
                                                        "pending"
                                                    }
                                                    role={participant.member}
                                                    participantUserId={
                                                        participant.user_id
                                                    }
                                                    showActions={
                                                        isCreator ||
                                                        participant.user_id ===
                                                            user?.id
                                                    }
                                                    onDeleteParticipant={
                                                        participant.user_id ===
                                                        user?.id
                                                            ? deleteParticipant
                                                            : deleteParticipantAsOwner
                                                    }
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </ScrollArea>
                            </CardContent>
                        </Card>
                        <Card className="col-span-2">
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
        </div>
    )
}
