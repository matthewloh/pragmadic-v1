"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/community-events/useOptimisticCommunityEvents"
import { type CommunityEvent } from "@/lib/db/schema/communityEvents"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import CommunityEventForm from "@/components/communityEvents/CommunityEventForm"
import { type Community, type CommunityId } from "@/lib/db/schema/communities"

export default function OptimisticCommunityEvent({
    communityEvent,
    communities,
    communityId,
}: {
    communityEvent: CommunityEvent

    communities: Community[]
    communityId?: CommunityId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: CommunityEvent) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticCommunityEvent, setOptimisticCommunityEvent] =
        useOptimistic(communityEvent)
    const updateCommunityEvent: TAddOptimistic = (input) =>
        setOptimisticCommunityEvent({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <CommunityEventForm
                    communityEvent={optimisticCommunityEvent}
                    communities={communities}
                    communityId={communityId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateCommunityEvent}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticCommunityEvent.title}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticCommunityEvent.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticCommunityEvent, null, 2)}
            </pre>
        </div>
    )
}
