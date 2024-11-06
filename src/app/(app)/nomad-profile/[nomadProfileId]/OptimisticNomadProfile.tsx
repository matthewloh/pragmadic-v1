"use client"

import { TAddOptimistic } from "@/app/(app)/nomad-profile/useOptimisticNomadProfile"
import { type NomadProfile } from "@/lib/db/schema/nomadProfile"
import { cn } from "@/lib/utils"
import { useOptimistic, useState } from "react"
import {
    User2,
    MapPin,
    Phone,
    Heart,
    Code2,
    PenSquare,
    Mail,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Modal from "@/components/shared/Modal"
import NomadProfileForm from "@/components/nomadProfile/NomadProfileForm"

export default function OptimisticNomadProfile({
    nomadProfile,
    userImageUrl,
}: {
    nomadProfile: NomadProfile
    userImageUrl: string
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: NomadProfile) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticNomadProfile, setOptimisticNomadProfile] =
        useOptimistic(nomadProfile)
    const updateNomadProfile: TAddOptimistic = (input) =>
        setOptimisticNomadProfile({ ...input.data })

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard!`)
    }

    return (
        <div className="container max-w-4xl px-4 py-8">
            <Modal open={open} setOpen={setOpen}>
                <NomadProfileForm
                    nomadProfile={optimisticNomadProfile}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateNomadProfile}
                />
            </Modal>

            <div
                className={cn(
                    "space-y-6",
                    optimisticNomadProfile.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {/* Header Card */}
                <div className="rounded-lg border bg-card/30 p-6">
                    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
                        <div className="flex items-center gap-4">
                            <Avatar className="h-16 w-16 border-2 border-primary/10">
                                <AvatarImage src={userImageUrl} />
                                <AvatarFallback className="bg-primary/5 text-lg">
                                    <User2 className="h-8 w-8" />
                                </AvatarFallback>
                            </Avatar>
                            <div>
                                <h2 className="text-xl font-semibold tracking-tight">
                                    {optimisticNomadProfile.bio ||
                                        "Digital Nomad"}
                                </h2>
                                {optimisticNomadProfile.currentLocation && (
                                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {optimisticNomadProfile.currentLocation}
                                    </p>
                                )}
                            </div>
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            className="gap-2"
                            onClick={() => setOpen(true)}
                        >
                            <PenSquare className="h-4 w-4" />
                            Edit Profile
                        </Button>
                    </div>

                    <Separator className="my-6" />

                    {/* Contact Information */}
                    {optimisticNomadProfile.contactInformation && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <Mail className="h-4 w-4" />
                            <span
                                className="cursor-pointer hover:text-primary"
                                onClick={() =>
                                    copyToClipboard(
                                        optimisticNomadProfile.contactInformation!,
                                        "Contact information",
                                    )
                                }
                            >
                                {optimisticNomadProfile.contactInformation}
                            </span>
                        </div>
                    )}
                </div>

                {/* Skills & Interests Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Skills Section */}
                    <div className="space-y-4 rounded-lg border bg-card/50 p-6">
                        <div className="flex items-center gap-2">
                            <Code2 className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">Skills</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {optimisticNomadProfile.skills
                                ?.split(",")
                                .map((skill, index) => (
                                    <Badge key={index} variant="secondary">
                                        {skill.trim()}
                                    </Badge>
                                ))}
                        </div>
                    </div>

                    {/* Interests Section */}
                    <div className="space-y-4 rounded-lg border bg-card/50 p-6">
                        <div className="flex items-center gap-2">
                            <Heart className="h-5 w-5 text-destructive" />
                            <h3 className="font-medium">Interests</h3>
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {optimisticNomadProfile.interests
                                ?.split(",")
                                .map((interest, index) => (
                                    <Badge key={index} variant="outline">
                                        {interest.trim()}
                                    </Badge>
                                ))}
                        </div>
                    </div>
                </div>

                {/* Debug Info - Only in development */}
                {process.env.NODE_ENV === "development" && (
                    <div className="rounded-lg border bg-card/50 p-4">
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                            Debug Info
                        </p>
                        <pre className="text-xs">
                            {JSON.stringify(optimisticNomadProfile, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
