import { LoadingPage } from "@/components/shared/loading"
import { GetStartedForm } from "@/features/getting-started/components/GetStartedForm"
import { GettingStartedOwnerProfileForm } from "@/features/getting-started/components/HubOwnerProfileForm"
import { GettingStartedNomadProfileForm } from "@/features/getting-started/components/NomadProfileForm"
import { RoleSelector } from "@/features/getting-started/components/RoleSelector"
import { getUserRole } from "@/lib/auth/get-user-role"
import { db } from "@/lib/db"
import {
    hubOwnerProfiles,
    nomadProfile as nomadProfileTable,
    profile as profileTable,
} from "@/lib/db/schema"
import { userRoles, users } from "@/lib/db/schema/users"
import { eq } from "drizzle-orm"
import { notFound, redirect } from "next/navigation"
import { Suspense } from "react"
import { BackButton } from "@/features/getting-started/components/BackButton"

export default async function GettingStartedPage(props: {
    searchParams: Promise<{ [key: string]: string | undefined }>
}) {
    const searchParams = await props.searchParams
    const { session } = await getUserRole()
    if (!session) {
        return redirect("/auth")
    }

    // Get user profile data
    const userProfile = await db.query.users.findFirst({
        where: eq(users.id, session.user.id),
    })

    // Get all profile types
    const [baseProfile, nomadProfile, ownerProfile] = await Promise.all([
        db.query.profile.findFirst({
            where: eq(profileTable.userId, session.user.id),
        }),
        db.query.nomadProfile.findFirst({
            where: eq(nomadProfileTable.userId, session.user.id),
        }),
        db.query.hubOwnerProfiles.findFirst({
            where: eq(hubOwnerProfiles.userId, session.user.id),
        }),
    ])
    const user_role_data = await db.query.userRoles.findMany({
        where: eq(userRoles.userId, session.user.id),
    })

    if (!userProfile) {
        notFound()
    }

    // Check roles and profile completion status
    const hasNomadRole = user_role_data.some((role) => role.role === "nomad")
    const hasOwnerRole = user_role_data.some((role) => role.role === "owner")

    // Profile completion checks
    const hasBaseProfile = baseProfile !== undefined
    const hasNomadProfile = nomadProfile !== undefined
    const hasOwnerProfile = ownerProfile !== undefined
    // Combined status for each role
    const nomadStatus = {
        hasRole: hasNomadRole,
        hasProfile: hasNomadProfile,
        needsProfile: hasNomadRole && !hasNomadProfile,
    }

    const ownerStatus = {
        hasRole: hasOwnerRole,
        hasProfile: hasOwnerProfile,
        needsProfile: hasOwnerRole && !hasOwnerProfile,
    }

    // Helper functions to determine step states
    const isReset = searchParams.reset === "true"
    const isBasicInfoIncomplete =
        userProfile.display_name === "[redacted]" || !userProfile.image_url
    const hasBasicInfo =
        userProfile.display_name !== "[redacted]" && !!userProfile.image_url
    const hasSelectedRole = !!searchParams.nomad || !!searchParams.owner
    const isSelectingRole = !hasSelectedRole && hasBasicInfo && !isReset

    return (
        <div className="relative min-h-screen bg-gradient-to-b from-background to-background/80">
            {/* Background Pattern */}
            <div className="bg-grid-white/[0.02] absolute inset-0 bg-[size:60px_60px]" />

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/80" />

            {/* Content */}
            <div className="relative">
                {/* Progress Steps */}
                <div className="mx-auto max-w-2xl pt-8">
                    <div className="flex justify-center space-x-8">
                        <Step
                            number={1}
                            title="Basic Info"
                            active={isBasicInfoIncomplete || isReset}
                            completed={hasBasicInfo && !isReset}
                        />
                        <Step
                            number={2}
                            title="Choose Role"
                            active={isSelectingRole}
                            completed={hasSelectedRole}
                        />
                        <Step
                            number={3}
                            title="Complete Profile"
                            active={hasSelectedRole}
                            completed={false}
                        />
                    </div>
                </div>

                {/* Main Content */}
                <Suspense fallback={<LoadingPage />}>
                    <div className="container mx-auto px-4 py-8">
                        {isBasicInfoIncomplete || isReset ? (
                            <div className="mx-auto max-w-3xl">
                                <GetStartedForm
                                    user={userProfile}
                                    profile={baseProfile}
                                />
                            </div>
                        ) : !hasSelectedRole ? (
                            <div className="mx-auto max-w-4xl space-y-6">
                                <BackButton
                                    href="/getting-started"
                                    query={{ reset: "true" }}
                                    label="Back to Basic Info"
                                />
                                <RoleSelector
                                    nomadStatus={nomadStatus}
                                    ownerStatus={ownerStatus}
                                />
                            </div>
                        ) : (
                            <div className="mx-auto max-w-4xl space-y-6">
                                <BackButton
                                    href="/getting-started"
                                    query={{}}
                                    label="Back to Role Selection"
                                />
                                {searchParams.nomad ? (
                                    <GettingStartedNomadProfileForm
                                        userId={session.user.id}
                                    />
                                ) : (
                                    <GettingStartedOwnerProfileForm
                                        userId={session.user.id}
                                    />
                                )}
                            </div>
                        )}
                    </div>
                </Suspense>

                {/* Decorative Elements */}
                <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[500px] w-[500px] animate-pulse rounded-full bg-primary/5 blur-3xl" />
                </div>
            </div>
        </div>
    )
}

interface StepProps {
    number: number
    title: string
    active: boolean
    completed: boolean
}

// Step Component
function Step({ number, title, active, completed }: StepProps) {
    return (
        <div className="flex flex-col items-center space-y-2">
            <div
                className={`flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-200 ${
                    completed
                        ? "border-primary bg-primary text-primary-foreground"
                        : active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-muted bg-muted/50 text-muted-foreground"
                }`}
            >
                {completed ? (
                    <svg
                        className="h-6 w-6"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                        />
                    </svg>
                ) : (
                    <span className="text-sm font-medium">{number}</span>
                )}
            </div>
            <span
                className={`text-sm font-medium ${
                    active ? "text-primary" : "text-muted-foreground"
                }`}
            >
                {title}
            </span>
        </div>
    )
}
