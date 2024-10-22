import { notFound } from "next/navigation"
import { Suspense } from "react"
import { getUserRole } from "@/lib/auth/get-user-role"
import { getRegionByIdWithStates } from "@/lib/api/regions/queries"
import OptimisticRegion from "./OptimisticRegion"
import StateList from "@/components/states/StateList"
import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function RegionPage(props: {
    params: Promise<{ regionId: string }>
}) {
    const params = await props.params
    return (
        <main className="container mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
                <Region id={params.regionId} />
            </Suspense>
        </main>
    )
}

const Region = async ({ id }: { id: string }) => {
    const { region, states } = await getRegionByIdWithStates(id)
    const { role } = await getUserRole()

    if (!region) notFound()

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between">
                <BackButton currentResource="regions" />
                <h1 className="text-3xl font-bold text-primary">
                    {region.name}
                </h1>
            </div>
            <OptimisticRegion region={region} role={role} />
            <div className="mt-12">
                <h2 className="mb-4 text-2xl font-bold">
                    States in {region.name}
                </h2>
                <StateList
                    regions={[region]}
                    regionId={region.id}
                    states={states}
                    role={role}
                />
            </div>
        </div>
    )
}
