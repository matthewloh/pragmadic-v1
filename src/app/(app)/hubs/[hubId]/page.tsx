import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticHub from "./OptimisticHub"
import { HubTabs } from "@/components/hubs/HubTabs"
import { getHubByIdWithEventsAndReviewsAndInvites } from "@/lib/api/hubs/queries"
import { getStates } from "@/lib/api/states/queries"
import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { getUserRole } from "@/lib/auth/get-user-role"
import { getUser } from "@/lib/api/users/queries"

export const revalidate = 0

export default async function HubPage(props: {
    params: Promise<{ hubId: string }>
    searchParams: Promise<{ tab: string }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    return (
        <main className="flex flex-1 flex-col">
            <Suspense fallback={<Loading />}>
                <Hub id={params.hubId} tab={searchParams.tab} />
            </Suspense>
        </main>
    )
}

async function Hub({ id, tab }: { id: string; tab: string }) {
    const { hub, events, reviews, invites } =
        await getHubByIdWithEventsAndReviewsAndInvites(id)
    const { states } = await getStates()

    if (!hub) notFound()

    return (
        <div className="flex flex-1 flex-col space-y-8">
            <div className="flex-1 rounded-xl border bg-gradient-to-br from-card to-muted/50 p-6 shadow-lg">
                <OptimisticHub
                    hub={hub}
                    states={states}
                    stateId={hub.stateId}
                />
                <HubTabs
                    hub={hub}
                    events={events}
                    reviews={reviews}
                    invites={invites}
                    tab={tab}
                />
            </div>
        </div>
    )
}
