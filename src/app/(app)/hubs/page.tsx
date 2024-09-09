import { Suspense } from "react"

import Loading from "@/app/loading"
import HubList from "@/components/hubs/HubList"
import { getHubs } from "@/lib/api/hubs/queries"
import { getStates } from "@/lib/api/states/queries"

export const revalidate = 0

export default async function HubsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Hubs</h1>
                </div>
                <Hubs />
            </div>
        </main>
    )
}

const Hubs = async () => {

    const { hubs } = await getHubs()
    const { states } = await getStates()
    return (
        <Suspense fallback={<Loading />}>
            <HubList hubs={hubs} states={states} />
        </Suspense>
    )
}
