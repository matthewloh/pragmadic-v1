"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import {
    PlusIcon,
    Calendar,
    Clock,
    MapPin,
    ChevronRight,
    CalendarPlus,
    Users,
    Crown,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { CompleteEvent, type Event } from "@/lib/db/schema/events"
import Modal from "@/components/shared/Modal"
import { type Hub, type HubId } from "@/lib/db/schema/hubs"
import { useOptimisticEvents } from "@/app/(app)/events/useOptimisticEvents"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import EventForm from "./EventForm"
import { format } from "date-fns"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import { HubRow, UsersToHubRow } from "@/utils/supabase/types"

type TOpenModal = (event?: Event) => void

export default function EventList({
    events,
    hubs,
    hubId,
}: {
    events: CompleteEvent[]
    hubs: Hub[]
    hubId?: HubId
}) {
    const supabase = useSupabaseBrowser()
    const { data: user } = useCurrentUser()
    const { data: usersToHub, isPending: isLoadingUsersToHub } = useQuery<
        UsersToHubRow[]
    >(
        supabase
            .from("users_to_hubs")
            .select("*")
            .eq("hub_id", hubId ?? ""),
    )

    const isMember = usersToHub?.some(
        (userToHub) =>
            userToHub.user_id === user?.id &&
            userToHub.invite_status === "accepted",
    )

    const isAdminInHub = usersToHub?.some(
        (userToHub) =>
            userToHub.user_id === user?.id &&
            userToHub.invite_role_type === "admin",
    )

    const isOwner = user?.id === hubs.find((hub) => hub.id === hubId)?.userId
    const canEdit = isAdminInHub || isOwner
    const canView = isAdminInHub || isOwner || isMember
    const { optimisticEvents, addOptimisticEvent } = useOptimisticEvents(
        events,
        hubs,
    )
    const [open, setOpen] = useState(false)
    const [activeEvent, setActiveEvent] = useState<Event | null>(null)
    const openModal = (event?: Event) => {
        setOpen(true)
        event ? setActiveEvent(event) : setActiveEvent(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div className="relative space-y-4">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeEvent ? "Edit Event" : "Create Event"}
            >
                <EventForm
                    event={activeEvent}
                    addOptimistic={addOptimisticEvent}
                    openModal={openModal}
                    closeModal={closeModal}
                    hubs={hubs}
                    hubId={hubId}
                />
            </Modal>

            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Upcoming Events</h2>
                <div className="flex items-center gap-2">
                    {canEdit && (
                        <Button
                            onClick={() => openModal()}
                            variant="outline"
                            size="sm"
                            className="gap-2 bg-background/50 shadow-sm hover:bg-accent"
                        >
                            <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                            <span className="hidden sm:inline">Add Event</span>
                        </Button>
                    )}
                    {canView && (
                        <Button variant="ghost" size="sm" asChild>
                            <Link href={`/hubs/${hubId}/events`}>View All</Link>
                        </Button>
                    )}
                </div>
            </div>

            <AnimatePresence mode="sync">
                {optimisticEvents.length === 0 ? (
                    <EmptyState openModal={openModal} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="space-y-3"
                    >
                        {optimisticEvents.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                openModal={openModal}
                                index={index}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

const EventCard = ({
    event,
    openModal,
    index,
}: {
    event: Event
    openModal: TOpenModal
    index: number
}) => {
    const supabase = useSupabaseBrowser()
    const { data: user } = useCurrentUser()
    const { data: usersToEvent, isPending: isLoadingUsersToEvent } = useQuery(
        supabase.from("users_to_events").select("*").eq("event_id", event.id),
    )
    const { data: hub } = useQuery<HubRow>(
        supabase.from("hubs").select("*").eq("id", event.hubId).single(),
    )
    const isParticipant = usersToEvent?.some(
        (userToEvent) => userToEvent.user_id === user?.id,
    )

    const isCreator = user?.id === event.userId
    const optimistic = event.id === "optimistic"
    const deleting = event.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("events")
        ? pathname
        : pathname + "/events/"

    const getParticipantStatus = () => {
        const participant = usersToEvent?.find(
            (userToEvent) => userToEvent.user_id === user?.id,
        )
        return participant?.pending
    }

    const participantStatus = getParticipantStatus()
    const statusMessages = {
        accepted: "You've joined this event",
        pending: "Your request is pending",
        rejected: "You've declined this event",
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card
                className={cn(
                    "group relative overflow-hidden transition-all hover:shadow-md",
                    mutating ? "animate-pulse opacity-50" : "",
                    deleting ? "bg-destructive/10" : "bg-card",
                    participantStatus === "accepted" &&
                        "border-l-4 border-l-green-500",
                )}
            >
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
                            <div className="mb-2 flex items-center gap-2">
                                {isCreator && (
                                    <Badge
                                        variant="default"
                                        className="bg-primary/10 text-primary"
                                    >
                                        <Crown className="mr-1 h-3 w-3" />
                                        Your Event
                                    </Badge>
                                )}
                                {participantStatus && (
                                    <Badge
                                        variant={
                                            participantStatus === "pending"
                                                ? "secondary"
                                                : participantStatus ===
                                                    "accepted"
                                                  ? "success"
                                                  : "destructive"
                                        }
                                        className="inline-flex items-center gap-1"
                                    >
                                        <Users className="h-3 w-3" />
                                        {
                                            statusMessages[
                                                participantStatus as keyof typeof statusMessages
                                            ]
                                        }
                                    </Badge>
                                )}
                            </div>
                            <div className="flex items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="bg-primary/10 text-primary"
                                >
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {format(
                                        new Date(event.startDate),
                                        "MMM d, yyyy",
                                    )}
                                </Badge>
                                <Badge variant="secondary">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {format(
                                        new Date(event.startDate),
                                        "h:mm a",
                                    )}
                                </Badge>
                            </div>
                            <h3 className="text-lg font-semibold">
                                {event.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {event.description ||
                                    "No description available"}
                            </p>
                            <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                                {usersToEvent && (
                                    <div className="flex items-center gap-1 border-l border-border pl-2">
                                        <Users className="h-4 w-4" />
                                        <span>
                                            {
                                                usersToEvent.filter(
                                                    (userToEvent) =>
                                                        userToEvent.pending ===
                                                        "accepted",
                                                ).length
                                            }{" "}
                                            accepted
                                        </span>
                                        <span className="mx-2">|</span>
                                        <span>
                                            {
                                                usersToEvent.filter(
                                                    (userToEvent) =>
                                                        userToEvent.pending ===
                                                        "pending",
                                                ).length
                                            }{" "}
                                            pending
                                        </span>
                                        <span className="mx-2">|</span>
                                        <span>
                                            {
                                                usersToEvent.filter(
                                                    (userToEvent) =>
                                                        userToEvent.pending ===
                                                        "rejected",
                                                ).length
                                            }{" "}
                                            rejected
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            asChild
                        >
                            <Link href={`${basePath}${event.id}`}>
                                <ChevronRight className="h-4 w-4" />
                            </Link>
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8 text-center"
        >
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
                No events scheduled
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first event.
            </p>
            <Button
                onClick={() => openModal()}
                className="mt-4"
                variant="outline"
            >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Event
            </Button>
        </motion.div>
    )
}
