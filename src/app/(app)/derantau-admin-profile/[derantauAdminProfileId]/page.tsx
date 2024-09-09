import { notFound } from "next/navigation"
import { Suspense } from "react"

import { getDerantauAdminProfileById } from "@/lib/api/derantauAdminProfile/queries"
import { getRegions } from "@/lib/api/regions/queries"
import OptimisticDerantauAdminProfile from "./OptimisticDerantauAdminProfile"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function DerantauAdminProfilePage({
    params,
}: {
    params: { derantauAdminProfileId: string }
}) {
    return (
        <main className="overflow-auto">
            <DerantauAdminProfile id={params.derantauAdminProfileId} />
        </main>
    )
}

const DerantauAdminProfile = async ({ id }: { id: string }) => {
    const { derantauAdminProfile } = await getDerantauAdminProfileById(id)
    const { regions } = await getRegions()

    if (!derantauAdminProfile) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="derantau-admin-profile" />
                <OptimisticDerantauAdminProfile
                    derantauAdminProfile={derantauAdminProfile}
                    regions={regions}
                />
            </div>
        </Suspense>
    )
}
