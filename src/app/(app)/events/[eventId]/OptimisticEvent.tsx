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
import { EventMarker, SelectUser } from "@/lib/db/schema"
import { type Hub } from "@/lib/db/schema/hubs"

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
    const openModal = (_?: Event) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticEvent, setOptimisticEvent] = useOptimistic(event)
    const [optimisticMarker, setOptimisticMarker] = useOptimistic(marker)

    const updateEvent: TAddOptimistic = (input) =>
        setOptimisticEvent({ ...optimisticEvent, ...input.data })

    const updateMarker: TAddOptimisticMarker = (input) =>
        setOptimisticMarker({ ...optimisticMarker, ...input.data })

    return (
        <div className="m-4">
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
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticEvent.name}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticEvent.id === "optimistic" ? "animate-pulse" : "",
                )}
            >
                {JSON.stringify(optimisticEvent, null, 2)}
            </pre>
            <div className="mt-6">
                <h3 className="mb-4 text-xl font-semibold">Invite Users</h3>
                <EventInviteForm
                    event={event}
                    hub={event.hub!}
                    hubUsers={hubUsers}
                />
            </div>
            <MarkerForm
                marker={optimisticMarker}
                event={event}
                addOptimistic={updateMarker}
            />
        </div>
    )
}
