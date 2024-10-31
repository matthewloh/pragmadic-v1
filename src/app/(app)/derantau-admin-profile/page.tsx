import { Suspense } from "react"
import { notFound } from "next/navigation"
import Loading from "@/app/loading"
import DerantauAdminProfileList from "@/components/derantauAdminProfile/DerantauAdminProfileList"
import { getDerantauAdminProfilesByUserId } from "@/lib/api/derantauAdminProfile/queries"
import { getRegions } from "@/lib/api/regions/queries"
import { getUser } from "@/lib/api/users/queries"

export const revalidate = 0

export default async function DerantauAdminProfilePage() {
    return (
        <main className="h-full w-full p-4">
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Derantau Admin Profile
                    </h1>
                </div>
                <Suspense fallback={<Loading />}>
                    <DerantauAdminProfile />
                </Suspense>
            </div>
        </main>
    )
}

const DerantauAdminProfile = async () => {
    const { user } = await getUser()
    if (!user) notFound()

    const [{ derantauAdminProfiles }, { regions }] = await Promise.all([
        getDerantauAdminProfilesByUserId(user.id),
        getRegions(),
    ])

    return (
        <DerantauAdminProfileList
            derantauAdminProfile={derantauAdminProfiles[0] || null}
            regions={regions || []}
        />
    )
}
