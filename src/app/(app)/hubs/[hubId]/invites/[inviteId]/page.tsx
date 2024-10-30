import { Suspense } from "react"
import { notFound } from "next/navigation"
import Loading from "@/app/loading"
import { getUserAuth } from "@/lib/auth/utils"
import { getHubInviteById } from "@/lib/api/hubs/queries"
import { BackButton } from "@/components/shared/BackButton"
import { HubInviteDetail } from "@/components/hubs/HubInviteDetail"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeftIcon } from "lucide-react"

export const revalidate = 0

export default async function HubInviteDetailPage(props: {
    params: Promise<{ hubId: string; inviteId: string }>
}) {
    const params = await props.params
    const { session } = await getUserAuth()
    if (!session) {
        return <div>Please log in to view this invite.</div>
    }

    const { invite } = await getHubInviteById(params.hubId, params.inviteId)
    if (!invite) notFound()

    return (
        <main className="overflow-auto">
            <div className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
                <div className="mb-4">
                    <Button variant="link" asChild>
                        <Link href={`/hubs/${params.hubId}/invites`}>
                            <ArrowLeftIcon className="mr-2 h-4 w-4" />
                            <h1 className="text-3xl font-bold">
                                Return to Invites
                            </h1>
                        </Link>
                    </Button>
                </div>
                <Suspense fallback={<Loading />}>
                    <HubInviteDetail invite={invite} />
                </Suspense>
            </div>
        </main>
    )
}
