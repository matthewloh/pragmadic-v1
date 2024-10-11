"use client"

import { useState } from "react"
import { useOptimisticDerantauAdminProfiles } from "@/app/(app)/derantau-admin-profile/useOptimisticDerantauAdminProfile"
import {
    DerantauAdminProfile,
    type CompleteDerantauAdminProfile,
} from "@/lib/db/schema/derantauAdminProfile"
import Modal from "@/components/shared/Modal"
import DerantauAdminProfileForm from "./DerantauAdminProfileForm"
import { RegionId, type Region } from "@/lib/db/schema/regions"
import { AdminProfileCard } from "../profile/AdminProfileCard"
import { PlusIcon } from "lucide-react"

type TOpenModal = (derantauAdminProfile?: DerantauAdminProfile) => void

export default function DerantauAdminProfileList({
    derantauAdminProfiles,
    regions,
    regionId,
}: {
    derantauAdminProfiles: CompleteDerantauAdminProfile[]
    regions: Region[]
    regionId?: RegionId
}) {
    const {
        optimisticDerantauAdminProfiles,
        addOptimisticDerantauAdminProfile,
    } = useOptimisticDerantauAdminProfiles(derantauAdminProfiles, regions)
    const [open, setOpen] = useState(false)
    const [isExpanded, setIsExpanded] = useState(false)
    const [activeDerantauAdminProfile, setActiveDerantauAdminProfile] =
        useState<DerantauAdminProfile | null>(null)

    const openModal = (derantauAdminProfile?: DerantauAdminProfile) => {
        setOpen(true)
        derantauAdminProfile
            ? setActiveDerantauAdminProfile(derantauAdminProfile)
            : setActiveDerantauAdminProfile(null)
    }
    const closeModal = () => {
        setOpen(false)
        setActiveDerantauAdminProfile(null)
    }
    const toggleExpand = () => setIsExpanded(!isExpanded)
    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeDerantauAdminProfile
                        ? "Edit Admin Profile"
                        : "Create Admin Profile"
                }
            >
                <DerantauAdminProfileForm
                    derantauAdminProfile={activeDerantauAdminProfile}
                    addOptimistic={addOptimisticDerantauAdminProfile}
                    openModal={openModal}
                    closeModal={closeModal}
                    regions={regions}
                    regionId={regionId}
                />
            </Modal>
            {optimisticDerantauAdminProfiles ? (
                <ul>
                    {optimisticDerantauAdminProfiles.map((profile) => (
                        <AdminProfileCard
                            key={profile.id}
                            profile={profile}
                            isExpanded={isExpanded}
                            onToggle={toggleExpand}
                            onManage={openModal}
                        />
                    ))}
                </ul>
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
                No admin profile
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new admin profile.
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
                    New Admin Profile
                </button>
            </div>
        </div>
    )
}
