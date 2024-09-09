"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type CommunityEvent,
    CompleteCommunityEvent,
} from "@/lib/db/schema/communityEvents"
import Modal from "@/components/shared/Modal"
import { type Community, type CommunityId } from "@/lib/db/schema/communities"
import { useOptimisticCommunityEvents } from "@/app/(app)/community-events/useOptimisticCommunityEvents"
import { Button } from "@/components/ui/button"
import CommunityEventForm from "./CommunityEventForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (communityEvent?: CommunityEvent) => void

export default function CommunityEventList({
    communityEvents,
    communities,
    communityId,
}: {
    communityEvents: CompleteCommunityEvent[]
    communities: Community[]
    communityId?: CommunityId
}) {
    const { optimisticCommunityEvents, addOptimisticCommunityEvent } =
        useOptimisticCommunityEvents(communityEvents, communities)
    const [open, setOpen] = useState(false)
    const [activeCommunityEvent, setActiveCommunityEvent] =
        useState<CommunityEvent | null>(null)
    const openModal = (communityEvent?: CommunityEvent) => {
        setOpen(true)
        communityEvent
            ? setActiveCommunityEvent(communityEvent)
            : setActiveCommunityEvent(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeCommunityEvent
                        ? "Edit CommunityEvent"
                        : "Create Community Event"
                }
            >
                <CommunityEventForm
                    communityEvent={activeCommunityEvent}
                    addOptimistic={addOptimisticCommunityEvent}
                    openModal={openModal}
                    closeModal={closeModal}
                    communities={communities}
                    communityId={communityId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticCommunityEvents.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticCommunityEvents.map((communityEvent) => (
                        <CommunityEvent
                            communityEvent={communityEvent}
                            key={communityEvent.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const CommunityEvent = ({
    communityEvent,
    openModal,
}: {
    communityEvent: CompleteCommunityEvent
    openModal: TOpenModal
}) => {
    const optimistic = communityEvent.id === "optimistic"
    const deleting = communityEvent.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("community-events")
        ? pathname
        : pathname + "/community-events/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{communityEvent.title}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + communityEvent.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No community events
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new community event.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Community Events{" "}
                </Button>
            </div>
        </div>
    )
}
