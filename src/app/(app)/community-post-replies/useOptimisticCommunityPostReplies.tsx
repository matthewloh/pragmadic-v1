import { type CommunityPost } from "@/lib/db/schema/communityPosts"
import {
    type CommunityPostReply,
    type CompleteCommunityPostReply,
} from "@/lib/db/schema/communityPostReplies"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (
    action: OptimisticAction<CommunityPostReply>,
) => void

export const useOptimisticCommunityPostReplies = (
    communityPostReplies: CompleteCommunityPostReply[],
    communityPosts: CommunityPost[],
) => {
    const [optimisticCommunityPostReplies, addOptimisticCommunityPostReply] =
        useOptimistic(
            communityPostReplies,
            (
                currentState: CompleteCommunityPostReply[],
                action: OptimisticAction<CommunityPostReply>,
            ): CompleteCommunityPostReply[] => {
                const { data } = action

                const optimisticCommunityPost = communityPosts.find(
                    (communityPost) =>
                        communityPost.id === data.communityPostId,
                )!

                const optimisticCommunityPostReply = {
                    ...data,
                    communityPost: optimisticCommunityPost,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticCommunityPostReply]
                            : [...currentState, optimisticCommunityPostReply]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticCommunityPostReply }
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

    return { addOptimisticCommunityPostReply, optimisticCommunityPostReplies }
}
