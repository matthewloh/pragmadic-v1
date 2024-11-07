import { notFound } from "next/navigation"
import { Suspense } from "react"

import Loading from "@/app/loading"
import { HubTabs } from "@/components/hubs/HubTabs"
import { getEventsByHubId } from "@/lib/api/events/queries"
import {
    getAllHubUsersById,
    getHubByIdWithOwnerProfile,
} from "@/lib/api/hubs/queries"
import { getReviewsByHubId } from "@/lib/api/reviews/queries"
import { getStates } from "@/lib/api/states/queries"
import { getUserAuth } from "@/lib/auth/utils"
import OptimisticHub from "./OptimisticHub"

export const revalidate = 0

export default async function HubPage(props: {
    params: Promise<{ hubId: string }>
    searchParams: Promise<{ tab: string }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    return (
        <main className="flex h-full w-full flex-1 flex-col">
            <Suspense fallback={<Loading />}>
                <Hub id={params.hubId} tab={searchParams.tab} />
            </Suspense>
        </main>
    )
}

async function Hub({ id, tab }: { id: string; tab: string }) {
    const { session } = await getUserAuth()
    const { hub } = await getHubByIdWithOwnerProfile(id)
    if (!hub) notFound()
    const { user: ownerUserProfile, hubOwnerProfile } = hub
    const { states } = await getStates()
    const { events: eventsByHubId } = await getEventsByHubId(id)
    const { reviews: reviewsByHubId } = await getReviewsByHubId(id)
    const { users: usersToHub } = await getAllHubUsersById(id)

    return (
        <div className="flex h-full w-full flex-1 flex-col space-y-8">
            <div className="flex-1 rounded-xl border bg-gradient-to-br from-card to-muted/50 p-6 shadow-lg">
                <OptimisticHub
                    hub={hub}
                    states={states}
                    stateId={hub.stateId}
                />
                <HubTabs
                    hub={hub}
                    ownerUserProfile={ownerUserProfile}
                    hubOwnerProfile={hubOwnerProfile}
                    events={eventsByHubId}
                    reviews={reviewsByHubId}
                    usersToHub={usersToHub}
                    tab={tab}
                />
            </div>
        </div>
    )
}
