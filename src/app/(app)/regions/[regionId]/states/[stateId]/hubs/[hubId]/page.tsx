import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticHub from "@/app/(app)/hubs/[hubId]/OptimisticHub"
import EventList from "@/components/events/EventList"
import ReviewList from "@/components/reviews/ReviewList"
import {
    getAllHubUsersById,
    getHubByIdWithEventsAndReviewsAndInvites,
    getHubByIdWithOwnerProfile,
} from "@/lib/api/hubs/queries"
import { getStates } from "@/lib/api/states/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { getUserRole, RoleType } from "@/lib/auth/get-user-role"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, CalendarIcon, StarIcon } from "lucide-react"
import { getEventsByHubId } from "@/lib/api/events/queries"
import { getReviewsByHubId } from "@/lib/api/reviews/queries"
import { HubTabs } from "@/components/hubs/HubTabs"

export const revalidate = 0

export default async function HubPage(props: {
    params: Promise<{ hubId: string }>
    searchParams: Promise<{ tab: string }>
}) {
    const params = await props.params
    const searchParams = await props.searchParams
    return (
        <main className="container mx-auto h-full w-full">
            <Suspense fallback={<Loading />}>
                <Hub id={params.hubId} tab={searchParams.tab} />
            </Suspense>
        </main>
    )
}

const Hub = async ({ id, tab }: { id: string; tab: string }) => {
    const { hub } = await getHubByIdWithOwnerProfile(id)
    if (!hub) notFound()
    const { user: ownerUserProfile, hubOwnerProfile } = hub
    const { states } = await getStates()
    const { events: eventsByHubId } = await getEventsByHubId(id)
    const { reviews: reviewsByHubId } = await getReviewsByHubId(id)
    const { users: usersToHub } = await getAllHubUsersById(id)

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
