import { Suspense } from "react"

import Loading from "@/app/loading"
import CommunityList from "@/components/communities/CommunityList"
import { getCommunities } from "@/lib/api/communities/queries"

export const revalidate = 0

export default async function CommunitiesPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Communities</h1>
                </div>
                <Communities />
            </div>
        </main>
    )
}

const Communities = async () => {
    const { communities } = await getCommunities()

    return (
        <Suspense fallback={<Loading />}>
            <CommunityList communities={communities} />
        </Suspense>
    )
}
