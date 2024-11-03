import Loading from "@/app/loading"
import HubList from "@/components/hubs/HubList"
import { getHubs } from "@/lib/api/hubs/queries"
import { getStates } from "@/lib/api/states/queries"
import { getUser } from "@/lib/api/users/queries"
import { Suspense } from "react"

export const revalidate = 0

export default async function HubsPage() {
    return (
        <div className="h-full w-full">
            <div className="flex h-full flex-col gap-4">
                <div className="flex-1">
                    <Hubs />
                </div>
            </div>
        </div>
    )
}

const Hubs = async () => {
    const { hubs } = await getHubs()
    const { states } = await getStates()
    const { user } = await getUser()
    return (
        <Suspense fallback={<Loading />}>
            <span className="text-2xl font-bold">Pragmadic</span>
            <HubList hubs={hubs} states={states} user={user ?? null} />
        </Suspense>
    )
}
