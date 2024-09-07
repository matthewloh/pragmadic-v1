import { type State } from "@/lib/db/schema/states"
import { type Hub, type CompleteHub } from "@/lib/db/schema/hubs"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<Hub>) => void

export const useOptimisticHubs = (hubs: CompleteHub[], states: State[]) => {
    const [optimisticHubs, addOptimisticHub] = useOptimistic(
        hubs,
        (
            currentState: CompleteHub[],
            action: OptimisticAction<Hub>,
        ): CompleteHub[] => {
            const { data } = action

            const optimisticState = states.find(
                (state) => state.id === data.stateId,
            )!

            const optimisticHub = {
                ...data,
                state: optimisticState,
                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticHub]
                        : [...currentState, optimisticHub]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticHub }
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

    return { addOptimisticHub, optimisticHubs }
}
