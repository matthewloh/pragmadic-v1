"use client"

import { TAddOptimistic } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles"
import { type HubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles"
import { cn } from "@/lib/utils"
import { useOptimistic, useState } from "react"
import {
    Building2,
    Copy,
    ExternalLink,
    Globe,
    Mail,
    MapPin,
    Phone,
    Share2,
    User2,
    PenSquare,
} from "lucide-react"
import { toast } from "sonner"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import Link from "next/link"
import Modal from "@/components/shared/Modal"
import HubOwnerProfileForm from "@/components/hubOwnerProfiles/HubOwnerProfileForm"

export default function OptimisticHubOwnerProfile({
    hubOwnerProfile,
    userImageUrl,
}: {
    hubOwnerProfile: HubOwnerProfile
    userImageUrl: string
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: HubOwnerProfile) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticHubOwnerProfile, setOptimisticHubOwnerProfile] =
        useOptimistic(hubOwnerProfile)
    const updateHubOwnerProfile: TAddOptimistic = (input) =>
        setOptimisticHubOwnerProfile({ ...input.data })

    const copyToClipboard = (text: string, label: string) => {
        navigator.clipboard.writeText(text)
        toast.success(`${label} copied to clipboard!`)
    }

    return (
        <div className="container max-w-4xl px-4 py-8">
            <Modal open={open} setOpen={setOpen}>
                <HubOwnerProfileForm
                    hubOwnerProfile={optimisticHubOwnerProfile}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateHubOwnerProfile}
                />
            </Modal>

            <div
                className={cn(
                    "space-y-6",
                    optimisticHubOwnerProfile.id === "optimistic"
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
                                    {optimisticHubOwnerProfile.companyName ||
                                        "Company Name"}
                                </h2>
                                <p className="text-sm text-muted-foreground">
                                    {optimisticHubOwnerProfile.businessEmail}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {optimisticHubOwnerProfile.websiteUrl && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="gap-2"
                                    asChild
                                >
                                    <Link
                                        href={`https://${optimisticHubOwnerProfile.websiteUrl}`}
                                    >
                                        <Globe className="h-4 w-4" />
                                        Website
                                    </Link>
                                </Button>
                            )}
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
                    </div>

                    <Separator className="my-6" />

                    {/* Bio Section */}
                    <div className="space-y-2">
                        <h3 className="text-sm font-medium text-muted-foreground">
                            About
                        </h3>
                        <p className="text-sm leading-relaxed">
                            {optimisticHubOwnerProfile.bio ||
                                "No bio provided yet..."}
                        </p>
                    </div>
                </div>

                {/* Details Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Business Details */}
                    <div className="space-y-4 rounded-lg border bg-card/50 p-6">
                        <div className="flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" />
                            <h3 className="font-medium">Business Details</h3>
                        </div>
                        {optimisticHubOwnerProfile.businessRegistrationNumber && (
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-muted-foreground">
                                    Registration No.
                                </span>
                                <Badge variant="outline">
                                    {
                                        optimisticHubOwnerProfile.businessRegistrationNumber
                                    }
                                </Badge>
                            </div>
                        )}
                        <div
                            className="flex cursor-pointer items-center justify-between text-sm hover:text-primary"
                            onClick={() =>
                                copyToClipboard(
                                    optimisticHubOwnerProfile.businessContactNo,
                                    "Phone number",
                                )
                            }
                        >
                            <span className="text-muted-foreground">
                                Contact
                            </span>
                            <div className="flex items-center gap-2">
                                <span>
                                    {
                                        optimisticHubOwnerProfile.businessContactNo
                                    }
                                </span>
                                <Copy className="h-3 w-3" />
                            </div>
                        </div>
                    </div>

                    {/* Location Details */}
                    <div className="space-y-4 rounded-lg border bg-card/50 p-6">
                        <div className="flex items-center gap-2">
                            <MapPin className="h-5 w-5 text-destructive" />
                            <h3 className="font-medium">Locations</h3>
                        </div>
                        <div className="space-y-4 text-sm">
                            <div>
                                <span className="text-muted-foreground">
                                    Business Location
                                </span>
                                <p className="mt-1">
                                    {optimisticHubOwnerProfile.businessLocation}
                                </p>
                            </div>
                            <div>
                                <span className="text-muted-foreground">
                                    Residing At
                                </span>
                                <p className="mt-1">
                                    {optimisticHubOwnerProfile.residingLocation}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Social Links */}
                {optimisticHubOwnerProfile.socialMediaHandles && (
                    <div className="rounded-lg border bg-card/50 p-6">
                        <div className="mb-3 flex items-center gap-2">
                            <Globe className="h-5 w-5 text-blue-500" />
                            <h3 className="font-medium">Social Presence</h3>
                        </div>
                        <p className="text-sm text-muted-foreground">
                            {optimisticHubOwnerProfile.socialMediaHandles}
                        </p>
                    </div>
                )}

                {/* Debug Info - Only in development */}
                {process.env.NODE_ENV === "development" && (
                    <div className="rounded-lg border bg-card/50 p-4">
                        <p className="mb-2 text-sm font-medium text-muted-foreground">
                            Debug Info
                        </p>
                        <pre className="text-xs">
                            {JSON.stringify(optimisticHubOwnerProfile, null, 2)}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
