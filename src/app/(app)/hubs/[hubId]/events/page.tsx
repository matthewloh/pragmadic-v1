import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getHubByIdWithEvents } from "@/lib/api/hubs/queries"
import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"
import { HubEventsList } from "@/components/events/HubEventsList"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"

export const revalidate = 0

export default async function HubEventsPage(props: {
    params: Promise<{ hubId: string }>
}) {
    const params = await props.params
    return (
        <main className="flex flex-1 flex-col">
            <Suspense fallback={<Loading />}>
                <HubEvents hubId={params.hubId} />
            </Suspense>
        </main>
    )
}

async function HubEvents({ hubId }: { hubId: string }) {
    const { hub, events } = await getHubByIdWithEvents(hubId)

    if (!hub) notFound()

    return (
        <div className="flex flex-1 flex-col space-y-8">
            <div className="container mx-auto flex-1 space-y-8 px-4 py-8">
                <div className="flex items-center justify-between">
                    <Button variant="link" asChild>
                        <Link href={`/hubs/${hubId}`}>
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            Back
                        </Link>
                    </Button>
                    <h1 className="text-3xl font-bold">
                        {hub.name}&apos;s Events
                    </h1>
                </div>
                <HubEventsList hubId={hubId} events={events} />
            </div>
        </div>
    )
}
