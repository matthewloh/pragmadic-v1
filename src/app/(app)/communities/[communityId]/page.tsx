import { notFound } from "next/navigation"
import { Suspense } from "react"

import CommunityEventList from "@/components/communityEvents/CommunityEventList"
import CommunityPostList from "@/components/communityPosts/CommunityPostList"
import { getCommunityByIdWithCommunityPostsAndCommunityEvents } from "@/lib/api/communities/queries"
import OptimisticCommunity from "./OptimisticCommunity"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function CommunityPage({
    params,
}: {
    params: { communityId: string }
}) {
    return (
        <main className="overflow-auto">
            <Community id={params.communityId} />
        </main>
    )
}

const Community = async ({ id }: { id: string }) => {
    const { community, communityPosts, communityEvents } =
        await getCommunityByIdWithCommunityPostsAndCommunityEvents(id)

    if (!community) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="communities" />
                <OptimisticCommunity community={community} />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {community.name}&apos;s Community Posts
                </h3>
                <CommunityPostList
                    communities={[]}
                    communityId={community.id}
                    communityPosts={communityPosts}
                />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {community.name}&apos;s Community Events
                </h3>
                <CommunityEventList
                    communities={[]}
                    communityId={community.id}
                    communityEvents={communityEvents}
                />
            </div>
        </Suspense>
    )
}
