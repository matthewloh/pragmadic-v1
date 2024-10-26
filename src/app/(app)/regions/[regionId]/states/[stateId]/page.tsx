import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getStateByIdWithHubs } from "@/lib/api/states/queries"
import { getRegions } from "@/lib/api/regions/queries"
import OptimisticState from "@/app/(app)/states/[stateId]/OptimisticState"
import HubList from "@/components/hubs/HubList"
import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"
import { getUserRole } from "@/lib/auth/get-user-role"
import { RoleType } from "@/lib/auth/get-user-role"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export const revalidate = 0

export default async function StatePage(props: {
    params: Promise<{ stateId: string }>
}) {
    const params = await props.params
    const { user_roles } = await getUserRole()
    return (
        <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
                <State id={params.stateId} user_roles={user_roles} />
            </Suspense>
        </main>
    )
}

const State = async ({ id, user_roles }: { id: string; user_roles: RoleType[] }) => {
    const { state, hubs } = await getStateByIdWithHubs(id)
    const { regions } = await getRegions()
    if (!state) notFound()
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <BackButton currentResource="states" />
                <h1 className="text-3xl font-bold text-primary">
                    {state.name}
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>State Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <OptimisticState
                        state={state}
                        regions={regions}
                        user_roles={user_roles}
                    />
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle>{state.name}&apos;s Hubs</CardTitle>
                </CardHeader>
                <CardContent>
                    <HubList
                        states={[state]}
                        stateId={state.id}
                        hubs={hubs}
                        user_roles={user_roles}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
