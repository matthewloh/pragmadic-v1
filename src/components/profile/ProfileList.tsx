"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type Profile, CompleteProfile } from "@/lib/db/schema/profile"
import Modal from "@/components/shared/Modal"
import { useOptimisticProfile } from "@/app/(app)/(profile)/profile/useOptimisticProfile"
import { Button } from "@/components/ui/button"
import ProfileForm from "./ProfileForm"
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
    const [activeProfile, setActiveProfile] = useState<Profile | null>(null)
    const openModal = (profile?: Profile) => {
        setOpen(true)
        profile ? setActiveProfile(profile) : setActiveProfile(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeProfile ? "Edit Profile" : "Create Profile"}
            >
                <ProfileForm
                    profile={activeProfile}
                    addOptimistic={addOptimisticProfile}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            </Modal>
            {!optimisticProfile ? (
                <EmptyState openModal={openModal} />
            ) : (
                <Profile profile={optimisticProfile} openModal={openModal} />
            )}
        </div>
    )
}

const Profile = ({
    profile,
    openModal,
}: {
    profile: CompleteProfile
    openModal: TOpenModal
}) => {
    const optimistic = profile.id === "optimistic"
    const deleting = profile.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("profile")
        ? pathname
        : pathname + "/profile/"

    return (
        <div
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{profile.bio}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + profile.id}>Edit</Link>
            </Button>
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
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Profile{" "}
                </Button>
            </div>
        </div>
    )
}
