"use client"

import { useState } from "react"
import {
    type NomadProfile,
    CompleteNomadProfile,
} from "@/lib/db/schema/nomadProfile"
import Modal from "@/components/shared/Modal"
import { useOptimisticNomadProfile } from "@/app/(app)/nomad-profile/useOptimisticNomadProfile"
import NomadProfileForm from "./NomadProfileForm"
import ProfileCard from "@/features/profile/components/ProfileCard"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type TOpenModal = (nomadProfile?: NomadProfile) => void

export default function NomadProfileList({
    nomadProfile,
}: {
    nomadProfile: CompleteNomadProfile | null
}) {
    const { optimisticNomadProfile, addOptimisticNomadProfile } =
        useOptimisticNomadProfile(nomadProfile)
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeNomadProfile, setActiveNomadProfile] =
        useState<NomadProfile | null>(null)

    const openModal = (nomadProfile?: NomadProfile) => {
        setOpen(true)
        nomadProfile
            ? setActiveNomadProfile(nomadProfile)
            : setActiveNomadProfile(null)
    }
    const closeModal = () => setOpen(false)
    const toggleExpand = () => setIsExpanded(!isExpanded)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeNomadProfile
                        ? "Edit Nomad Profile"
                        : "Create Nomad Profile"
                }
            >
                <NomadProfileForm
                    nomadProfile={activeNomadProfile}
                    addOptimistic={addOptimisticNomadProfile}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    <PlusIcon className="h-4 w-4" />
                </Button>
            </div>
            {!optimisticNomadProfile ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ProfileCard
                    profile={{
                        id: optimisticNomadProfile.id,
                        type: "nomad",
                        exists: true,
                        title: "Digital Nomad Profile",
                        description:
                            optimisticNomadProfile.bio ||
                            "Manage your nomad profile details",
                    }}
                    isExpanded={isExpanded}
                    onToggle={toggleExpand}
                    onManage={() => openModal(optimisticNomadProfile)}
                />
            )}
        </div>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No nomad profile
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new nomad profile.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="mr-2 h-4 w-4" /> New Nomad Profile
                </Button>
            </div>
        </div>
    )
}
