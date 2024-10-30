import { Suspense } from "react"
import { notFound } from "next/navigation"
import { HubInviteList } from "@/components/hubs/HubInviteList"
import Loading from "@/app/loading"
import { getUserAuth } from "@/lib/auth/utils"
import { getHubById } from "@/lib/api/hubs/queries"
import { BackButton } from "@/components/shared/BackButton"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowLeftIcon } from "lucide-react"

export const revalidate = 0

export default async function HubInvitesPage(props: {
    params: Promise<{ hubId: string }>
}) {
    const params = await props.params
    const { session } = await getUserAuth()
    if (!session) {
        return <div>Please log in to view invites.</div>
    }

    const { hub } = await getHubById(params.hubId)
    if (!hub) notFound()

    return (
        <main className="overflow-auto">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <div className="mb-4">
                    <Button variant="link" asChild>
                        <Link href={`/hubs/${params.hubId}`}>
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            <h1 className="text-3xl font-bold">
                                Return to Hub
                            </h1>
                        </Link>
                    </Button>
                </div>
                <Suspense fallback={<Loading />}>
                    <HubInviteList hubId={params.hubId} />
                </Suspense>
            </div>
        </main>
    )
}
