import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import {
    type CommunityEventInviteId,
    communityEventInviteIdSchema,
    communityEventInvites,
} from "@/lib/db/schema/communityEventInvites"
import { communityEvents } from "@/lib/db/schema/communityEvents"

export const getCommunityEventInvites = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select({
            communityEventInvite: communityEventInvites,
            communityEvent: communityEvents,
        })
        .from(communityEventInvites)
        .leftJoin(
            communityEvents,
            eq(communityEventInvites.communityEventId, communityEvents.id),
        )
        .where(eq(communityEventInvites.userId, session?.user.id!))
    const c = rows.map((r) => ({
        ...r.communityEventInvite,
        communityEvent: r.communityEvent,
    }))
    return { communityEventInvites: c }
}

export const getCommunityEventInviteById = async (
    id: CommunityEventInviteId,
) => {
    const { session } = await getUserAuth()
    const { id: communityEventInviteId } = communityEventInviteIdSchema.parse({
        id,
    })
    const [row] = await db
        .select({
            communityEventInvite: communityEventInvites,
            communityEvent: communityEvents,
        })
        .from(communityEventInvites)
        .where(
            and(
                eq(communityEventInvites.id, communityEventInviteId),
                eq(communityEventInvites.userId, session?.user.id!),
            ),
        )
        .leftJoin(
            communityEvents,
            eq(communityEventInvites.communityEventId, communityEvents.id),
        )
    if (row === undefined) return {}
    const c = {
        ...row.communityEventInvite,
        communityEvent: row.communityEvent,
    }
    return { communityEventInvite: c }
}
