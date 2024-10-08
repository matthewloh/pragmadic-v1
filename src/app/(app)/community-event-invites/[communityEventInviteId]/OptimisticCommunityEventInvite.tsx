"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/community-event-invites/useOptimisticCommunityEventInvites"
import { type CommunityEventInvite } from "@/lib/db/schema/communityEventInvites"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import CommunityEventInviteForm from "@/components/communityEventInvites/CommunityEventInviteForm"
import {
    type CommunityEvent,
    type CommunityEventId,
} from "@/lib/db/schema/communityEvents"

export default function OptimisticCommunityEventInvite({
    communityEventInvite,
    communityEvents,
    communityEventId,
}: {
    communityEventInvite: CommunityEventInvite

    communityEvents: CommunityEvent[]
    communityEventId?: CommunityEventId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: CommunityEventInvite) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticCommunityEventInvite, setOptimisticCommunityEventInvite] =
        useOptimistic(communityEventInvite)
    const updateCommunityEventInvite: TAddOptimistic = (input) =>
        setOptimisticCommunityEventInvite({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <CommunityEventInviteForm
                    communityEventInvite={optimisticCommunityEventInvite}
                    communityEvents={communityEvents}
                    communityEventId={communityEventId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateCommunityEventInvite}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticCommunityEventInvite.inviteStatus}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticCommunityEventInvite.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticCommunityEventInvite, null, 2)}
            </pre>
        </div>
    )
}
