import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticCommunityEventInvite from "@/app/(app)/community-event-invites/[communityEventInviteId]/OptimisticCommunityEventInvite"
import { getCommunityEventInviteById } from "@/lib/api/communityEventInvites/queries"
import { getCommunityEvents } from "@/lib/api/communityEvents/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function CommunityEventInvitePage(
    props: {
        params: Promise<{ communityEventInviteId: string }>
    }
) {
    const params = await props.params;
    return (
        <main className="overflow-auto">
            <CommunityEventInvite id={params.communityEventInviteId} />
        </main>
    )
}

const CommunityEventInvite = async ({ id }: { id: string }) => {
    const { communityEventInvite } = await getCommunityEventInviteById(id)
    const { communityEvents } = await getCommunityEvents()

    if (!communityEventInvite) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="community-event-invites" />
                <OptimisticCommunityEventInvite
                    communityEventInvite={communityEventInvite}
                    communityEvents={communityEvents}
                />
            </div>
        </Suspense>
    )
}
