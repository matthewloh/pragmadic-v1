import { Suspense } from "react"

import Loading from "@/app/loading"
import HubOwnerProfileList from "@/components/hubOwnerProfiles/HubOwnerProfileList"
import { getHubOwnerProfiles } from "@/lib/api/hubOwnerProfiles/queries"


export const revalidate = 0

export default async function HubOwnerProfilesPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Hub Owner Profiles
                    </h1>
                </div>
                <HubOwnerProfiles />
            </div>
        </main>
    )
}

const HubOwnerProfiles = async () => {

    const { hubOwnerProfiles } = await getHubOwnerProfiles()

    return (
        <Suspense fallback={<Loading />}>
            <HubOwnerProfileList hubOwnerProfiles={hubOwnerProfiles} />
        </Suspense>
    )
}

