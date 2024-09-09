import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticEvent from "@/app/(app)/events/[eventId]/OptimisticEvent"
import { getEventById } from "@/lib/api/events/queries"
import { getHubs } from "@/lib/api/hubs/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function EventPage({
    params,
}: {
    params: { eventId: string }
}) {
    return (
        <main className="overflow-auto">
            <Event id={params.eventId} />
        </main>
    )
}

const Event = async ({ id }: { id: string }) => {
    const { event } = await getEventById(id)
    const { hubs } = await getHubs()

    if (!event) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="events" />
                <OptimisticEvent
                    event={event}
                    hubs={hubs}
                    hubId={event.hubId}
                />
            </div>
        </Suspense>
    )
}
