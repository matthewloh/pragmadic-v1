import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getAccommodationProofById } from "@/lib/api/accommodationProofs/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"
import OptimisticAccommodationProof from "@/app/(app)/accommodation-proofs/[accommodationProofId]/OptimisticAccommodationProof"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function AccommodationProofPage({
    params,
}: {
    params: { accommodationProofId: string }
}) {
    return (
        <main className="overflow-auto">
            <AccommodationProof id={params.accommodationProofId} />
        </main>
    )
}

const AccommodationProof = async ({ id }: { id: string }) => {
    const { accommodationProof } = await getAccommodationProofById(id)
    const { visaApplications } = await getVisaApplications()

    if (!accommodationProof) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="accommodation-proofs" />
                <OptimisticAccommodationProof
                    accommodationProof={accommodationProof}
                    visaApplications={visaApplications}
                    visaApplicationId={accommodationProof.visaApplicationId}
                />
            </div>
        </Suspense>
    )
}
