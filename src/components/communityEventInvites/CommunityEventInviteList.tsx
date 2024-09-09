"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type CommunityEventInvite,
    CompleteCommunityEventInvite,
} from "@/lib/db/schema/communityEventInvites"
import Modal from "@/components/shared/Modal"
import {
    type CommunityEvent,
    type CommunityEventId,
} from "@/lib/db/schema/communityEvents"
import { useOptimisticCommunityEventInvites } from "@/app/(app)/community-event-invites/useOptimisticCommunityEventInvites"
import { Button } from "@/components/ui/button"
import CommunityEventInviteForm from "./CommunityEventInviteForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (communityEventInvite?: CommunityEventInvite) => void

export default function CommunityEventInviteList({
    communityEventInvites,
    communityEvents,
    communityEventId,
}: {
    communityEventInvites: CompleteCommunityEventInvite[]
    communityEvents: CommunityEvent[]
    communityEventId?: CommunityEventId
}) {
    const {
        optimisticCommunityEventInvites,
        addOptimisticCommunityEventInvite,
    } = useOptimisticCommunityEventInvites(
        communityEventInvites,
        communityEvents,
    )
    const [open, setOpen] = useState(false)
    const [activeCommunityEventInvite, setActiveCommunityEventInvite] =
        useState<CommunityEventInvite | null>(null)
    const openModal = (communityEventInvite?: CommunityEventInvite) => {
        setOpen(true)
        communityEventInvite
            ? setActiveCommunityEventInvite(communityEventInvite)
            : setActiveCommunityEventInvite(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeCommunityEventInvite
                        ? "Edit CommunityEventInvite"
                        : "Create Community Event Invite"
                }
            >
                <CommunityEventInviteForm
                    communityEventInvite={activeCommunityEventInvite}
                    addOptimistic={addOptimisticCommunityEventInvite}
                    openModal={openModal}
                    closeModal={closeModal}
                    communityEvents={communityEvents}
                    communityEventId={communityEventId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticCommunityEventInvites.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticCommunityEventInvites.map(
                        (communityEventInvite) => (
                            <CommunityEventInvite
                                communityEventInvite={communityEventInvite}
                                key={communityEventInvite.id}
                                openModal={openModal}
                            />
                        ),
                    )}
                </ul>
            )}
        </div>
    )
}

const CommunityEventInvite = ({
    communityEventInvite,
    openModal,
}: {
    communityEventInvite: CompleteCommunityEventInvite
    openModal: TOpenModal
}) => {
    const optimistic = communityEventInvite.id === "optimistic"
    const deleting = communityEventInvite.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("community-event-invites")
        ? pathname
        : pathname + "/community-event-invites/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{communityEventInvite.inviteStatus}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + communityEventInvite.id}>
                    Edit
                </Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No community event invites
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new community event invite.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Community Event Invites{" "}
                </Button>
            </div>
        </div>
    )
}
