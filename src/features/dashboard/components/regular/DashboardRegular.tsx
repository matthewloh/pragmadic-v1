"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { BookOpen, Calendar, Compass, Users, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useUser } from "@/features/auth/hooks/use-current-user"
import { Skeleton } from "@/components/ui/skeleton"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
    ProfileRow,
    NomadProfileRow,
    HubOwnerProfileRow,
    UsersToHubRow,
    UsersToCommunityRow,
} from "@/utils/supabase/types"

// Constants
const ONBOARDING_STEPS = [
    {
        id: 1,
        title: "Complete Profile",
        path: "/getting-started",
        checkCompletion: (data: { profile: ProfileRow | null }) =>
            !!data.profile?.bio && !!data.profile?.location,
    },
    {
        id: 2,
        title: "Choose Roles",
        path: "/getting-started",
        checkCompletion: (data: {
            nomadProfile: NomadProfileRow | null
            hubOwnerProfile: HubOwnerProfileRow | null
        }) => !!data.nomadProfile || !!data.hubOwnerProfile,
    },
    {
        id: 3,
        title: "Explore Hubs",
        path: "/onboarding/map",
        checkCompletion: (data: { usersToHub: UsersToHubRow[] | null }) =>
            !!data.usersToHub,
    },
    {
        id: 4,
        title: "Join Community",
        path: "/communities",
        checkCompletion: (data: {
            usersToCommunity: UsersToCommunityRow[] | null
        }) => !!data.usersToCommunity,
    },
] as const

function DashboardRegularSkeleton() {
    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            {/* Header Section Skeleton */}
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-2">
                    <Skeleton className="h-8 w-[250px]" />
                    <Skeleton className="h-4 w-[350px]" />
                </div>
                <Skeleton className="h-10 w-[120px]" />
            </div>

            {/* Onboarding Progress Card Skeleton */}
            <div className="space-y-4 rounded-lg border-2 border-primary/20 p-6">
                <Skeleton className="h-6 w-[140px]" />
                <Skeleton className="h-2 w-full" />
                <div className="space-y-3">
                    {[1, 2, 3, 4, 5].map((step) => (
                        <div
                            key={step}
                            className="flex items-center justify-between"
                        >
                            <div className="flex items-center space-x-2">
                                <Skeleton className="h-4 w-4 rounded-full" />
                                <Skeleton className="h-4 w-[120px]" />
                            </div>
                            <Skeleton className="h-8 w-[60px]" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {[1, 2, 3].map((card) => (
                    <div key={card} className="space-y-4 rounded-lg border p-6">
                        <div className="flex items-center justify-between">
                            <Skeleton className="h-4 w-[100px]" />
                            <Skeleton className="h-4 w-4 rounded-full" />
                        </div>
                        <div className="space-y-2">
                            <Skeleton className="h-8 w-[60px]" />
                            <Skeleton className="h-4 w-[140px]" />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default function DashboardRegular() {
    const router = useRouter()
    const supabase = useSupabaseBrowser()
    const { data: user, isPending: isUserPending } = useUser()
    // Common query options to prevent excessive refetching
    const queryOptions = {
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000, // Consider data fresh for 5 minutes
        cacheTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch when window regains focus
    }
    // Profile Queries
    const { data: profile, isPending: isProfilePending } = useQuery<ProfileRow>(
        supabase
            .from("profile")
            .select("*")
            .eq("user_id", user?.id || "")
            .maybeSingle(),
        queryOptions,
    )

    const { data: nomadProfile, isPending: isNomadPending } =
        useQuery<NomadProfileRow>(
            supabase
                .from("nomad_profile")
                .select("*")
                .eq("user_id", user?.id || "")
                .maybeSingle(),
            queryOptions,
        )

    const { data: hubOwnerProfile, isPending: isOwnerPending } =
        useQuery<HubOwnerProfileRow>(
            supabase
                .from("hub_owner_profiles")
                .select("*")
                .eq("user_id", user?.id || "")
                .maybeSingle(),
            queryOptions,
        )

    const { data: usersToHub, isPending: isUsersToHubPending } = useQuery<
        UsersToHubRow[]
    >(
        supabase
            .from("users_to_hubs")
            .select("*")
            .eq("user_id", user?.id || ""),
        queryOptions,
    )

    const { data: usersToCommunity, isPending: isUsersToCommunityPending } =
        useQuery<UsersToCommunityRow[]>(
            supabase
                .from("users_to_communities")
                .select("*")
                .eq("user_id", user?.id || ""),
            queryOptions,
        )

    // Stats Queries
    const { count: totalHubs } = useQuery(
        supabase.from("hubs").select("*", { count: "exact", head: true }),
        queryOptions,
    )

    const { count: upcomingEvents } = useQuery(
        supabase.from("hub_events").select("*", { count: "exact", head: true }),
        queryOptions,
    )
    const { count: activeNomads } = useQuery(
        supabase
            .from("nomad_profile")
            .select("*", { count: "exact", head: true }),
        queryOptions,
    )

    if (
        isUserPending ||
        isProfilePending ||
        isNomadPending ||
        isOwnerPending ||
        isUsersToHubPending ||
        isUsersToCommunityPending
    ) {
        return <DashboardRegularSkeleton />
    }

    // Calculate completed steps
    const completedSteps = ONBOARDING_STEPS.filter((step) => {
        const isProfileValid = profile !== undefined && profile !== null
        const isNomadProfileValid =
            nomadProfile !== undefined && nomadProfile !== null
        const isHubOwnerProfileValid =
            hubOwnerProfile !== undefined && hubOwnerProfile !== null

        return step.checkCompletion({
            profile: isProfileValid ? profile : null,
            nomadProfile: isNomadProfileValid ? nomadProfile : null,
            hubOwnerProfile: isHubOwnerProfileValid ? hubOwnerProfile : null,
            usersToHub: usersToHub || null,
            usersToCommunity: usersToCommunity || null,
        })
    }).map((step) => step.id)

    const progress = (completedSteps.length / ONBOARDING_STEPS.length) * 100
    const nextStep = ONBOARDING_STEPS.find(
        (step) => !completedSteps.includes(step.id),
    )

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Welcome to Pragmadic
                        {user?.display_name
                            ? `, ${user.display_name}`
                            : " to DE Rantau"}
                    </h2>
                    <p className="text-muted-foreground">
                        Let&apos;s get you started with your journey in the DE
                        Rantau Network in Penang
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    {nextStep ? (
                        <Button
                            onClick={() => router.push(nextStep.path)}
                            className="bg-primary"
                        >
                            Continue Setup
                        </Button>
                    ) : (
                        <Button onClick={() => router.push("/onboarding/map")}>
                            Explore Hubs
                        </Button>
                    )}
                </div>
            </div>

            {/* Onboarding Progress Card */}
            <Card className="border-2 border-primary/20">
                <CardHeader>
                    <CardTitle className="text-lg">Getting Started</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Progress value={progress} className="h-2" />
                    <div className="space-y-2">
                        {ONBOARDING_STEPS.map((step) => (
                            <div
                                key={step.id}
                                className="flex items-center justify-between"
                            >
                                <span className="flex items-center space-x-2">
                                    <CheckCircle2
                                        className={`h-4 w-4 ${
                                            completedSteps.includes(step.id)
                                                ? "text-primary"
                                                : "text-muted-foreground"
                                        }`}
                                    />
                                    <span className="text-sm">
                                        {step.title}
                                    </span>
                                </span>
                                {!completedSteps.includes(step.id) && (
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(step.path)}
                                    >
                                        Start
                                    </Button>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                <Link href="/onboarding/map">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Available Hubs
                            </CardTitle>
                            <Compass className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalHubs}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                DE Rantau certified hubs in Penang
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/onboarding/events">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Events
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {upcomingEvents}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upcoming events
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/communities">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Nomads
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeNomads}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Digital nomads in Penang
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
