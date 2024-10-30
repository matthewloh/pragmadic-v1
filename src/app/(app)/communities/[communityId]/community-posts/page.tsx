import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCommunityByIdWithPosts } from "@/lib/api/communities/queries"
import { getCommunities } from "@/lib/api/communities/queries"
import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { CommunityPostsList } from "@/components/communityPosts/CommunityPostsList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const revalidate = 0

export default async function CommunityPostsPage(props: {
    params: Promise<{ communityId: string }>
}) {
    const params = await props.params
    return (
        <main className="flex flex-1 flex-col">
            <Suspense fallback={<Loading />}>
                <CommunityPosts communityId={params.communityId} />
            </Suspense>
        </main>
    )
}

async function CommunityPosts({ communityId }: { communityId: string }) {
    const { community, posts } = await getCommunityByIdWithPosts(communityId)
    if (!community) notFound()
    const { communities } = await getCommunities()

    const postsWithCommunity = posts.map((post) => ({
        ...post,
        community,
    }))

    return (
        <div className="flex flex-1 flex-col space-y-8">
            <div className="container mx-auto flex-1 space-y-8 px-4 py-8">
                <div className="flex items-center justify-between">
                    <Button variant="link" asChild>
                        <Link href={`/communities/${communityId}`}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back to Community
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">
                        {community.name}&apos;s Posts
                    </h1>
                </div>
                <CommunityPostsList
                    communityId={communityId}
                    communities={communities}
                    posts={postsWithCommunity}
                />
            </div>
        </div>
    )
}
