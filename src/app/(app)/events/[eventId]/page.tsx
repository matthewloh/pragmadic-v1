import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticEvent from "@/app/(app)/events/[eventId]/OptimisticEvent"
import {
    getEventById,
    getParticipantsByEventId,
} from "@/lib/api/events/queries"
import { getHubs, getHubUsersById } from "@/lib/api/hubs/queries"
import { getHubUsers } from "@/lib/api/hubs/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { getEventMarkerByEventId } from "@/features/onboarding/map/hub/queries"

export const revalidate = 0

export default async function EventPage(props: {
    params: Promise<{ eventId: string }>
}) {
    const params = await props.params
    return (
        <main className="container mx-auto h-full w-full overflow-auto">
            <Event id={params.eventId} />
        </main>
    )
}

const Event = async ({ id }: { id: string }) => {
    const { event } = await getEventById(id)
    const { hubs } = await getHubs()
    if (!event) notFound()

    // Fetch hub users
    const { users: hubUsers } = await getHubUsersById(event.hubId)
    const marker = await getEventMarkerByEventId(id)
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="events" />
                <OptimisticEvent
                    event={event}
                    hubs={hubs}
                    hubUsers={hubUsers}
                    marker={marker}
                />
            </div>
        </Suspense>
    )
}
