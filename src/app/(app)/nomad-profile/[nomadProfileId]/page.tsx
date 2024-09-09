import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getNomadProfileById } from "@/lib/api/nomadProfile/queries"
import OptimisticNomadProfile from "./OptimisticNomadProfile"
import { checkAuth } from "@/lib/auth/utils"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function NomadProfilePage({
    params,
}: {
    params: { nomadProfileId: string }
}) {
    return (
        <main className="overflow-auto">
            <NomadProfile id={params.nomadProfileId} />
        </main>
    )
}

const NomadProfile = async ({ id }: { id: string }) => {
    await checkAuth()

    const { nomadProfile } = await getNomadProfileById(id)

    if (!nomadProfile) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="nomad-profile" />
                <OptimisticNomadProfile nomadProfile={nomadProfile} />
            </div>
        </Suspense>
    )
}
