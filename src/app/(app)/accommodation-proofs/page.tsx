import { Suspense } from "react"

import Loading from "@/app/loading"
import AccommodationProofList from "@/components/accommodationProofs/AccommodationProofList"
import { getAccommodationProofs } from "@/lib/api/accommodationProofs/queries"
import { getVisaApplications } from "@/lib/api/visaApplications/queries"

export const revalidate = 0

export default async function AccommodationProofsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">
                        Accommodation Proofs
                    </h1>
                </div>
                <AccommodationProofs />
            </div>
        </main>
    )
}

const AccommodationProofs = async () => {
    const { accommodationProofs } = await getAccommodationProofs()
    const { visaApplications } = await getVisaApplications()
    return (
        <Suspense fallback={<Loading />}>
            <AccommodationProofList
                accommodationProofs={accommodationProofs}
                visaApplications={visaApplications}
            />
        </Suspense>
    )
}
