import { type Region, type CompleteRegion } from "@/lib/db/schema/regions"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<Region>) => void

export const useOptimisticRegions = (regions: CompleteRegion[]) => {
    const [optimisticRegions, addOptimisticRegion] = useOptimistic(
        regions,
        (
            currentState: CompleteRegion[],
            action: OptimisticAction<Region>,
        ): CompleteRegion[] => {
            const { data } = action

            const optimisticRegion = {
                ...data,

                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticRegion]
                        : [...currentState, optimisticRegion]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticRegion }
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

    return { addOptimisticRegion, optimisticRegions }
}
