import { Suspense } from "react"

import Loading from "@/app/loading"
import EventList from "@/components/events/EventList"
import { getEvents } from "@/lib/api/events/queries"
import { getHubs } from "@/lib/api/hubs/queries"
import { checkAuth } from "@/lib/auth/utils"

export const revalidate = 0

export default async function EventsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Events</h1>
                </div>
                <Events />
            </div>
        </main>
    )
}

const Events = async () => {
    await checkAuth()

    const { events } = await getEvents()
    const { hubs } = await getHubs()
    return (
        <Suspense fallback={<Loading />}>
            <EventList events={events} hubs={hubs} />
        </Suspense>
    )
}
