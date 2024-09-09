import { Suspense } from "react"

import Loading from "@/app/loading"
import NomadProfileList from "@/components/nomadProfile/NomadProfileList"
import { getNomadProfiles } from "@/lib/api/nomadProfile/queries"

export const revalidate = 0

export default async function NomadProfilePage() {
    return (
        <main>
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
    const { nomadProfile } = await getNomadProfiles()

    return (
        <Suspense fallback={<Loading />}>
            <NomadProfileList nomadProfile={nomadProfile} />
        </Suspense>
    )
}
