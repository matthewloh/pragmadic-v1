import { notFound } from "next/navigation"
import { Suspense } from "react"

import StateList from "@/components/states/StateList"
import VisaApplicationList from "@/components/visaApplications/VisaApplicationList"
import { getRegionByIdWithStatesAndVisaApplications } from "@/lib/api/regions/queries"
import OptimisticRegion from "./OptimisticRegion"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function RegionPage({
    params,
}: {
    params: { regionId: string }
}) {
    return (
        <main className="overflow-auto">
            <Region id={params.regionId} />
        </main>
    )
}

const Region = async ({ id }: { id: string }) => {
    const { region, states, visaApplications } =
        await getRegionByIdWithStatesAndVisaApplications(id)

    if (!region) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="regions" />
                <OptimisticRegion region={region} />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {region.name}&apos;s States
                </h3>
                <StateList regions={[]} regionId={region.id} states={states} />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {region.name}&apos;s Visa Applications
                </h3>
                <VisaApplicationList
                    regions={[]}
                    regionId={region.id}
                    visaApplications={visaApplications}
                />
            </div>
        </Suspense>
    )
}

