"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type DerantauAdminProfile,
    CompleteDerantauAdminProfile,
} from "@/lib/db/schema/derantauAdminProfile"
import Modal from "@/components/shared/Modal"
import { type Region, type RegionId } from "@/lib/db/schema/regions"
import { useOptimisticDerantauAdminProfiles } from "@/app/(app)/derantau-admin-profile/useOptimisticDerantauAdminProfile"
import { Button } from "@/components/ui/button"
import DerantauAdminProfileForm from "./DerantauAdminProfileForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (derantauAdminProfile?: DerantauAdminProfile) => void

export default function DerantauAdminProfileList({
    derantauAdminProfile,
    regions,
    regionId,
}: {
    derantauAdminProfile: CompleteDerantauAdminProfile[]
    regions: Region[]
    regionId?: RegionId
}) {
    const {
        optimisticDerantauAdminProfiles,
        addOptimisticDerantauAdminProfile,
    } = useOptimisticDerantauAdminProfiles(derantauAdminProfile, regions)
    const [open, setOpen] = useState(false)
    const [activeDerantauAdminProfile, setActiveDerantauAdminProfile] =
        useState<DerantauAdminProfile | null>(null)
    const openModal = (derantauAdminProfile?: DerantauAdminProfile) => {
        setOpen(true)
        derantauAdminProfile
            ? setActiveDerantauAdminProfile(derantauAdminProfile)
            : setActiveDerantauAdminProfile(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeDerantauAdminProfile
                        ? "Edit DerantauAdminProfile"
                        : "Create Derantau Admin Profile"
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
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticDerantauAdminProfiles.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticDerantauAdminProfiles.map(
                        (derantauAdminProfile) => (
                            <DerantauAdminProfile
                                derantauAdminProfile={derantauAdminProfile}
                                key={derantauAdminProfile.id}
                                openModal={openModal}
                            />
                        ),
                    )}
                </ul>
            )}
        </div>
    )
}

const DerantauAdminProfile = ({
    derantauAdminProfile,
    openModal,
}: {
    derantauAdminProfile: CompleteDerantauAdminProfile
    openModal: TOpenModal
}) => {
    const optimistic = derantauAdminProfile.id === "optimistic"
    const deleting = derantauAdminProfile.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("derantau-admin-profile")
        ? pathname
        : pathname + "/derantau-admin-profile/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{derantauAdminProfile.department}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + derantauAdminProfile.id}>
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
                No derantau admin profile
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new derantau admin profile.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Derantau Admin Profile{" "}
                </Button>
            </div>
        </div>
    )
}
