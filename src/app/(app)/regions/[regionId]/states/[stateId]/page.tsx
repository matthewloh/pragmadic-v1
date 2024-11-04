import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticState from "@/app/(app)/states/[stateId]/OptimisticState"
import Loading from "@/app/loading"
import HubList from "@/components/hubs/HubList"
import { BackButton } from "@/components/shared/BackButton"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { getRegions } from "@/lib/api/regions/queries"
import { getStateByIdWithHubs } from "@/lib/api/states/queries"
import { getUser } from "@/lib/api/users/queries"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

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
    if (!state) notFound()
    const { regions } = await getRegions()
    const { user } = await getUser()
    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <Button variant="outline" asChild>
                    <Link href={`/regions/${state.regionId}`}>
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        {regions?.find((r) => r.id === state.regionId)?.name}
                    </Link>
                </Button>
                <h1 className="text-3xl font-bold text-primary">
                    {state.name}
                </h1>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>State Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <OptimisticState state={state} regions={regions || []} />
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
                        user={user ?? null}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
