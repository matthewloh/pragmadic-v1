import {
    type CommunityEventInvite,
    type CompleteCommunityEventInvite,
} from "@/lib/db/schema/communityEventInvites"
import { type CommunityEvent } from "@/lib/db/schema/communityEvents"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (
    action: OptimisticAction<CommunityEventInvite>,
) => void

export const useOptimisticCommunityEventInvites = (
    communityEventInvites: CompleteCommunityEventInvite[],
    communityEvents: CommunityEvent[],
) => {
    const [optimisticCommunityEventInvites, addOptimisticCommunityEventInvite] =
        useOptimistic(
            communityEventInvites,
            (
                currentState: CompleteCommunityEventInvite[],
                action: OptimisticAction<CommunityEventInvite>,
            ): CompleteCommunityEventInvite[] => {
                const { data } = action

                const optimisticCommunityEvent = communityEvents.find(
                    (communityEvent) =>
                        communityEvent.id === data.communityEventId,
                )!

                const optimisticCommunityEventInvite = {
                    ...data,
                    communityEvent: optimisticCommunityEvent,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticCommunityEventInvite]
                            : [...currentState, optimisticCommunityEventInvite]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticCommunityEventInvite }
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

    return {
        addOptimisticCommunityEventInvite,
        optimisticCommunityEventInvites,
    }
}
