import { Suspense } from "react"

import Loading from "@/app/loading"
import CommunityPostList from "@/components/communityPosts/CommunityPostList"
import { getCommunities } from "@/lib/api/communities/queries"
import { getCommunityPosts } from "@/lib/api/communityPosts/queries"

export const revalidate = 0

export default async function CommunityPostsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Community Posts
                    </h1>
                </div>
                <CommunityPosts />
            </div>
        </main>
    )
}

const CommunityPosts = async () => {
    const { communityPosts } = await getCommunityPosts()
    const { communities } = await getCommunities()
    return (
        <Suspense fallback={<Loading />}>
            <CommunityPostList
                communityPosts={communityPosts}
                communities={communities}
            />
        </Suspense>
    )
}
