import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type CommunityPostReplyId,
    communityPostReplyIdSchema,
    communityPostReplies,
} from "@/lib/db/schema/communityPostReplies"
import { communityPosts } from "@/lib/db/schema/communityPosts"

export const getCommunityPostReplies = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({
            communityPostReply: communityPostReplies,
            communityPost: communityPosts,
        })
        .from(communityPostReplies)
        .leftJoin(
            communityPosts,
            eq(communityPostReplies.communityPostId, communityPosts.id),
        )
        .where(eq(communityPostReplies.userId, session?.user.id!))
    const c = rows.map((r) => ({
        ...r.communityPostReply,
        communityPost: r.communityPost,
    }))
    return { communityPostReplies: c }
}

export const getCommunityPostReplyById = async (id: CommunityPostReplyId) => {
    const { session } = await getUserAuth()
    const { id: communityPostReplyId } = communityPostReplyIdSchema.parse({
        id,
    })
    const [row] = await db
        .select({
            communityPostReply: communityPostReplies,
            communityPost: communityPosts,
        })
        .from(communityPostReplies)
        .where(
            and(
                eq(communityPostReplies.id, communityPostReplyId),
                eq(communityPostReplies.userId, session?.user.id!),
            ),
        )
        .leftJoin(
            communityPosts,
            eq(communityPostReplies.communityPostId, communityPosts.id),
        )
    if (row === undefined) return {}
    const c = { ...row.communityPostReply, communityPost: row.communityPost }
    return { communityPostReply: c }
}
