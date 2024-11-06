"use client"

import { TAddOptimistic } from "@/app/(app)/(profile)/profile/useOptimisticProfile"
import { type Profile } from "@/lib/db/schema/profile"
import { cn } from "@/lib/utils"
import { useOptimistic, useState } from "react"
import {
    Edit3,
    User,
    MapPin,
    Globe,
    Briefcase,
    Phone,
    AtSign,
    Calendar,
    Users,
    Star,
    Coffee,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import ProfileForm from "@/components/profile/ProfileForm"
import Modal from "@/components/shared/Modal"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"

export default function OptimisticProfile({
    profile,
    userImageUrl,
}: {
    profile: Profile
    userImageUrl?: string
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Profile) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticProfile, setOptimisticProfile] = useOptimistic(profile)
    const updateProfile: TAddOptimistic = (input) =>
        setOptimisticProfile({ ...input.data })

    const MotionCard = motion(Card)

    return (
        <div className="container mx-auto max-w-4xl px-4 py-8">
            <Modal open={open} setOpen={setOpen}>
                <ProfileForm
                    profile={optimisticProfile}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateProfile}
                />
            </Modal>

            <div className="grid gap-6 md:grid-cols-3">
                {/* Left Column - Profile Card */}
                <MotionCard
                    className="md:col-span-1"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <CardContent className="pt-6">
                        <div className="flex flex-col items-center text-center">
                            <Avatar className="mb-4 h-32 w-32 ring-4 ring-primary ring-offset-2">
                                <AvatarImage src={userImageUrl} />
                                <AvatarFallback>
                                    <User className="h-16 w-16" />
                                </AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h2 className="text-2xl font-bold">
                                    {optimisticProfile.bio}
                                </h2>
                                {optimisticProfile.occupation && (
                                    <Badge
                                        variant="secondary"
                                        className="mt-2 text-sm"
                                    >
                                        <Briefcase className="mr-1 h-3 w-3" />
                                        {optimisticProfile.occupation}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardContent>
                </MotionCard>

                {/* Right Column - Details */}
                <MotionCard
                    className={cn(
                        "md:col-span-2",
                        optimisticProfile.id === "optimistic"
                            ? "animate-pulse"
                            : "",
                    )}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                >
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-semibold">
                            Profile Details
                        </CardTitle>
                        <Button
                            onClick={() => setOpen(true)}
                            variant="outline"
                            size="sm"
                            className="transition-all hover:bg-primary hover:text-primary-foreground"
                        >
                            <Edit3 className="mr-2 h-4 w-4" />
                            Edit Profile
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {optimisticProfile.location && (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <MapPin className="h-5 w-5 text-primary" />
                                    <span className="text-foreground">
                                        {optimisticProfile.location}
                                    </span>
                                </div>
                            )}

                            {optimisticProfile.website && (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Globe className="h-5 w-5 text-primary" />
                                    <a
                                        href={optimisticProfile.website}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-foreground hover:underline"
                                    >
                                        {optimisticProfile.website}
                                    </a>
                                </div>
                            )}

                            {optimisticProfile.contactNumber && (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <Phone className="h-5 w-5 text-primary" />
                                    <span className="text-foreground">
                                        {optimisticProfile.contactNumber}
                                    </span>
                                </div>
                            )}

                            {optimisticProfile.socialLinks && (
                                <div className="flex items-center gap-3 text-muted-foreground">
                                    <AtSign className="h-5 w-5 text-primary" />
                                    <span className="text-foreground">
                                        {optimisticProfile.socialLinks}
                                    </span>
                                </div>
                            )}

                            <Separator className="my-4" />

                            <div className="flex items-center gap-3 text-sm text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                <span>
                                    Joined{" "}
                                    {new Date(
                                        optimisticProfile.createdAt,
                                    ).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </CardContent>
                </MotionCard>

                {/* Additional Section for Stats or Other Info */}
                <MotionCard
                    className="md:col-span-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                >
                    <CardHeader>
                        <CardTitle className="text-xl font-semibold">
                            Activity Overview
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                            <StatCard
                                icon={Users}
                                label="Connections"
                                value={0}
                            />
                            <StatCard
                                icon={Calendar}
                                label="Events Attended"
                                value={0}
                            />
                            <StatCard icon={Star} label="Reviews" value={0} />
                            <StatCard
                                icon={Coffee}
                                label="Hub Visits"
                                value={0}
                            />
                        </div>
                    </CardContent>
                </MotionCard>
            </div>
        </div>
    )
}

function StatCard({
    icon: Icon,
    label,
    value,
}: {
    icon: any
    label: string
    value: number
}) {
    return (
        <Card className="overflow-hidden">
            <CardContent className="p-6">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm font-medium text-muted-foreground">
                            {label}
                        </p>
                        <p className="text-2xl font-bold">{value}</p>
                    </div>
                    <div className="rounded-full bg-primary/10 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
