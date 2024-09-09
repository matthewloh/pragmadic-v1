import { Suspense } from "react"

import Loading from "@/app/loading"
import CommunityEventInviteList from "@/components/communityEventInvites/CommunityEventInviteList"
import { getCommunityEventInvites } from "@/lib/api/communityEventInvites/queries"
import { getCommunityEvents } from "@/lib/api/communityEvents/queries"

export const revalidate = 0

export default async function CommunityEventInvitesPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Community Event Invites
                    </h1>
                </div>
                <CommunityEventInvites />
            </div>
        </main>
    )
}

const CommunityEventInvites = async () => {
    const { communityEventInvites } = await getCommunityEventInvites()
    const { communityEvents } = await getCommunityEvents()
    return (
        <Suspense fallback={<Loading />}>
            <CommunityEventInviteList
                communityEventInvites={communityEventInvites}
                communityEvents={communityEvents}
            />
        </Suspense>
    )
}
