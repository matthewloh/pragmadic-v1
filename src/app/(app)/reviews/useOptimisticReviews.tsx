import { type Hub } from "@/lib/db/schema/hubs"
import { type Review, type CompleteReview } from "@/lib/db/schema/reviews"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<Review>) => void

export const useOptimisticReviews = (
    reviews: CompleteReview[],
    hubs: Hub[],
) => {
    const [optimisticReviews, addOptimisticReview] = useOptimistic(
        reviews,
        (
            currentState: CompleteReview[],
            action: OptimisticAction<Review>,
        ): CompleteReview[] => {
            const { data } = action

            const optimisticHub = hubs.find((hub) => hub.id === data.hubId)!

            const optimisticReview = {
                ...data,
                hub: optimisticHub,
                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticReview]
                        : [...currentState, optimisticReview]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticReview }
                            : item,
                    )
                case "delete":
                    return currentState.map((item) =>
                        item.id === data.id ? { ...item, id: "delete" } : item,
                    )
                default:
                    return currentState
            }
        },
    )

    return { addOptimisticReview, optimisticReviews }
}
