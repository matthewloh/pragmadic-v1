import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getWorkContractProofById } from "@/lib/api/workContractProofs/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"
import OptimisticWorkContractProof from "@/app/(app)/work-contract-proofs/[workContractProofId]/OptimisticWorkContractProof"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function WorkContractProofPage({
    params,
}: {
    params: { workContractProofId: string }
}) {
    return (
        <main className="overflow-auto">
            <WorkContractProof id={params.workContractProofId} />
        </main>
    )
}

const WorkContractProof = async ({ id }: { id: string }) => {
    const { workContractProof } = await getWorkContractProofById(id)
    const { visaApplications } = await getVisaApplications()

    if (!workContractProof) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="work-contract-proofs" />
                <OptimisticWorkContractProof
                    workContractProof={workContractProof}
                    visaApplications={visaApplications}
                    visaApplicationId={workContractProof.visaApplicationId}
                />
            </div>
        </Suspense>
    )
}
