import { Suspense } from "react"
import { UserInviteHubList } from "@/components/hubs/UserInviteHubList"
import Loading from "@/app/loading"
import { getUserAuth } from "@/lib/auth/utils"
import { CompleteHub } from "@/lib/db/schema"

export const revalidate = 0

export default async function InvitesPage() {
    const { session } = await getUserAuth()
    if (!session) {
        return <div>Please log in to view your invites.</div>
    }
    const { roles } = session
    if (!roles.includes("owner")) {
        return <div>You are not an owner.</div>
    }

    return (
        <main className="overflow-auto">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <h1 className="mb-4 text-3xl font-bold">Manage Invites</h1>
                <Suspense fallback={<Loading />}>
                    {/* TODO: probably rethink this */}
                    <UserInviteHubList invites={[]} hub={{} as CompleteHub} />
                </Suspense>
            </div>
        </main>
    )
}
