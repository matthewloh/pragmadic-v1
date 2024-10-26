import { AdminUsersDashboard } from "@/components/AdminUsersDashboard"
import AdminSkeleton from "@/components/AdminSkeleton"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { getUsersWithRoles } from "@/features/admin/api/queries"
import { Suspense } from "react"
import { createClient } from "@/utils/supabase/server"

export const revalidate = 0

export default async function AdminUsersPage() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<AdminSkeleton />}>
                <AdminUsersPageContent />
            </Suspense>
        </ErrorBoundary>
    )
}

async function AdminUsersPageContent() {
    const supabase = await createClient({ admin: true })
    const usersWithRoles = await getUsersWithRoles(supabase)

    // Transform the data to flatten the roles
    const transformedUsers = usersWithRoles.map((user) => ({
        id: user.id,
        email: user.email,
        display_name: user.display_name,
        created_at: user.created_at || undefined, // Convert null to undefined
        roles: user.user_roles?.map((ur) => ur.role) || [],
    }))

    return <AdminUsersDashboard initialUsers={transformedUsers} />
}
