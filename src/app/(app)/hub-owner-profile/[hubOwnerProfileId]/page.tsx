import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getHubOwnerProfileById } from "@/lib/api/hubOwnerProfiles/queries"
import OptimisticHubOwnerProfile from "./OptimisticHubOwnerProfile"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function HubOwnerProfilePage({
    params,
}: {
    params: { hubOwnerProfileId: string }
}) {
    return (
        <main className="overflow-auto">
            <HubOwnerProfile id={params.hubOwnerProfileId} />
        </main>
    )
}

const HubOwnerProfile = async ({ id }: { id: string }) => {
    const { hubOwnerProfile } = await getHubOwnerProfileById(id)

    if (!hubOwnerProfile) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="hub-owner-profiles" />
                <OptimisticHubOwnerProfile hubOwnerProfile={hubOwnerProfile} />
            </div>
        </Suspense>
    )
}
