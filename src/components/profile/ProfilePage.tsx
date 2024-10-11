"use client"

import { useOptimisticProfile } from "@/app/(app)/(profile)/profile/useOptimisticProfile"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { type CompleteProfile } from "@/lib/db/schema/profile"
import {
    Briefcase,
    Facebook,
    GraduationCap,
    Instagram,
    Linkedin,
    MapPin,
    Twitter,
} from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import ProfileForm from "./ProfileForm"

const UppyUploader = () => (
    <div className="rounded-lg border-2 border-dashed border-gray-300 p-6 text-center">
        <p className="text-gray-500">
            Drag & drop your image here, or click to select files
        </p>
    </div>
)

export default function ProfilePage({
    profile,
}: {
    profile: CompleteProfile | undefined
}) {
    const { optimisticProfile, addOptimisticProfile } =
        useOptimisticProfile(profile)
    const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
    const [isProfileFormOpen, setIsProfileFormOpen] = useState(false)

    const openProfileForm = () => setIsProfileFormOpen(true)
    const closeProfileForm = () => setIsProfileFormOpen(false)

    const { isLoading, data } = useUserRole()
    if (!optimisticProfile) return null

    const userImageUrl =
        data?.user?.user_metadata?.avatar_url || "/placeholder.svg"

    return (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {/* Left Column */}
            <div className="md:col-span-1">
                <Card>
                    <CardContent className="pt-6">
                        <div className="relative mx-auto mb-4 h-32 w-32">
                            <Image
                                src={userImageUrl}
                                alt="Profile Picture"
                                width={128}
                                height={128}
                                className="rounded-full"
                            />
                            <Button
                                size="sm"
                                className="absolute bottom-0 right-0"
                                onClick={() => setIsUploadDialogOpen(true)}
                            >
                                Edit
                            </Button>
                        </div>
                        <h2 className="text-center text-2xl font-bold">
                            {optimisticProfile.website}
                        </h2>
                        <p className="mb-4 text-center text-gray-500">
                            {optimisticProfile.occupation}
                        </p>
                        <div className="mb-4 flex justify-center space-x-2">
                            <Button size="icon" variant="ghost">
                                <Linkedin className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <Twitter className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <Instagram className="h-5 w-5" />
                            </Button>
                            <Button size="icon" variant="ghost">
                                <Facebook className="h-5 w-5" />
                            </Button>
                        </div>
                        <Button className="w-full">View Resume</Button>
                    </CardContent>
                </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-6 md:col-span-2">
                {/* About Me */}
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>About me</CardTitle>
                        <Button variant="ghost" onClick={openProfileForm}>
                            Edit
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4">{optimisticProfile.bio}</p>
                        <div className="mb-4 flex flex-wrap gap-2">
                            <Badge>Adventurous</Badge>
                            <Badge>Tech-savvy</Badge>
                            <Badge>ENFP - The Campaigner</Badge>
                        </div>
                        <div className="space-y-2">
                            <div className="flex items-center">
                                <MapPin className="mr-2 h-5 w-5 text-gray-400" />
                                <span>{optimisticProfile.location}</span>
                            </div>
                            <div className="flex items-center">
                                <Briefcase className="mr-2 h-5 w-5 text-gray-400" />
                                <span>{optimisticProfile.occupation}</span>
                            </div>
                            <div className="flex items-center">
                                <GraduationCap className="mr-2 h-5 w-5 text-gray-400" />
                                <span>Computer Science</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Experience */}
                <Card>
                    <CardHeader>
                        <CardTitle>Experience</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <div className="mr-4 h-12 w-12 flex-shrink-0 rounded-md bg-gray-200"></div>
                                <div>
                                    <h3 className="font-semibold">
                                        {optimisticProfile.occupation}
                                    </h3>
                                    <p className="text-sm text-gray-500">
                                        Current Company
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        Current Year - Present
                                    </p>
                                    <p className="mt-2">
                                        {optimisticProfile.bio}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Image Upload Dialog */}
            <Dialog
                open={isUploadDialogOpen}
                onOpenChange={setIsUploadDialogOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Upload Profile Picture</DialogTitle>
                    </DialogHeader>
                    <UppyUploader />
                    <div className="mt-4 flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsUploadDialogOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button onClick={() => setIsUploadDialogOpen(false)}>
                            Upload
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Profile Edit Form */}
            <Dialog
                open={isProfileFormOpen}
                onOpenChange={setIsProfileFormOpen}
            >
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                    </DialogHeader>
                    <ProfileForm
                        profile={optimisticProfile}
                        addOptimistic={addOptimisticProfile}
                        openModal={openProfileForm}
                        closeModal={closeProfileForm}
                    />
                </DialogContent>
            </Dialog>
        </div>
    )
}
