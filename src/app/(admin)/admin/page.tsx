import { AdminDashboard } from "@/components/AdminDashboard"
import AdminSkeleton from "@/components/AdminSkeleton"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { getUserRolesQuery } from "@/lib/api/users/client_queries"
import { getUsers } from "@/lib/api/users/queries"
import { createClient } from "@/utils/supabase/server"
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query"
import {
    dehydrate,
    HydrationBoundary,
    QueryClient,
} from "@tanstack/react-query"
import { Suspense } from "react"
import Loading from "./loading"

export default async function AdminPage() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<AdminSkeleton />}>
                <AdminPageContent />
            </Suspense>
        </ErrorBoundary>
    )
}

async function AdminPageContent() {
    const queryClient = new QueryClient()
    const supabase = createClient()
    await prefetchQuery(queryClient, getUserRolesQuery(supabase))
    const { users } = await getUsers()

    return (
        <HydrationBoundary state={dehydrate(queryClient)}>
            <AdminDashboard initialUsers={users} />
        </HydrationBoundary>
    )
}
