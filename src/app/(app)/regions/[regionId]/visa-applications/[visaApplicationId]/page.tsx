import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticVisaApplication from "@/app/(app)/visa-applications/[visaApplicationId]/OptimisticVisaApplication"
import AccommodationProofList from "@/components/accommodationProofs/AccommodationProofList"
import FinancialProofList from "@/components/financialProofs/FinancialProofList"
import HealthClearanceInfoList from "@/components/healthClearanceInfo/HealthClearanceInfoList"
import WorkContractProofList from "@/components/workContractProofs/WorkContractProofList"
import { getRegions } from "@/lib/api/regions/queries"
import { getVisaApplicationByIdWithHealthClearanceInfoAndFinancialProofsAndAccommodationProofsAndWorkContractProofs } from "@/lib/api/visaApplications/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function VisaApplicationPage({
    params,
}: {
    params: { visaApplicationId: string }
}) {
    return (
        <main className="overflow-auto">
            <VisaApplication id={params.visaApplicationId} />
        </main>
    )
}

const VisaApplication = async ({ id }: { id: string }) => {

    const {
        visaApplication,
        healthClearanceInfo,
        financialProofs,
        accommodationProofs,
        workContractProofs,
    } =
        await getVisaApplicationByIdWithHealthClearanceInfoAndFinancialProofsAndAccommodationProofsAndWorkContractProofs(
            id,
        )
    const { regions } = await getRegions()

    if (!visaApplication) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="visa-applications" />
                <OptimisticVisaApplication
                    visaApplication={visaApplication}
                    regions={regions}
                    regionId={visaApplication.regionId}
                />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {visaApplication.status}&apos;s Health Clearance Info
                </h3>
                <HealthClearanceInfoList
                    visaApplications={[]}
                    visaApplicationId={visaApplication.id}
                    healthClearanceInfo={healthClearanceInfo}
                />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {visaApplication.status}&apos;s Financial Proofs
                </h3>
                <FinancialProofList
                    visaApplications={[]}
                    visaApplicationId={visaApplication.id}
                    financialProofs={financialProofs}
                />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {visaApplication.status}&apos;s Accommodation Proofs
                </h3>
                <AccommodationProofList
                    visaApplications={[]}
                    visaApplicationId={visaApplication.id}
                    accommodationProofs={accommodationProofs}
                />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {visaApplication.status}&apos;s Work Contract Proofs
                </h3>
                <WorkContractProofList
                    visaApplications={[]}
                    visaApplicationId={visaApplication.id}
                    workContractProofs={workContractProofs}
                />
            </div>
        </Suspense>
    )
}
