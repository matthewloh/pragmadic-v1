import { Suspense } from "react"

import Loading from "@/app/loading"
import CommunityEventList from "@/components/communityEvents/CommunityEventList"
import { getCommunities } from "@/lib/api/communities/queries"
import { getCommunityEvents } from "@/lib/api/communityEvents/queries"

export const revalidate = 0

export default async function CommunityEventsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Community Events
                    </h1>
                </div>
                <CommunityEvents />
            </div>
        </main>
    )
}

const CommunityEvents = async () => {

    const { communityEvents } = await getCommunityEvents()
    const { communities } = await getCommunities()
    return (
        <Suspense fallback={<Loading />}>
            <CommunityEventList
                communityEvents={communityEvents}
                communities={communities}
            />
        </Suspense>
    )
}
