import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticHub from "@/app/(app)/hubs/[hubId]/OptimisticHub"
import EventList from "@/components/events/EventList"
import ReviewList from "@/components/reviews/ReviewList"
import { getHubByIdWithEventsAndReviewsAndInvites } from "@/lib/api/hubs/queries"
import { getStates } from "@/lib/api/states/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { getUserRole, RoleType } from "@/lib/auth/get-user-role"

export const revalidate = 0

export default async function HubPage(props: {
    params: Promise<{ hubId: string }>
}) {
    const params = await props.params
    const { user_roles } = await getUserRole()
    return (
        <main className="container mx-auto h-full w-full">
            <Hub id={params.hubId} user_roles={user_roles} />
        </main>
    )
}

const Hub = async ({
    id,
    user_roles,
}: {
    id: string
    user_roles: RoleType[]
}) => {
    const { hub, events, reviews } =
        await getHubByIdWithEventsAndReviewsAndInvites(id)
    const { states } = await getStates()

    if (!hub) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="hubs" />
                <OptimisticHub
                    hub={hub}
                    states={states}
                    stateId={hub.stateId}
                />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {hub.name}&apos;s Events
                </h3>
                <EventList hubs={[]} hubId={hub.id} events={events} />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {hub.name}&apos;s Reviews
                </h3>
                <ReviewList hubs={[]} hubId={hub.id} reviews={reviews} />
            </div>
        </Suspense>
    )
}
