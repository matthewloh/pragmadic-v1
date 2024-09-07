import { Suspense } from "react"

import Loading from "@/app/loading"
import HealthClearanceInfoList from "@/components/healthClearanceInfo/HealthClearanceInfoList"
import { getHealthClearanceInfos } from "@/lib/api/healthClearanceInfo/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"

export const revalidate = 0

export default async function HealthClearanceInfoPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Health Clearance Info
                    </h1>
                </div>
                <HealthClearanceInfo />
            </div>
        </main>
    )
}

const HealthClearanceInfo = async () => {
    const { healthClearanceInfo } = await getHealthClearanceInfos()
    const { visaApplications } = await getVisaApplications()
    return (
        <Suspense fallback={<Loading />}>
            <HealthClearanceInfoList
                healthClearanceInfo={healthClearanceInfo}
                visaApplications={visaApplications}
            />
        </Suspense>
    )
}
