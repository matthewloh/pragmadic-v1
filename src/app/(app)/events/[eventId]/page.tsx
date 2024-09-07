import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getEventById } from "@/lib/api/events/queries"
import { getHubs } from "@/lib/api/hubs/queries"
import OptimisticEvent from "@/app/(app)/events/[eventId]/OptimisticEvent"
import { checkAuth } from "@/lib/auth/utils"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

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
    await checkAuth()

    const { event } = await getEventById(id)
    const { hubs } = await getHubs()

    if (!event) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="events" />
                <OptimisticEvent event={event} hubs={hubs} />
            </div>
        </Suspense>
    )
}
