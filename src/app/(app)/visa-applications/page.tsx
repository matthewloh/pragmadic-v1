import { Suspense } from "react"

import Loading from "@/app/loading"
import VisaApplicationList from "@/components/visaApplications/VisaApplicationList"
import { getRegions } from "@/lib/api/regions/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"

export const revalidate = 0

export default async function VisaApplicationsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Visa Applications
                    </h1>
                </div>
                <VisaApplications />
            </div>
        </main>
    )
}

const VisaApplications = async () => {

    const { visaApplications } = await getVisaApplications()
    const { regions } = await getRegions()
    return (
        <Suspense fallback={<Loading />}>
            <VisaApplicationList
                visaApplications={visaApplications}
                regions={regions}
            />
        </Suspense>
    )
}
