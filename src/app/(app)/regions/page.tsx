import { Suspense } from "react"

import Loading from "@/app/loading"
import RegionList from "@/components/regions/RegionList"
import { getRegions } from "@/lib/api/regions/queries"

export const revalidate = 0

export default async function RegionsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Regions</h1>
                </div>
                <Regions />
            </div>
        </main>
    )
}

const Regions = async () => {
    const { regions } = await getRegions()

    return (
        <Suspense fallback={<Loading />}>
            <RegionList regions={regions} />
        </Suspense>
    )
}
