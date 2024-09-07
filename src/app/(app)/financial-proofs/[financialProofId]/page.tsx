import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getFinancialProofById } from "@/lib/api/financialProofs/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"
import OptimisticFinancialProof from "@/app/(app)/financial-proofs/[financialProofId]/OptimisticFinancialProof"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function FinancialProofPage({
    params,
}: {
    params: { financialProofId: string }
}) {
    return (
        <main className="overflow-auto">
            <FinancialProof id={params.financialProofId} />
        </main>
    )
}

const FinancialProof = async ({ id }: { id: string }) => {
    const { financialProof } = await getFinancialProofById(id)
    const { visaApplications } = await getVisaApplications()

    if (!financialProof) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="financial-proofs" />
                <OptimisticFinancialProof
                    financialProof={financialProof}
                    visaApplications={visaApplications}
                />
            </div>
        </Suspense>
    )
}
