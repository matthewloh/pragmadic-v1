import { Suspense } from "react"

import Loading from "@/app/loading"
import DerantauAdminProfileList from "@/components/derantauAdminProfile/DerantauAdminProfileList"
import { getDerantauAdminProfiles } from "@/lib/api/derantauAdminProfile/queries"
import { getRegions } from "@/lib/api/regions/queries"

export const revalidate = 0

export default async function DerantauAdminProfilePage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Derantau Admin Profile
                    </h1>
                </div>
                <DerantauAdminProfile />
            </div>
        </main>
    )
}

const DerantauAdminProfile = async () => {
    const { derantauAdminProfile } = await getDerantauAdminProfiles()
    const { regions } = await getRegions()
    return (
        <Suspense fallback={<Loading />}>
            <DerantauAdminProfileList
                derantauAdminProfiles={derantauAdminProfile}
                regions={regions}
            />
        </Suspense>
    )
}
