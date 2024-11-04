"use client"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import {
    AlertCircle,
    ArrowRight,
    Building2,
    Check,
    Edit,
    Globe,
    UserCog,
} from "lucide-react"
import { useRouter } from "next/navigation"

interface RoleStatus {
    hasRole: boolean
    hasProfile: boolean
    needsProfile: boolean
}

interface RoleSelectorProps {
    nomadStatus: RoleStatus
    ownerStatus: RoleStatus
}

export function RoleSelector({ nomadStatus, ownerStatus }: RoleSelectorProps) {
    const router = useRouter()

    const hasExistingProfiles = nomadStatus.hasProfile || ownerStatus.hasProfile
    const hasIncompleteProfiles =
        (nomadStatus.hasRole && !nomadStatus.hasProfile) ||
        (ownerStatus.hasRole && !ownerStatus.hasProfile)

    return (
        <div className="flex h-full flex-col items-center justify-center px-4 py-8">
            <div className="w-full max-w-4xl space-y-8">
                {/* Header Section */}
                <div className="space-y-6 text-center">
                    <h1 className="text-4xl font-bold tracking-tight text-foreground">
                        Choose Your Role
                    </h1>
                    {(hasExistingProfiles || hasIncompleteProfiles) && (
                        <Alert className="border-primary/20 bg-primary/5">
                            <AlertDescription className="text-base font-medium text-primary">
                                {hasExistingProfiles && (
                                    <>
                                        We found your existing{" "}
                                        {[
                                            nomadStatus.hasProfile &&
                                                "Digital Nomad",
                                            ownerStatus.hasProfile &&
                                                "Hub Owner",
                                        ]
                                            .filter(Boolean)
                                            .join(" and ")}{" "}
                                        profile
                                        {nomadStatus.hasProfile &&
                                        ownerStatus.hasProfile
                                            ? "s"
                                            : ""}
                                        !
                                    </>
                                )}
                                {hasExistingProfiles &&
                                    hasIncompleteProfiles &&
                                    " However, "}
                                {hasIncompleteProfiles && (
                                    <>
                                        You need to complete your{" "}
                                        {[
                                            nomadStatus.hasRole &&
                                                !nomadStatus.hasProfile &&
                                                "Digital Nomad",
                                            ownerStatus.hasRole &&
                                                !ownerStatus.hasProfile &&
                                                "Hub Owner",
                                        ]
                                            .filter(Boolean)
                                            .join(" and ")}{" "}
                                        profile
                                        {nomadStatus.hasRole &&
                                        !nomadStatus.hasProfile &&
                                        ownerStatus.hasRole &&
                                        !ownerStatus.hasProfile
                                            ? "s"
                                            : ""}
                                        .
                                    </>
                                )}
                            </AlertDescription>
                        </Alert>
                    )}
                    <p className="mx-auto max-w-lg text-lg text-muted-foreground/80">
                        Select how you&apos;ll primarily use Pragmadic to get
                        started with your personalized experience
                    </p>
                </div>

                {/* Cards Grid */}
                <div className="grid gap-6 md:grid-cols-2">
                    {/* Nomad Card */}
                    <Card
                        onClick={() => router.push("?nomad=true")}
                        className={cn(
                            "group relative cursor-pointer overflow-hidden border-2 p-8 transition-all duration-300 hover:border-primary hover:shadow-lg",
                            nomadStatus.hasRole && "border-green-500",
                            nomadStatus.hasProfile && "bg-card/5",
                        )}
                    >
                        {nomadStatus.hasRole && (
                            <div className="absolute right-4 top-4">
                                {nomadStatus.needsProfile ? (
                                    <div className="bg-warning/10 text-warning rounded-full p-1">
                                        <UserCog className="h-4 w-4" />
                                    </div>
                                ) : nomadStatus.hasProfile ? (
                                    <div className="flex gap-2">
                                        <div className="rounded-full bg-green-500 p-1 text-primary-foreground">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <div className="rounded-full bg-primary/10 p-1 text-primary">
                                            <Edit className="h-4 w-4" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        )}
                        {nomadStatus.needsProfile && (
                            <div className="bg-warning/10 text-warning absolute inset-x-0 bottom-0 p-2 text-center text-sm">
                                Profile completion required
                            </div>
                        )}
                        {nomadStatus.hasProfile && (
                            <div className="absolute inset-x-0 bottom-0 bg-primary/10 p-2 text-center text-sm text-primary">
                                Click to edit your Digital Nomad profile
                            </div>
                        )}
                        <div className="space-y-6 py-4">
                            <div className="flex items-center justify-between">
                                <Globe className="h-12 w-12 text-primary" />
                                <ArrowRight className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold text-foreground">
                                    Digital Nomad
                                </h2>
                                <p className="text-sm leading-relaxed text-muted-foreground/80">
                                    Join vibrant hubs, connect with fellow
                                    nomads, and discover opportunities in the
                                    digital nomad community.
                                </p>
                            </div>
                            <ul className="space-y-3 text-sm text-muted-foreground/80">
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                    Join exclusive digital nomad hubs
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                    Connect with local communities
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                    Access nomad-friendly resources
                                </li>
                            </ul>
                        </div>
                    </Card>

                    {/* Hub Owner Card */}
                    <Card
                        onClick={() => router.push("?owner=true")}
                        className={cn(
                            "group relative cursor-pointer overflow-hidden border-2 p-8 transition-all duration-300 hover:border-primary hover:shadow-lg",
                            ownerStatus.hasRole && "border-green-500",
                            ownerStatus.hasProfile && "bg-card/5",
                        )}
                    >
                        {ownerStatus.hasRole && (
                            <div className="absolute right-4 top-4">
                                {ownerStatus.needsProfile ? (
                                    <div className="bg-warning/10 text-warning rounded-full p-1">
                                        <UserCog className="h-4 w-4" />
                                    </div>
                                ) : ownerStatus.hasProfile ? (
                                    <div className="flex gap-2">
                                        <div className="rounded-full bg-green-500 p-1 text-primary-foreground">
                                            <Check className="h-4 w-4" />
                                        </div>
                                        <div className="rounded-full bg-primary/10 p-1 text-primary">
                                            <Edit className="h-4 w-4" />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="rounded-full bg-green-500/10 p-1 text-green-500">
                                        <Check className="h-4 w-4" />
                                    </div>
                                )}
                            </div>
                        )}
                        {ownerStatus.needsProfile && (
                            <div className="bg-warning/10 text-warning absolute inset-x-0 bottom-0 p-2 text-center text-sm">
                                Profile completion required
                            </div>
                        )}
                        {ownerStatus.hasProfile && (
                            <div className="absolute inset-x-0 bottom-0 bg-primary/10 p-2 text-center text-sm text-primary">
                                Click to edit your Hub Owner profile
                            </div>
                        )}
                        <div className="space-y-6">
                            <div className="flex items-center justify-between">
                                <Building2 className="h-12 w-12 text-primary" />
                                <ArrowRight className="h-5 w-5 opacity-0 transition-all duration-300 group-hover:translate-x-1 group-hover:opacity-100" />
                            </div>
                            <div className="space-y-3">
                                <h2 className="text-2xl font-semibold text-foreground">
                                    Hub Owner
                                </h2>
                                <p className="text-sm leading-relaxed text-muted-foreground/80">
                                    Create and manage your own hub, build your
                                    community, and connect with digital nomads.
                                </p>
                            </div>
                            <ul className="space-y-3 text-sm text-muted-foreground/80">
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                    Create and manage your hub
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                    Engage with nomad community
                                </li>
                                <li className="flex items-center">
                                    <span className="mr-2 h-1.5 w-1.5 rounded-full bg-primary" />
                                    Track hub analytics and growth
                                </li>
                            </ul>
                        </div>
                    </Card>
                </div>

                <p className="text-center text-sm text-muted-foreground/70">
                    You can always change your role or add additional roles
                    later
                </p>
            </div>
        </div>
    )
}
