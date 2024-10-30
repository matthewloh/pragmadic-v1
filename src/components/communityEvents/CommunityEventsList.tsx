"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Calendar,
    CalendarPlus,
    ChevronRight,
    Clock,
    Users,
    MapPin,
    Tag,
    CheckCircle,
    AlertCircle,
} from "lucide-react"
import { format } from "date-fns"

import {
    type CommunityEvent,
    type CompleteCommunityEvent,
} from "@/lib/db/schema/communityEvents"
import { type Community } from "@/lib/db/schema/communities"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Modal from "@/components/shared/Modal"
import CommunityEventForm from "./CommunityEventForm"
import { useOptimisticCommunityEvents } from "@/app/(app)/community-events/useOptimisticCommunityEvents"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Event } from "@/lib/db/schema"

type TOpenModal = (event?: CommunityEvent) => void

export function CommunityEventsList({
    events,
    communityId,
    communities,
}: {
    events: CompleteCommunityEvent[]
    communityId: string
    communities: Community[]
}) {
    const { optimisticCommunityEvents, addOptimisticCommunityEvent } =
        useOptimisticCommunityEvents(events, communities)
    const [open, setOpen] = useState(false)
    const [activeEvent, setActiveEvent] = useState<CommunityEvent | null>(null)

    const openModal = (event?: CommunityEvent) => {
        setOpen(true)
        event ? setActiveEvent(event) : setActiveEvent(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div className="space-y-8">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeEvent ? "Edit Event" : "Create Event"}
            >
                <CommunityEventForm
                    communityEvent={activeEvent}
                    communities={communities}
                    communityId={communityId}
                    closeModal={closeModal}
                    addOptimistic={addOptimisticCommunityEvent}
                />
            </Modal>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Community Events
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Upcoming events in this community
                    </p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <CalendarPlus className="h-4 w-4" />
                    Add Event
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {optimisticCommunityEvents.length === 0 ? (
                    <EmptyState openModal={openModal} />
                ) : (
                    <motion.div
                        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {optimisticCommunityEvents.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                openModal={openModal}
                                communityId={communityId}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function EventCard({
    event,
    index,
    openModal,
    communityId,
}: {
    event: CommunityEvent
    index: number
    openModal: (event: CommunityEvent) => void
    communityId: string
}) {
    const optimistic = event.id === "optimistic"
    const deleting = event.id === "delete"
    const mutating = optimistic || deleting

    const cardColors = [
        "from-violet-500/20 to-purple-500/20",
        "from-emerald-500/20 to-teal-500/20",
        "from-orange-500/20 to-amber-500/20",
        "from-blue-500/20 to-cyan-500/20",
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div
                className={cn(
                    "rounded-lg bg-gradient-to-br p-0.5 transition-all hover:shadow-lg",
                    cardColors[index % cardColors.length],
                )}
            >
                <Card
                    className={cn(
                        "group relative overflow-hidden bg-card transition-all",
                        mutating ? "animate-pulse opacity-50" : "",
                        deleting ? "bg-destructive/10" : "",
                    )}
                >
                    <CardHeader className="relative pb-0">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <Avatar>
                                    <AvatarImage
                                        src={`https://avatar.vercel.sh/${event.userId}`}
                                    />
                                    <AvatarFallback>
                                        {event.userId[0]?.toUpperCase()}
                                    </AvatarFallback>
                                </Avatar>
                                <div>
                                    <CardTitle className="text-lg">
                                        {event.title}
                                    </CardTitle>
                                    <p className="text-sm text-muted-foreground">
                                        by {event.userId}
                                    </p>
                                </div>
                            </div>
                            {event.isComplete ? (
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    <CheckCircle className="h-3 w-3 text-green-500" />
                                    Completed
                                </Badge>
                            ) : (
                                <Badge
                                    variant="outline"
                                    className="flex items-center gap-1"
                                >
                                    <AlertCircle className="h-3 w-3 text-yellow-500" />
                                    Upcoming
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="mt-4 grid gap-4">
                        <div className="space-y-2">
                            <div className="flex flex-wrap items-center gap-2">
                                <Badge
                                    variant="outline"
                                    className="bg-primary/10 text-primary"
                                >
                                    <Calendar className="mr-1 h-3 w-3" />
                                    {format(
                                        new Date(event.eventTimestamp),
                                        "MMM d, yyyy",
                                    )}
                                </Badge>
                                <Badge variant="secondary">
                                    <Clock className="mr-1 h-3 w-3" />
                                    {format(
                                        new Date(event.eventTimestamp),
                                        "h:mm a",
                                    )}
                                </Badge>
                                {event.eventType && (
                                    <Badge variant="outline">
                                        <Tag className="mr-1 h-3 w-3" />
                                        {event.eventType}
                                    </Badge>
                                )}
                            </div>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {event.description}
                            </p>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                {event.location}
                            </div>
                        </div>

                        <div className="flex items-center justify-between border-t pt-4">
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openModal(event)}
                                >
                                    Edit
                                </Button>
                                {event.completedAt && (
                                    <p className="text-xs text-muted-foreground">
                                        Completed on{" "}
                                        {format(
                                            new Date(event.completedAt),
                                            "MMM d, yyyy",
                                        )}
                                    </p>
                                )}
                            </div>
                            <Button variant="ghost" size="icon" asChild>
                                <Link
                                    href={`/communities/${communityId}/community-events/${event.id}`}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </motion.div>
    )
}

function EmptyState({ openModal }: { openModal: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8 text-center"
        >
            <Calendar className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Events Scheduled</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Create your first community event to get started.
            </p>
            <Button onClick={openModal} className="mt-4" variant="outline">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Create Event
            </Button>
        </motion.div>
    )
}
