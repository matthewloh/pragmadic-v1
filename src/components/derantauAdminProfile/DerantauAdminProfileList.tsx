"use client"

import { useState } from "react"
import { useOptimisticDerantauAdminProfile } from "@/app/(app)/derantau-admin-profile/useOptimisticDerantauAdminProfile"
import {
    type DerantauAdminProfile,
    type CompleteDerantauAdminProfile,
} from "@/lib/db/schema/derantauAdminProfile"
import { type Region } from "@/lib/db/schema/regions"
import Modal from "@/components/shared/Modal"
import DerantauAdminProfileForm from "./DerantauAdminProfileForm"
import ProfileCard from "@/features/profile/components/ProfileCard"
import { PlusIcon } from "lucide-react"
import { Button } from "@/components/ui/button"

type TOpenModal = (derantauAdminProfile?: DerantauAdminProfile) => void

export default function DerantauAdminProfileList({
    derantauAdminProfile,
    regions,
}: {
    derantauAdminProfile: CompleteDerantauAdminProfile | null
    regions: Region[]
}) {
    const {
        optimisticDerantauAdminProfile,
        addOptimisticDerantauAdminProfile,
    } = useOptimisticDerantauAdminProfile(derantauAdminProfile, regions)
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeProfile, setActiveProfile] =
        useState<DerantauAdminProfile | null>(null)

    const openModal = (profile?: DerantauAdminProfile) => {
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
                title={
                    activeProfile
                        ? "Edit Admin Profile"
                        : "Create Admin Profile"
                }
            >
                <DerantauAdminProfileForm
                    derantauAdminProfile={activeProfile}
                    addOptimistic={addOptimisticDerantauAdminProfile}
                    openModal={openModal}
                    closeModal={closeModal}
                    regions={regions}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    <PlusIcon className="h-4 w-4" />
                </Button>
            </div>
            {!optimisticDerantauAdminProfile ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ProfileCard
                    profile={{
                        id: optimisticDerantauAdminProfile.id,
                        type: "admin",
                        exists: true,
                        title: `Admin Profile - ${optimisticDerantauAdminProfile.department}`,
                        description: `${optimisticDerantauAdminProfile.position} - ${optimisticDerantauAdminProfile.adminLevel}`,
                    }}
                    isExpanded={isExpanded}
                    onToggle={toggleExpand}
                    onManage={() => openModal(optimisticDerantauAdminProfile)}
                />
            )}
        </div>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No admin profile
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new admin profile.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="mr-2 h-4 w-4" /> New Admin Profile
                </Button>
            </div>
        </div>
    )
}
