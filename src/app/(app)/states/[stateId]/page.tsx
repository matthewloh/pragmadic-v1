import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getStateByIdWithHubs } from "@/lib/api/states/queries"
import { getRegions } from "@/lib/api/regions/queries"
import OptimisticState from "@/app/(app)/states/[stateId]/OptimisticState"
import HubList from "@/components/hubs/HubList"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function StatePage({
    params,
}: {
    params: { stateId: string }
}) {
    return (
        <main className="overflow-auto">
            <State id={params.stateId} />
        </main>
    )
}

const State = async ({ id }: { id: string }) => {
    const { state, hubs } = await getStateByIdWithHubs(id)
    const { regions } = await getRegions()

    if (!state) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="states" />
                <OptimisticState state={state} regions={regions} />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {state.name}&apos;s Hubs
                </h3>
                <HubList states={[]} stateId={state.id} hubs={hubs} />
            </div>
        </Suspense>
    )
}
