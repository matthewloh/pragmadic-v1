"use client"

import { useState } from "react"
import { type CompleteHubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles"
import Modal from "@/components/shared/Modal"
import HubOwnerProfileForm from "./HubOwnerProfileForm"
import ProfileCard from "@/features/profile/components/ProfileCard"
import { useOptimisticHubOwnerProfile } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles"

export default function HubOwnerProfileList({
    hubOwnerProfile,
}: {
    hubOwnerProfile: CompleteHubOwnerProfile | undefined
}) {
    const { optimisticHubOwnerProfile, addOptimisticHubOwnerProfile } =
        useOptimisticHubOwnerProfile(hubOwnerProfile)
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)

    const openModal = () => setOpen(true)
    const closeModal = () => setOpen(false)
    const toggleExpand = () => setIsExpanded(!isExpanded)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    optimisticHubOwnerProfile
                        ? "Edit Hub Profile"
                        : "Create Hub Profile"
                }
            >
                <HubOwnerProfileForm
                    hubOwnerProfile={optimisticHubOwnerProfile}
                    addOptimistic={addOptimisticHubOwnerProfile}
                    closeModal={closeModal}
                />
            </Modal>
            <ProfileCard
                profile={{
                    id: optimisticHubOwnerProfile?.id || "",
                    type: "owner",
                    exists: !!optimisticHubOwnerProfile,
                    title: "Hub Owner Profile",
                    description:
                        optimisticHubOwnerProfile?.companyName ||
                        "Manage your hub details",
                }}
                isExpanded={isExpanded}
                onToggle={toggleExpand}
                onManage={openModal}
            />
        </div>
    )
}
