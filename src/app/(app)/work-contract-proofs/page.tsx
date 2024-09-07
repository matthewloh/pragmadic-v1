import { Suspense } from "react"

import Loading from "@/app/loading"
import WorkContractProofList from "@/components/workContractProofs/WorkContractProofList"
import { getWorkContractProofs } from "@/lib/api/workContractProofs/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"

export const revalidate = 0

export default async function WorkContractProofsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Work Contract Proofs
                    </h1>
                </div>
                <WorkContractProofs />
            </div>
        </main>
    )
}

const WorkContractProofs = async () => {
    const { workContractProofs } = await getWorkContractProofs()
    const { visaApplications } = await getVisaApplications()
    return (
        <Suspense fallback={<Loading />}>
            <WorkContractProofList
                workContractProofs={workContractProofs}
                visaApplications={visaApplications}
            />
        </Suspense>
    )
}
