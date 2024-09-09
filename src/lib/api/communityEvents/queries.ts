import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type CommunityEventId,
    communityEventIdSchema,
    communityEvents,
} from "@/lib/db/schema/communityEvents"
import { communities } from "@/lib/db/schema/communities"
import {
    communityEventInvites,
    type CompleteCommunityEventInvite,
} from "@/lib/db/schema/communityEventInvites"

export const getCommunityEvents = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({ communityEvent: communityEvents, community: communities })
        .from(communityEvents)
        .leftJoin(communities, eq(communityEvents.communityId, communities.id))
        .where(eq(communityEvents.userId, session?.user.id!))
    const c = rows.map((r) => ({ ...r.communityEvent, community: r.community }))
    return { communityEvents: c }
}

export const getCommunityEventById = async (id: CommunityEventId) => {
    const { session } = await getUserAuth()
    const { id: communityEventId } = communityEventIdSchema.parse({ id })
    const [row] = await db
        .select({ communityEvent: communityEvents, community: communities })
        .from(communityEvents)
        .where(
            and(
                eq(communityEvents.id, communityEventId),
                eq(communityEvents.userId, session?.user.id!),
            ),
        )
        .leftJoin(communities, eq(communityEvents.communityId, communities.id))
    if (row === undefined) return {}
    const c = { ...row.communityEvent, community: row.community }
    return { communityEvent: c }
}

export const getCommunityEventByIdWithCommunityEventInvites = async (
    id: CommunityEventId,
) => {
    const { session } = await getUserAuth()
    const { id: communityEventId } = communityEventIdSchema.parse({ id })
    const rows = await db
        .select({
            communityEvent: communityEvents,
            communityEventInvite: communityEventInvites,
        })
        .from(communityEvents)
        .where(
            and(
                eq(communityEvents.id, communityEventId),
                eq(communityEvents.userId, session?.user.id!),
            ),
        )
        .leftJoin(
            communityEventInvites,
            eq(communityEvents.id, communityEventInvites.communityEventId),
        )
    if (rows.length === 0) return {}
    const c = rows[0].communityEvent
    const cc = rows
        .filter((r) => r.communityEventInvite !== null)
        .map((c) => c.communityEventInvite) as CompleteCommunityEventInvite[]

    return { communityEvent: c, communityEventInvites: cc }
}
