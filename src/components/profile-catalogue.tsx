"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    User,
    Building2,
    ShieldCheck,
    ChevronRight,
    PlusIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import Modal from "@/components/shared/Modal"
import { useOptimisticProfile } from "@/app/(app)/(profile)/profile/useOptimisticProfile"
import { useOptimisticHubOwnerProfile } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles"
import { useOptimisticDerantauAdminProfiles } from "@/app/(app)/derantau-admin-profile/useOptimisticDerantauAdminProfile"
import { Profile, CompleteProfile } from "@/lib/db/schema/profile"
import {
    HubOwnerProfile,
    CompleteHubOwnerProfile,
} from "@/lib/db/schema/hubOwnerProfiles"
import {
    DerantauAdminProfile,
    CompleteDerantauAdminProfile,
} from "@/lib/db/schema/derantauAdminProfile"
import { Region, RegionId } from "@/lib/db/schema/regions"
import ProfileForm from "./profile/ProfileForm"
import HubOwnerProfileForm from "./hubOwnerProfiles/HubOwnerProfileForm"
import DerantauAdminProfileForm from "./derantauAdminProfile/DerantauAdminProfileForm"
import Link from "next/link"
import { RoleType } from "@/lib/auth/get-user-role"

type ProfileType = "regular" | "owner" | "admin"

type ProfileCatalogueProps = {
    user_roles: RoleType[]
    regularProfile?: CompleteProfile
    hubOwnerProfile?: CompleteHubOwnerProfile
    derantauAdminProfiles?: CompleteDerantauAdminProfile[]
    regions?: Region[]
    regionId?: RegionId | undefined
}

export default function ProfileCatalogue({
    user_roles,
    regularProfile,
    hubOwnerProfile,
    derantauAdminProfiles,
    regions,
    regionId,
}: ProfileCatalogueProps) {
    const [activeProfileType, setActiveProfileType] =
        useState<ProfileType>("regular")
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [activeProfile, setActiveProfile] = useState<any>(null)

    const { optimisticProfile, addOptimisticProfile } =
        useOptimisticProfile(regularProfile)
    const { optimisticHubOwnerProfile, addOptimisticHubOwnerProfile } =
        useOptimisticHubOwnerProfile(hubOwnerProfile)
    const {
        optimisticDerantauAdminProfiles,
        addOptimisticDerantauAdminProfile,
    } = useOptimisticDerantauAdminProfiles(
        derantauAdminProfiles || [],
        regions || [],
    )

    const openModal = (profileType: ProfileType, profile?: any) => {
        setActiveProfileType(profileType)
        setActiveProfile(profile)
        setIsModalOpen(true)
    }

    const closeModal = () => {
        setIsModalOpen(false)
        setActiveProfile(null)
    }

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
            },
        },
    }

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
            },
        },
    }

    const ProfileIcon = ({ type }: { type: ProfileType }) => {
        switch (type) {
            case "regular":
                return <User className="h-6 w-6" />
            case "owner":
                return <Building2 className="h-6 w-6" />
            case "admin":
                return <ShieldCheck className="h-6 w-6" />
        }
    }

    const ProfileCard = ({
        type,
        profile,
        onManage,
    }: {
        type: ProfileType
        profile: any
        onManage: () => void
    }) => {
        const [isExpanded, setIsExpanded] = useState(false)

        return (
            <motion.div variants={itemVariants}>
                <Card
                    className={`w-full transition-all duration-300 ${isExpanded ? "bg-primary/5" : ""}`}
                >
                    <CardHeader
                        className="cursor-pointer"
                        onClick={() => setIsExpanded(!isExpanded)}
                    >
                        <CardTitle className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <ProfileIcon type={type} />
                                {type.charAt(0).toUpperCase() +
                                    type.slice(1)}{" "}
                                Profile
                            </div>
                            <Badge variant="secondary">Active</Badge>
                        </CardTitle>
                        <CardDescription>
                            {getProfileDescription(type)}
                        </CardDescription>
                    </CardHeader>
                    {isExpanded && (
                        <CardContent>
                            <ProfileDetails type={type} profile={profile} />
                        </CardContent>
                    )}
                    <CardFooter className="flex justify-between p-2">
                        <Button variant="outline" onClick={onManage}>
                            Manage Profile
                        </Button>
                        <Link href={`/profile/${profile.id}`}>
                            Go to Profile
                        </Link>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setIsExpanded(!isExpanded)}
                        >
                            <ChevronRight
                                className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`}
                            />
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        )
    }

    const getProfileDescription = (type: ProfileType) => {
        switch (type) {
            case "regular":
                return "Your digital nomad profile"
            case "owner":
                return "Your DE Rantau Hub Owner profile"
            case "admin":
                return "Your DE Rantau administrative profile"
        }
    }

    const ProfileDetails = ({
        type,
        profile,
    }: {
        type: ProfileType
        profile: any
    }) => {
        switch (type) {
            case "regular":
                return (
                    <div className="space-y-2">
                        <p>
                            <strong>Bio:</strong> {profile.bio}
                        </p>
                        <p>
                            <strong>Occupation:</strong>{" "}
                            {profile.occupation || "Not specified"}
                        </p>
                        <p>
                            <strong>Location:</strong>{" "}
                            {profile.location || "Not specified"}
                        </p>
                        <p>
                            <strong>Website:</strong> {profile.website}
                        </p>
                        <Link href={`/profile/${profile.id}`} />
                    </div>
                )
            case "owner":
                return (
                    <div className="space-y-2">
                        <p>
                            <strong>Company Name:</strong>{" "}
                            {profile.companyName || "Not specified"}
                        </p>
                        <p>
                            <strong>Business Email:</strong>{" "}
                            {profile.businessEmail}
                        </p>
                        <p>
                            <strong>Business Location:</strong>{" "}
                            {profile.businessLocation}
                        </p>
                        <p>
                            <strong>Website:</strong>{" "}
                            {profile.websiteUrl || "Not specified"}
                        </p>
                    </div>
                )
            case "admin":
                return (
                    <div className="space-y-2">
                        <p>
                            <strong>Department:</strong> {profile.department}
                        </p>
                        <p>
                            <strong>Position:</strong> {profile.position}
                        </p>
                        <p>
                            <strong>Admin Level:</strong> {profile.adminLevel}
                        </p>
                        <p>
                            <strong>Region:</strong>{" "}
                            {regions?.find((r) => r.id === profile.regionId)
                                ?.name || "Not specified"}
                        </p>
                    </div>
                )
        }
    }

    const EmptyState = ({
        type,
        onCreateNew,
    }: {
        type: ProfileType
        onCreateNew: () => void
    }) => {
        return (
            <div className="p-6 text-center">
                <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                    No {type} profile
                </h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    Get started by creating a new {type} profile.
                </p>
                <div className="mt-6">
                    <Button onClick={onCreateNew}>
                        <PlusIcon className="mr-2 h-4 w-4" />
                        New {type.charAt(0).toUpperCase() + type.slice(1)}{" "}
                        Profile
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <ScrollArea className="h-full w-full rounded-md">
            <Modal
                open={isModalOpen}
                setOpen={setIsModalOpen}
                title={
                    activeProfile
                        ? `Edit ${activeProfileType.charAt(0).toUpperCase() + activeProfileType.slice(1)} Profile`
                        : `Create ${activeProfileType.charAt(0).toUpperCase() + activeProfileType.slice(1)} Profile`
                }
            >
                {activeProfileType === "regular" && (
                    <ProfileForm
                        profile={activeProfile}
                        addOptimistic={addOptimisticProfile}
                        closeModal={closeModal}
                    />
                )}
                {activeProfileType === "owner" && (
                    <HubOwnerProfileForm
                        hubOwnerProfile={activeProfile}
                        addOptimistic={addOptimisticHubOwnerProfile}
                        closeModal={closeModal}
                    />
                )}
                {activeProfileType === "admin" && (
                    <DerantauAdminProfileForm
                        derantauAdminProfile={activeProfile}
                        addOptimistic={addOptimisticDerantauAdminProfile}
                        closeModal={closeModal}
                        regions={regions || []}
                        regionId={regionId}
                    />
                )}
            </Modal>
            <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="mx-auto grid max-w-2xl gap-6"
            >
                {optimisticProfile ? (
                    <ProfileCard
                        type="regular"
                        profile={optimisticProfile}
                        onManage={() => openModal("regular", optimisticProfile)}
                    />
                ) : (
                    <EmptyState
                        type="regular"
                        onCreateNew={() => openModal("regular")}
                    />
                )}
                {user_roles.includes("owner") &&
                    (optimisticHubOwnerProfile ? (
                        <ProfileCard
                            type="owner"
                            profile={optimisticHubOwnerProfile}
                            onManage={() =>
                                openModal("owner", optimisticHubOwnerProfile)
                            }
                        />
                    ) : (
                        <EmptyState
                            type="owner"
                            onCreateNew={() => openModal("owner")}
                        />
                    ))}
                {user_roles.includes("admin") &&
                    (optimisticDerantauAdminProfiles &&
                    optimisticDerantauAdminProfiles.length > 0 ? (
                        optimisticDerantauAdminProfiles.map((profile) => (
                            <ProfileCard
                                key={profile.id}
                                type="admin"
                                profile={profile}
                                onManage={() => openModal("admin", profile)}
                            />
                        ))
                    ) : (
                        <EmptyState
                            type="admin"
                            onCreateNew={() => openModal("admin")}
                        />
                    ))}
            </motion.div>
        </ScrollArea>
    )
}
