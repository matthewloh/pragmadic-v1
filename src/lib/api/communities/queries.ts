import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type CommunityId,
    communityIdSchema,
    communities,
} from "@/lib/db/schema/communities"
import {
    communityPosts,
    type CompleteCommunityPost,
} from "@/lib/db/schema/communityPosts"
import {
    communityEvents,
    type CompleteCommunityEvent,
} from "@/lib/db/schema/communityEvents"

export const getCommunities = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select()
        .from(communities)
        .where(eq(communities.userId, session?.user.id!))
    const c = rows
    return { communities: c }
}

export const getCommunityById = async (id: CommunityId) => {
    const { session } = await getUserAuth()
    const { id: communityId } = communityIdSchema.parse({ id })
    const [row] = await db
        .select()
        .from(communities)
        .where(
            and(
                eq(communities.id, communityId),
                eq(communities.userId, session?.user.id!),
            ),
        )
    if (row === undefined) return {}
    const c = row
    return { community: c }
}

export const getCommunityByIdWithCommunityPostsAndCommunityEvents = async (
    id: CommunityId,
) => {
    const { session } = await getUserAuth()
    const { id: communityId } = communityIdSchema.parse({ id })
    const rows = await db
        .select({
            community: communities,
            communityPost: communityPosts,
            communityEvent: communityEvents,
        })
        .from(communities)
        .where(
            and(
                eq(communities.id, communityId),
                eq(communities.userId, session?.user.id!),
            ),
        )
        .leftJoin(
            communityPosts,
            eq(communities.id, communityPosts.communityId),
        )
        .leftJoin(
            communityEvents,
            eq(communities.id, communityEvents.communityId),
        )
    if (rows.length === 0) return {}
    const c = rows[0].community
    const cc = rows
        .filter((r) => r.communityPost !== null)
        .map((c) => c.communityPost) as CompleteCommunityPost[]
    const ce = rows
        .filter((r) => r.communityEvent !== null)
        .map((c) => c.communityEvent) as CompleteCommunityEvent[]

    return { community: c, communityPosts: cc, communityEvents: ce }
}
