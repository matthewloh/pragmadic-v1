"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/events/useOptimisticEvents"
import { CompleteEvent, type Event, type EventId } from "@/lib/db/schema/events"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import EventForm from "@/components/events/EventForm"
import { type Hub } from "@/lib/db/schema/hubs"
import { EventInviteForm } from "@/components/events/EventInviteForm"
import { SelectUser } from "@/lib/db/schema"

export default function OptimisticEvent({
    event,
    hubs,
    hubUsers,
}: {
    event: CompleteEvent
    hubs: Hub[]
    hubUsers: SelectUser[]
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Event) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticEvent, setOptimisticEvent] = useOptimistic(event)
    const updateEvent: TAddOptimistic = (input) =>
        setOptimisticEvent({ ...optimisticEvent, ...input.data })

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
        </div>
    )
}
