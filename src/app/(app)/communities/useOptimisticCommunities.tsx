import {
    type Community,
    type CompleteCommunity,
} from "@/lib/db/schema/communities"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<Community>) => void

export const useOptimisticCommunities = (communities: CompleteCommunity[]) => {
    const [optimisticCommunities, addOptimisticCommunity] = useOptimistic(
        communities,
        (
            currentState: CompleteCommunity[],
            action: OptimisticAction<Community>,
        ): CompleteCommunity[] => {
            const { data } = action

            const optimisticCommunity = {
                ...data,

                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticCommunity]
                        : [...currentState, optimisticCommunity]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticCommunity }
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

    return { addOptimisticCommunity, optimisticCommunities }
}
