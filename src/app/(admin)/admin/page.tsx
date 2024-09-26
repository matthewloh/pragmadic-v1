import { Suspense } from "react"
import { getUsers } from "@/lib/api/users/queries"
import { AdminDashboard } from "@/components/AdminDashboard"
import { ErrorBoundary } from "@/components/ErrorBoundary"
import { LoadingSpinner } from "@/components/LoadingSpinner"

export default async function AdminPage() {
    return (
        <ErrorBoundary>
            <Suspense fallback={<LoadingSpinner />}>
                <AdminPageContent />
            </Suspense>
        </ErrorBoundary>
    )
}

async function AdminPageContent() {
    const { users } = await getUsers()

    return <AdminDashboard initialUsers={users} />
}
