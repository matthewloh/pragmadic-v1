"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Calendar, CalendarPlus, ChevronRight } from "lucide-react"
import { format } from "date-fns"
import { CompleteEvent, Event } from "@/lib/db/schema/events"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Modal from "@/components/shared/Modal"
import EventForm from "./EventForm"
import { useOptimisticEvents } from "@/app/(app)/events/useOptimisticEvents"
import Link from "next/link"
import { cn } from "@/lib/utils"

type TOpenModal = (event?: Event) => void

export function HubEventsList({
    events,
    hubId,
}: {
    events: Event[]
    hubId: string
}) {
    const { optimisticEvents, addOptimisticEvent } = useOptimisticEvents(
        events,
        [],
    )
    const [open, setOpen] = useState(false)
    const [activeEvent, setActiveEvent] = useState<Event | null>(null)

    const openModal: TOpenModal = (event?: Event) => {
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
                <EventForm
                    event={activeEvent ?? null}
                    hubId={hubId}
                    hubs={[]}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={addOptimisticEvent}
                />
            </Modal>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Upcoming Events
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Manage and view all events for this hub
                    </p>
                </div>
                <Button
                    onClick={() => openModal()}
                    className="gap-2"
                    variant="outline"
                >
                    <CalendarPlus className="h-4 w-4" />
                    Add Event
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {optimisticEvents.length === 0 ? (
                    <EmptyState openModal={openModal} />
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="grid gap-4 md:grid-cols-2 lg:grid-cols-3"
                    >
                        {optimisticEvents.map((event, index) => (
                            <EventCard
                                key={event.id}
                                event={event}
                                index={index}
                                openModal={openModal}
                                hubId={hubId}
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
    hubId,
}: {
    event: Event
    index: number
    openModal: (event: Event) => void
    hubId: string
}) {
    const optimistic = event.id === "optimistic"
    const deleting = event.id === "delete"
    const mutating = optimistic || deleting

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
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
                <CardContent className="p-6">
                    <div className="space-y-4">
                        <div className="space-y-2">
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
                                {event.isComplete && (
                                    <Badge variant="secondary">Completed</Badge>
                                )}
                            </div>
                            <h3 className="text-xl font-semibold">
                                {event.name}
                            </h3>
                            <p className="line-clamp-2 text-sm text-muted-foreground">
                                {event.description}
                            </p>
                        </div>

                        <div className="flex items-center justify-between">
                            <Badge variant="outline">{event.typeOfEvent}</Badge>
                            <div className="flex items-center gap-2">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openModal(event)}
                                >
                                    Edit
                                </Button>
                                <Button variant="ghost" size="icon" asChild>
                                    <Link
                                        href={`/hubs/${hubId}/events/${event.id}`}
                                    >
                                        <ChevronRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
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
            <h3 className="mt-4 text-lg font-semibold text-muted-foreground">
                No events scheduled
            </h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating your first event.
            </p>
            <Button onClick={openModal} className="mt-4" variant="outline">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Create Event
            </Button>
        </motion.div>
    )
}
