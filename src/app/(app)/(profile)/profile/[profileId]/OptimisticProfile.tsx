"use client"

import { TAddOptimistic } from "@/app/(app)/(profile)/profile/useOptimisticProfile"
import { type Profile } from "@/lib/db/schema/profile"
import { cn } from "@/lib/utils"
import { useOptimistic, useState } from "react"

import ProfileForm from "@/components/profile/ProfileForm"
import Modal from "@/components/shared/Modal"
import { Button } from "@/components/ui/button"

export default function OptimisticProfile({ profile }: { profile: Profile }) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Profile) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticProfile, setOptimisticProfile] = useOptimistic(profile)
    const updateProfile: TAddOptimistic = (input) =>
        setOptimisticProfile({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <ProfileForm
                    profile={optimisticProfile}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateProfile}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticProfile.bio}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticProfile.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticProfile, null, 2)}
            </pre>
        </div>
    )
}
