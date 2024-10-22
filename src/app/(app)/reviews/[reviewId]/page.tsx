import { notFound } from "next/navigation"
import { Suspense } from "react"

import OptimisticReview from "@/app/(app)/reviews/[reviewId]/OptimisticReview"
import { getHubs } from "@/lib/api/hubs/queries"
import { getReviewById } from "@/lib/api/reviews/queries"

import Loading from "@/app/loading"
import { BackButton } from "@/components/shared/BackButton"

export const revalidate = 0

export default async function ReviewPage(
    props: {
        params: Promise<{ reviewId: string }>
    }
) {
    const params = await props.params;
    return (
        <main className="overflow-auto">
            <Review id={params.reviewId} />
        </main>
    )
}

const Review = async ({ id }: { id: string }) => {
    const { review } = await getReviewById(id)
    const { hubs } = await getHubs()

    if (!review) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="reviews" />
                <OptimisticReview review={review} hubs={hubs} />
            </div>
        </Suspense>
    )
}
