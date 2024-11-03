import Loading from "@/app/loading"
import { HubInviteList } from "@/components/hubs/HubInviteList"
import { Button } from "@/components/ui/button"
import { getHubById } from "@/lib/api/hubs/queries"
import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import { usersToHubs } from "@/lib/db/schema/hubs"
import { and, eq } from "drizzle-orm"
import { ArrowLeftIcon } from "lucide-react"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Suspense } from "react"
import { createHubJoinRequest } from "@/lib/api/hubs/mutations"
import { createHubJoinRequestAction } from "@/lib/actions/hubs"
import JoinButton from "@/components/user-to-hubs/join-button"

export const revalidate = 0

export default async function HubInvitesPage(props: {
    params: Promise<{ hubId: string }>
}) {
    const params = await props.params
    const { session } = await getUserAuth()
    if (!session) {
        return <div>Please log in to view invites.</div>
    }

    const { hub } = await getHubById(params.hubId)
    if (!hub) notFound()

    const isOwner = hub.userId === session.user.id

    const membership = await db.query.usersToHubs.findFirst({
        where: and(
            eq(usersToHubs.hub_id, params.hubId),
            eq(usersToHubs.user_id, session.user.id),
        ),
    })

    return (
        <main className="overflow-auto">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <div className="mb-4">
                    <Button variant="link" asChild>
                        <Link href={`/hubs/${params.hubId}`}>
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            <h1 className="text-3xl font-bold">
                                Return to Hub
                            </h1>
                        </Link>
                    </Button>
                </div>
                {isOwner ? (
                    <Suspense fallback={<Loading />}>
                        <HubInviteList hubId={params.hubId} />
                    </Suspense>
                ) : membership ? (
                    <Suspense fallback={<Loading />}>
                        <HubInviteList hubId={params.hubId} />
                    </Suspense>
                ) : (
                    <JoinButton hubId={params.hubId} />
                )}
            </div>
        </main>
    )
}
