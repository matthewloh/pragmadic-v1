import { type Community } from "@/lib/db/schema/communities"
import {
    type CommunityPost,
    type CompleteCommunityPost,
} from "@/lib/db/schema/communityPosts"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<CommunityPost>) => void

export const useOptimisticCommunityPosts = (
    communityPosts: CompleteCommunityPost[],
    communities: Community[],
) => {
    const [optimisticCommunityPosts, addOptimisticCommunityPost] =
        useOptimistic(
            communityPosts,
            (
                currentState: CompleteCommunityPost[],
                action: OptimisticAction<CommunityPost>,
            ): CompleteCommunityPost[] => {
                const { data } = action

                const optimisticCommunity = communities.find(
                    (community) => community.id === data.communityId,
                )!

                const optimisticCommunityPost = {
                    ...data,
                    community: optimisticCommunity,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticCommunityPost]
                            : [...currentState, optimisticCommunityPost]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticCommunityPost }
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

    return { addOptimisticCommunityPost, optimisticCommunityPosts }
}
