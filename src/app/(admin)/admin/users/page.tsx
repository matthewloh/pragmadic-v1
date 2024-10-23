import { AdminUsersDashboard } from "@/components/AdminUsersDashboard"
import AdminSkeleton from "@/components/AdminSkeleton"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { getUsers } from "@/lib/api/users/queries"
import { Suspense } from "react"

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
    const { users } = await getUsers()

    return <AdminUsersDashboard initialUsers={users} />
}
