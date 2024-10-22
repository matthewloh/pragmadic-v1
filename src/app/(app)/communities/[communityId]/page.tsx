import { notFound } from "next/navigation"
import { Suspense } from "react"

import CommunityEventList from "@/components/communityEvents/CommunityEventList"
import CommunityPostList from "@/components/communityPosts/CommunityPostList"
import {
    getCommunityByIdWithCommunityPostsAndCommunityEvents,
    getCommunityByIdWithCommunityPostsAndCommunityEventsAndMembers,
} from "@/lib/api/communities/queries"
import OptimisticCommunity from "./OptimisticCommunity"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import Image from "next/image"

export const revalidate = 0

export default async function CommunityPage(props: {
    params: Promise<{ communityId: string }>
}) {
    const params = await props.params
    return (
        <main className="overflow-auto">
            <Community id={params.communityId} />
        </main>
    )
}

const Community = async ({ id }: { id: string }) => {
    const { community, communityPosts, communityEvents, members } =
        await getCommunityByIdWithCommunityPostsAndCommunityEventsAndMembers(id)

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
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {community.name}&apos;s Members
                </h3>
                <div className="grid grid-cols-1 gap-4">
                    {members.map((member) => (
                        <div key={member.id}>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <Image
                                        src={member.imageUrl || ""}
                                        alt={member.displayName || ""}
                                        width={40}
                                        height={40}
                                        className="h-10 w-10 rounded-full"
                                    />
                                    <p className="ml-2">{member.displayName}</p>
                                </div>
                                <p>{member.inviteRoleType}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Suspense>
    )
}
