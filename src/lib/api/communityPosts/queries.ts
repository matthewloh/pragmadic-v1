import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type CommunityPostId,
    communityPostIdSchema,
    communityPosts,
} from "@/lib/db/schema/communityPosts"
import { communities } from "@/lib/db/schema/communities"
import {
    communityPostReplies,
    type CompleteCommunityPostReply,
} from "@/lib/db/schema/communityPostReplies"

export const getCommunityPosts = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({ communityPost: communityPosts, community: communities })
        .from(communityPosts)
        .leftJoin(communities, eq(communityPosts.communityId, communities.id))
    const c = rows.map((r) => ({ ...r.communityPost, community: r.community }))
    return { communityPosts: c }
}

export const getCommunityPostById = async (id: CommunityPostId) => {
    const { session } = await getUserAuth()
    const { id: communityPostId } = communityPostIdSchema.parse({ id })
    const [row] = await db
        .select({ communityPost: communityPosts, community: communities })
        .from(communityPosts)
        .where(
            and(
                eq(communityPosts.id, communityPostId),
                eq(communityPosts.userId, session?.user.id!),
            ),
        )
        .leftJoin(communities, eq(communityPosts.communityId, communities.id))
    if (row === undefined) return {}
    const c = { ...row.communityPost, community: row.community }
    return { communityPost: c }
}

export const getCommunityPostByIdWithCommunityPostReplies = async (
    id: CommunityPostId,
) => {
    const { session } = await getUserAuth()
    const { id: communityPostId } = communityPostIdSchema.parse({ id })
    const rows = await db
        .select({
            communityPost: communityPosts,
            communityPostReply: communityPostReplies,
        })
        .from(communityPosts)
        .where(eq(communityPosts.id, communityPostId))
        .leftJoin(
            communityPostReplies,
            eq(communityPosts.id, communityPostReplies.communityPostId),
        )
    if (rows.length === 0) return {}
    const c = rows[0].communityPost
    const cc = rows
        .filter((r) => r.communityPostReply !== null)
        .map((c) => c.communityPostReply) as CompleteCommunityPostReply[]

    return { communityPost: c, communityPostReplies: cc }
}
