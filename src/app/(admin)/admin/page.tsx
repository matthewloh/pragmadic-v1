import { AdminDashboard } from "@/components/AdminDashboard"
import AdminSkeleton from "@/components/AdminSkeleton"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { getUsers } from "@/lib/api/users/queries"
import { Suspense } from "react"

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
    const { users } = await getUsers()

    return <AdminDashboard initialUsers={users} />
}
