import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getCommunityByIdWithEvents } from "@/lib/api/communities/queries"
import { getCommunities } from "@/lib/api/communities/queries"
import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { CommunityEventsList } from "@/components/communityEvents/CommunityEventsList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const revalidate = 0

export default async function CommunityEventsPage(props: {
    params: Promise<{ communityId: string }>
}) {
    const params = await props.params
    return (
        <main className="flex flex-1 flex-col">
            <Suspense fallback={<Loading />}>
                <CommunityEvents communityId={params.communityId} />
            </Suspense>
        </main>
    )
}

async function CommunityEvents({ communityId }: { communityId: string }) {
    const { community, events } = await getCommunityByIdWithEvents(communityId)
    if (!community) notFound()
    const { communities } = await getCommunities()

    const eventsWithCommunity = events.map((event) => ({
        ...event,
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
                        {community.name}&apos;s Events
                    </h1>
                </div>
                <CommunityEventsList
                    events={eventsWithCommunity}
                    communityId={communityId}
                    communities={communities}
                />
            </div>
        </div>
    )
}
