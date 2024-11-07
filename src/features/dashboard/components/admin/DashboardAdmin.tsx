"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Building2, Calendar, Users, MapPin } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

function DashboardAdminSkeleton() {
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

            {/* Stats Cards Skeleton */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {[1, 2, 3, 4].map((card) => (
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

export default function DashboardAdmin() {
    const router = useRouter()
    const supabase = useSupabaseBrowser()
    const { data: user, isPending: isUserPending } = useCurrentUser()

    const queryOptions = {
        enabled: !!user?.id,
        staleTime: 5 * 60 * 1000,
        cacheTime: 10 * 60 * 1000,
        refetchOnWindowFocus: false,
    }

    // Stats Queries
    const { count: totalUsers } = useQuery(
        supabase.from("users").select("*", { count: "exact", head: true }),
        queryOptions,
    )

    const { count: activeHubs } = useQuery(
        supabase.from("hubs").select("*", { count: "exact", head: true }),
        queryOptions,
    )

    const { count: regions } = useQuery(
        supabase.from("regions").select("*", { count: "exact", head: true }),
        queryOptions,
    )

    const { count: activeEvents } = useQuery(
        supabase.from("hub_events").select("*", { count: "exact", head: true }),
        queryOptions,
    )

    if (isUserPending) {
        return <DashboardAdminSkeleton />
    }

    return (
        <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
            <div className="flex items-center justify-between space-y-2">
                <div className="space-y-1">
                    <h2 className="text-3xl font-bold tracking-tight">
                        Admin Dashboard
                    </h2>
                    <p className="text-muted-foreground">
                        Manage and monitor the DE Rantau platform
                    </p>
                </div>
                <div className="flex items-center space-x-2">
                    <Button onClick={() => router.push("/admin/hubs")}>
                        Manage Hubs
                    </Button>
                    <Button
                        variant="outline"
                        onClick={() => router.push("/admin/regions")}
                    >
                        Manage Regions
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <Link href="/admin/users">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Total Users
                            </CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {totalUsers}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Registered platform users
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/hubs">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Hubs
                            </CardTitle>
                            <Building2 className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeHubs}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Certified DE Rantau hubs
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/events">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Active Events
                            </CardTitle>
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">
                                {activeEvents}
                            </div>
                            <p className="text-xs text-muted-foreground">
                                Upcoming hub events
                            </p>
                        </CardContent>
                    </Card>
                </Link>

                <Link href="/admin/regions">
                    <Card className="transition-all hover:bg-accent hover:text-accent-foreground">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                Regions
                            </CardTitle>
                            <MapPin className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{regions}</div>
                            <p className="text-xs text-muted-foreground">
                                Active DE Rantau regions
                            </p>
                        </CardContent>
                    </Card>
                </Link>
            </div>
        </div>
    )
}
