import { Suspense } from "react"

import Loading from "@/app/loading"
import CommunityPostReplyList from "@/components/communityPostReplies/CommunityPostReplyList"
import { getCommunityPostReplies } from "@/lib/api/communityPostReplies/queries"
import { getCommunityPosts } from "@/lib/api/communityPosts/queries"

export const revalidate = 0

export default async function CommunityPostRepliesPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Community Post Replies
                    </h1>
                </div>
                <CommunityPostReplies />
            </div>
        </main>
    )
}

const CommunityPostReplies = async () => {
    const { communityPostReplies } = await getCommunityPostReplies()
    const { communityPosts } = await getCommunityPosts()
    return (
        <Suspense fallback={<Loading />}>
            <CommunityPostReplyList
                communityPostReplies={communityPostReplies}
                communityPosts={communityPosts}
            />
        </Suspense>
    )
}
