"use client"

import { TAddOptimistic } from "@/app/(app)/events/useOptimisticEvents"
import { TAddOptimistic as TAddOptimisticMarker } from "@/app/(app)/regions/[regionId]/states/[stateId]/hubs/[hubId]/events/[eventId]/useOptimisticEventMarkers"
import { CompleteEvent, type Event } from "@/lib/db/schema/events"
import { cn } from "@/lib/utils"
import { useOptimistic, useState } from "react"

import EventForm from "@/components/events/EventForm"
import { EventInviteForm } from "@/components/events/EventInviteForm"
import MarkerForm from "@/components/map/MarkerForm"
import Modal from "@/components/shared/Modal"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EventMarker, SelectUser } from "@/lib/db/schema"
import { type Hub } from "@/lib/db/schema/hubs"
import { PencilIcon } from "lucide-react"

export default function OptimisticEvent({
    event,
    hubs,
    hubUsers,
    marker,
}: {
    event: CompleteEvent
    hubs: Hub[]
    hubUsers: SelectUser[]
    marker: EventMarker | null
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Event) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticEvent, setOptimisticEvent] = useOptimistic(event)
    const [optimisticMarker, setOptimisticMarker] = useOptimistic(marker)

    const updateEvent: TAddOptimistic = (input) =>
        setOptimisticEvent({ ...optimisticEvent, ...input.data })

    const updateMarker: TAddOptimisticMarker = (input) =>
        setOptimisticMarker({ ...optimisticMarker, ...input.data })

    return (
        <div className="w-full space-y-4 p-6">
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

            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">
                    {optimisticEvent.name}
                </h1>
                <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    size="sm"
                    className="gap-2"
                >
                    <PencilIcon className="h-4 w-4" />
                    Edit Event
                </Button>
            </div>

            <div className="grid w-full grid-cols-1 gap-6 lg:grid-cols-1">
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
                        <MarkerForm
                            marker={optimisticMarker}
                            event={event}
                            addOptimistic={updateMarker}
                        />
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Invite Participants</CardTitle>
                </CardHeader>
                <CardContent>
                    <EventInviteForm
                        event={event}
                        hub={event.hub!}
                        hubUsers={hubUsers}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
