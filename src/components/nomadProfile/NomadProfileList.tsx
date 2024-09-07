"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type NomadProfile,
    CompleteNomadProfile,
} from "@/lib/db/schema/nomadProfile"
import Modal from "@/components/shared/Modal"

import { useOptimisticNomadProfiles } from "@/app/(app)/nomad-profile/useOptimisticNomadProfile"
import { Button } from "@/components/ui/button"
import NomadProfileForm from "./NomadProfileForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (nomadProfile?: NomadProfile) => void

export default function NomadProfileList({
    nomadProfile,
}: {
    nomadProfile: CompleteNomadProfile[]
}) {
    const { optimisticNomadProfiles, addOptimisticNomadProfile } =
        useOptimisticNomadProfiles(nomadProfile)
    const [open, setOpen] = useState(false)
    const [activeNomadProfile, setActiveNomadProfile] =
        useState<NomadProfile | null>(null)
    const openModal = (nomadProfile?: NomadProfile) => {
        setOpen(true)
        nomadProfile
            ? setActiveNomadProfile(nomadProfile)
            : setActiveNomadProfile(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeNomadProfile
                        ? "Edit NomadProfile"
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
                    +
                </Button>
            </div>
            {optimisticNomadProfiles.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticNomadProfiles.map((nomadProfile) => (
                        <NomadProfile
                            nomadProfile={nomadProfile}
                            key={nomadProfile.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const NomadProfile = ({
    nomadProfile,
    openModal,
}: {
    nomadProfile: CompleteNomadProfile
    openModal: TOpenModal
}) => {
    const optimistic = nomadProfile.id === "optimistic"
    const deleting = nomadProfile.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("nomad-profile")
        ? pathname
        : pathname + "/nomad-profile/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{nomadProfile.bio}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + nomadProfile.id}>Edit</Link>
            </Button>
        </li>
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
                    <PlusIcon className="h-4" /> New Nomad Profile{" "}
                </Button>
            </div>
        </div>
    )
}
