"use client"

import { useState } from "react"
import { useOptimisticProfile } from "@/app/(app)/(profile)/profile/useOptimisticProfile"
import { Profile, type CompleteProfile } from "@/lib/db/schema/profile"
import Modal from "@/components/shared/Modal"
import ProfileForm from "./ProfileForm"
import { RegularProfileCard } from "./RegularProfileCard"
import { PlusIcon } from "lucide-react"

type TOpenModal = (profile?: Profile) => void

export default function ProfileList({
    profile,
}: {
    profile: CompleteProfile | undefined
}) {
    const { optimisticProfile, addOptimisticProfile } =
        useOptimisticProfile(profile)
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null)

    const openModal = (profile?: Profile) => {
        setOpen(true)
        profile ? setActiveProfile(profile) : setActiveProfile(null)
    }
    const closeModal = () => setOpen(false)

    const toggleExpand = () => setIsExpanded(!isExpanded)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={optimisticProfile ? "Edit Profile" : "Create Profile"}
            >
                <ProfileForm
                    profile={optimisticProfile}
                    addOptimistic={addOptimisticProfile}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            </Modal>
            {optimisticProfile ? (
                <RegularProfileCard
                    profile={optimisticProfile}
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
                No profile
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new profile.
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
                    New Profile
                </button>
            </div>
        </div>
    )
}
