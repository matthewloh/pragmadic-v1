"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles"
import { type HubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import HubOwnerProfileForm from "@/components/hubOwnerProfiles/HubOwnerProfileForm"

export default function OptimisticHubOwnerProfile({
    hubOwnerProfile,
}: {
    hubOwnerProfile: HubOwnerProfile
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: HubOwnerProfile) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticHubOwnerProfile, setOptimisticHubOwnerProfile] =
        useOptimistic(hubOwnerProfile)
    const updateHubOwnerProfile: TAddOptimistic = (input) =>
        setOptimisticHubOwnerProfile({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <HubOwnerProfileForm
                    hubOwnerProfile={optimisticHubOwnerProfile}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateHubOwnerProfile}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticHubOwnerProfile.companyName}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticHubOwnerProfile.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticHubOwnerProfile, null, 2)}
            </pre>
        </div>
    )
}
