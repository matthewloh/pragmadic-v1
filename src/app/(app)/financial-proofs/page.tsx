import { Suspense } from "react"

import Loading from "@/app/loading"
import FinancialProofList from "@/components/financialProofs/FinancialProofList"
import { getFinancialProofs } from "@/lib/api/financialProofs/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"

export const revalidate = 0

export default async function FinancialProofsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Financial Proofs
                    </h1>
                </div>
                <FinancialProofs />
            </div>
        </main>
    )
}

const FinancialProofs = async () => {
    const { financialProofs } = await getFinancialProofs()
    const { visaApplications } = await getVisaApplications()
    return (
        <Suspense fallback={<Loading />}>
            <FinancialProofList
                financialProofs={financialProofs}
                visaApplications={visaApplications}
            />
        </Suspense>
    )
}

