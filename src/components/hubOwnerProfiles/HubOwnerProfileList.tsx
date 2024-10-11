"use client"

import { useState } from "react"
import { useOptimisticHubOwnerProfile } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles"
import {
    HubOwnerProfile,
    type CompleteHubOwnerProfile,
} from "@/lib/db/schema/hubOwnerProfiles"
import Modal from "@/components/shared/Modal"
import HubOwnerProfileForm from "./HubOwnerProfileForm"
import { HubOwnerProfileCard } from "../profile/HubOwnerProfileCard"
import { PlusIcon } from "lucide-react"

type TOpenModal = (hubOwnerProfile?: HubOwnerProfile) => void

export default function HubOwnerProfileList({
    hubOwnerProfile,
}: {
    hubOwnerProfile: CompleteHubOwnerProfile | undefined
}) {
    const { optimisticHubOwnerProfile, addOptimisticHubOwnerProfile } =
        useOptimisticHubOwnerProfile(hubOwnerProfile)
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeHubOwnerProfile, setActiveHubOwnerProfile] =
        useState<HubOwnerProfile | null>(null)

    const openModal = (hubOwnerProfile?: HubOwnerProfile) => {
        setOpen(true)
        hubOwnerProfile
            ? setActiveHubOwnerProfile(hubOwnerProfile)
            : setActiveHubOwnerProfile(null)
    }

    const closeModal = () => setOpen(false)

    const toggleExpand = () => setIsExpanded(!isExpanded)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    optimisticHubOwnerProfile
                        ? "Edit Hub Owner Profile"
                        : "Create Hub Owner Profile"
                }
            >
                <HubOwnerProfileForm
                    hubOwnerProfile={optimisticHubOwnerProfile}
                    addOptimistic={addOptimisticHubOwnerProfile}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            </Modal>
            {optimisticHubOwnerProfile ? (
                <HubOwnerProfileCard
                    profile={optimisticHubOwnerProfile}
                    isExpanded={isExpanded}
                    onToggle={toggleExpand}
                    onManage={openModal}
                />
            ) : (
                <EmptyState openModal={openModal} />
            )}
        </div>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No hub owner profile
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new hub owner profile.
            </p>
            <div className="mt-6">
                <button
                    type="button"
                    className="inline-flex items-center rounded-md bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90"
                    onClick={() => openModal()}
                >
                    <PlusIcon
                        className="-ml-0.5 mr-1.5 h-5 w-5"
                        aria-hidden="true"
                    />
                    New Hub Owner Profile
                </button>
            </div>
        </div>
    )
}
