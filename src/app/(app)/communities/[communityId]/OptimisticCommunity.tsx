"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/communities/useOptimisticCommunities"
import { type Community } from "@/lib/db/schema/communities"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import CommunityForm from "@/components/communities/CommunityForm"

export default function OptimisticCommunity({
    community,
}: {
    community: Community
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Community) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticCommunity, setOptimisticCommunity] =
        useOptimistic(community)
    const updateCommunity: TAddOptimistic = (input) =>
        setOptimisticCommunity({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <CommunityForm
                    community={optimisticCommunity}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateCommunity}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticCommunity.name}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticCommunity.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticCommunity, null, 2)}
            </pre>
        </div>
    )
}
