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
                    <Button
                        onClick={() => openModal()}
                        variant="outline"
                        size="sm"
                        className="gap-2 bg-background/50 shadow-sm hover:bg-accent"
                    >
                        <CalendarPlus className="h-4 w-4 text-muted-foreground" />
                        <span className="hidden sm:inline">Add Event</span>
                    </Button>
                    <Button variant="ghost" size="sm" asChild>
                        <Link href={`/hubs/${hubId}/events`}>View All</Link>
                    </Button>
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
    const optimistic = event.id === "optimistic"
    const deleting = event.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("events")
        ? pathname
        : pathname + "/events/"

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
                )}
            >
                <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                        <div className="space-y-1">
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
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                            asChild
                        >
                            <Link href={`${basePath}/${event.id}`}>
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
