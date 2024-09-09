import { type Community } from "@/lib/db/schema/communities"
import {
    type CommunityEvent,
    type CompleteCommunityEvent,
} from "@/lib/db/schema/communityEvents"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<CommunityEvent>) => void

export const useOptimisticCommunityEvents = (
    communityEvents: CompleteCommunityEvent[],
    communities: Community[],
) => {
    const [optimisticCommunityEvents, addOptimisticCommunityEvent] =
        useOptimistic(
            communityEvents,
            (
                currentState: CompleteCommunityEvent[],
                action: OptimisticAction<CommunityEvent>,
            ): CompleteCommunityEvent[] => {
                const { data } = action

                const optimisticCommunity = communities.find(
                    (community) => community.id === data.communityId,
                )!

                const optimisticCommunityEvent = {
                    ...data,
                    community: optimisticCommunity,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticCommunityEvent]
                            : [...currentState, optimisticCommunityEvent]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticCommunityEvent }
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

    return { addOptimisticCommunityEvent, optimisticCommunityEvents }
}
