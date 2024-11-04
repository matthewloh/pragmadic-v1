import { Suspense } from "react"

import Loading from "@/app/loading"
import NomadProfileList from "@/components/nomadProfile/NomadProfileList"
import {
    getNomadProfileByUserId,
    getNomadProfiles,
} from "@/lib/api/nomadProfile/queries"
import { getUser } from "@/lib/api/users/queries"
import { notFound } from "next/navigation"

export const revalidate = 0

export default async function NomadProfilePage() {
    return (
        <main className="h-full w-full overflow-auto">
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Nomad Profile
                    </h1>
                </div>
                <NomadProfile />
            </div>
        </main>
    )
}

const NomadProfile = async () => {
    const { user } = await getUser()
    if (!user) notFound()
    const { nomadProfile } = await getNomadProfileByUserId(user.id)

    return (
        <Suspense fallback={<Loading />}>
            <NomadProfileList nomadProfile={nomadProfile} />
        </Suspense>
    )
}
