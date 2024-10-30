import { Suspense } from "react"

import Loading from "@/app/loading"
import EventList from "@/components/events/EventList"
import { getEvents } from "@/lib/api/events/queries"
import { getHubs, getHubsOfUser } from "@/lib/api/hubs/queries"

export const revalidate = 0

export default async function EventsPage() {
    return (
        <main className="container mx-auto h-full w-full">
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
    const { events } = await getEvents()
    const { hubs } = await getHubsOfUser()
    return (
        <Suspense fallback={<Loading />}>
            <EventList events={events} hubs={hubs} />
        </Suspense>
    )
}
