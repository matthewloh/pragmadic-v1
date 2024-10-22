import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticHub from "@/app/(app)/hubs/[hubId]/OptimisticHub"
import EventList from "@/components/events/EventList"
import ReviewList from "@/components/reviews/ReviewList"
import { getHubByIdWithEventsAndReviews } from "@/lib/api/hubs/queries"
import { getStates } from "@/lib/api/states/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { getUserRole, RoleType } from "@/lib/auth/get-user-role"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPinIcon, CalendarIcon, StarIcon } from "lucide-react"

export const revalidate = 0

export default async function HubPage(props: {
    params: Promise<{ hubId: string }>
}) {
    const { role } = await getUserRole()
    const params = await props.params
    return (
        <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
                <Hub id={params.hubId} role={role} />
            </Suspense>
        </main>
    )
}

const Hub = async ({ id, role }: { id: string; role: RoleType }) => {
    const { hub, events, reviews } = await getHubByIdWithEventsAndReviews(id)
    const { states } = await getStates()

    if (!hub) notFound()
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <BackButton currentResource="hubs" />
                <h1 className="text-3xl font-bold text-primary">{hub.name}</h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Hub Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <OptimisticHub
                        hub={hub}
                        states={states}
                        stateId={hub.stateId}
                        role={role}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{hub.name}&apos;s Events</CardTitle>
                </CardHeader>
                <CardContent>
                    <EventList hubs={[]} hubId={hub.id} events={events} />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{hub.name}&apos;s Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                    <ReviewList hubs={[]} hubId={hub.id} reviews={reviews} />
                </CardContent>
            </Card>
        </div>
    )
}
