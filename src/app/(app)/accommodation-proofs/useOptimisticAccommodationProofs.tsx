import { type VisaApplication } from "@/lib/db/schema/visaApplications"
import {
    type AccommodationProof,
    type CompleteAccommodationProof,
} from "@/lib/db/schema/accommodationProofs"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (
    action: OptimisticAction<AccommodationProof>,
) => void

export const useOptimisticAccommodationProofs = (
    accommodationProofs: CompleteAccommodationProof[],
    visaApplications: VisaApplication[],
) => {
    const [optimisticAccommodationProofs, addOptimisticAccommodationProof] =
        useOptimistic(
            accommodationProofs,
            (
                currentState: CompleteAccommodationProof[],
                action: OptimisticAction<AccommodationProof>,
            ): CompleteAccommodationProof[] => {
                const { data } = action

                const optimisticVisaApplication = visaApplications.find(
                    (visaApplication) =>
                        visaApplication.id === data.visaApplicationId,
                )!

                const optimisticAccommodationProof = {
                    ...data,
                    visaApplication: optimisticVisaApplication,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticAccommodationProof]
                            : [...currentState, optimisticAccommodationProof]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticAccommodationProof }
                                : item,
                        )
                    case "delete":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, id: "delete" }
                                : item,
                        )
                    default:
                        return currentState
                }
            },
        )

    return { addOptimisticAccommodationProof, optimisticAccommodationProofs }
}
