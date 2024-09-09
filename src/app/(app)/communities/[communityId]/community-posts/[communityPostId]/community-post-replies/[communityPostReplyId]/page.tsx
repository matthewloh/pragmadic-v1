import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticCommunityPostReply from "@/app/(app)/community-post-replies/[communityPostReplyId]/OptimisticCommunityPostReply"
import { getCommunityPostReplyById } from "@/lib/api/communityPostReplies/queries"
import { getCommunityPosts } from "@/lib/api/communityPosts/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function CommunityPostReplyPage({
    params,
}: {
    params: { communityPostReplyId: string }
}) {
    return (
        <main className="overflow-auto">
            <CommunityPostReply id={params.communityPostReplyId} />
        </main>
    )
}

const CommunityPostReply = async ({ id }: { id: string }) => {
    const { communityPostReply } = await getCommunityPostReplyById(id)
    const { communityPosts } = await getCommunityPosts()

    if (!communityPostReply) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="community-post-replies" />
                <OptimisticCommunityPostReply
                    communityPostReply={communityPostReply}
                    communityPosts={communityPosts}
                    communityPostId={communityPostReply.communityPostId}
                />
            </div>
        </Suspense>
    )
}
