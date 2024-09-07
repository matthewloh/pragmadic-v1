import { type Region } from "@/lib/db/schema/regions"
import {
    type VisaApplication,
    type CompleteVisaApplication,
} from "@/lib/db/schema/visaApplications"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<VisaApplication>) => void

export const useOptimisticVisaApplications = (
    visaApplications: CompleteVisaApplication[],
    regions: Region[],
) => {
    const [optimisticVisaApplications, addOptimisticVisaApplication] =
        useOptimistic(
            visaApplications,
            (
                currentState: CompleteVisaApplication[],
                action: OptimisticAction<VisaApplication>,
            ): CompleteVisaApplication[] => {
                const { data } = action

                const optimisticRegion = regions.find(
                    (region) => region.id === data.regionId,
                )!

                const optimisticVisaApplication = {
                    ...data,
                    region: optimisticRegion,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticVisaApplication]
                            : [...currentState, optimisticVisaApplication]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticVisaApplication }
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

    return { addOptimisticVisaApplication, optimisticVisaApplications }
}
