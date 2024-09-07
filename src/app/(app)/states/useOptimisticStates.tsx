import { type Region } from "@/lib/db/schema/regions"
import { type State, type CompleteState } from "@/lib/db/schema/states"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<State>) => void

export const useOptimisticStates = (
    states: CompleteState[],
    regions: Region[],
) => {
    const [optimisticStates, addOptimisticState] = useOptimistic(
        states,
        (
            currentState: CompleteState[],
            action: OptimisticAction<State>,
        ): CompleteState[] => {
            const { data } = action

            const optimisticRegion = regions.find(
                (region) => region.id === data.regionId,
            )!

            const optimisticState = {
                ...data,
                region: optimisticRegion,
                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticState]
                        : [...currentState, optimisticState]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticState }
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

    return { addOptimisticState, optimisticStates }
}
