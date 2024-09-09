import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getHealthClearanceInfoById } from "@/lib/api/healthClearanceInfo/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"
import OptimisticHealthClearanceInfo from "@/app/(app)/health-clearance-info/[healthClearanceInfoId]/OptimisticHealthClearanceInfo"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function HealthClearanceInfoPage({
    params,
}: {
    params: { healthClearanceInfoId: string }
}) {
    return (
        <main className="overflow-auto">
            <HealthClearanceInfo id={params.healthClearanceInfoId} />
        </main>
    )
}

const HealthClearanceInfo = async ({ id }: { id: string }) => {
    const { healthClearanceInfo } = await getHealthClearanceInfoById(id)
    const { visaApplications } = await getVisaApplications()

    if (!healthClearanceInfo) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="health-clearance-info" />
                <OptimisticHealthClearanceInfo
                    healthClearanceInfo={healthClearanceInfo}
                    visaApplications={visaApplications}
                    visaApplicationId={healthClearanceInfo.visaApplicationId}
                />
            </div>
        </Suspense>
    )
}
