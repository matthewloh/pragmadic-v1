import { Suspense } from "react"
import { notFound } from "next/navigation"
import { getUserRole } from "@/lib/auth/get-user-role"

import { getStateByIdWithHubs } from "@/lib/api/states/queries"
import { getRegions } from "@/lib/api/regions/queries"
import OptimisticState from "./OptimisticState"
import HubList from "@/components/hubs/HubList"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function StatePage(props: {
    params: Promise<{ stateId: string }>
}) {
    const params = await props.params
    return (
        <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
                <State id={params.stateId} />
            </Suspense>
        </main>
    )
}

const State = async ({ id }: { id: string }) => {
    const { state, hubs } = await getStateByIdWithHubs(id)
    const { regions } = await getRegions()
    const { user_roles } = await getUserRole()

    if (!state) notFound()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <BackButton currentResource="states" />
                <h1 className="text-3xl font-bold text-primary">
                    {state.name}
                </h1>
            </div>
            <OptimisticState
                state={state}
                regions={regions}
                user_roles={user_roles}
            />
            <div className="mt-12">
                <h2 className="mb-4 text-2xl font-semibold">
                    Hubs in {state.name}
                </h2>
                <HubList
                    states={[]}
                    stateId={state.id}
                    hubs={hubs}
                    user_roles={user_roles}
                />
            </div>
        </div>
    )
}
