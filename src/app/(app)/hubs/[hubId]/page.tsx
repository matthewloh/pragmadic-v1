import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticHub from "@/app/(app)/hubs/[hubId]/OptimisticHub"
import EventList from "@/components/events/EventList"
import ReviewList from "@/components/reviews/ReviewList"
import { getHubByIdWithEventsAndReviews } from "@/lib/api/hubs/queries"
import { getStates } from "@/lib/api/states/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function HubPage({
    params,
}: {
    params: { hubId: string }
}) {
    return (
        <main className="overflow-auto">
            <Hub id={params.hubId} />
        </main>
    )
}

const Hub = async ({ id }: { id: string }) => {
    const { hub, events, reviews } = await getHubByIdWithEventsAndReviews(id)
    const { states } = await getStates()

    if (!hub) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="hubs" />
                <OptimisticHub hub={hub} states={states} />
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
