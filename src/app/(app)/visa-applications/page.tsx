import { Suspense } from "react"

import Loading from "@/app/loading"
import VisaApplicationList from "@/components/visaApplications/VisaApplicationList"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"
import { getRegions } from "@/lib/api/regions/queries"
import { checkAuth } from "@/lib/auth/utils"

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
    await checkAuth()

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
