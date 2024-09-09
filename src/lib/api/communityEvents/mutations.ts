import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    CommunityEventId,
    NewCommunityEventParams,
    UpdateCommunityEventParams,
    updateCommunityEventSchema,
    insertCommunityEventSchema,
    communityEvents,
    communityEventIdSchema,
} from "@/lib/db/schema/communityEvents"
import { getUserAuth } from "@/lib/auth/utils"

export const createCommunityEvent = async (
    communityEvent: NewCommunityEventParams,
) => {
    const { session } = await getUserAuth()
    const newCommunityEvent = insertCommunityEventSchema.parse({
        ...communityEvent,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .insert(communityEvents)
            .values(newCommunityEvent)
            .returning()
        return { communityEvent: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateCommunityEvent = async (
    id: CommunityEventId,
    communityEvent: UpdateCommunityEventParams,
) => {
    const { session } = await getUserAuth()
    const { id: communityEventId } = communityEventIdSchema.parse({ id })
    const newCommunityEvent = updateCommunityEventSchema.parse({
        ...communityEvent,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .update(communityEvents)
            .set({ ...newCommunityEvent, updatedAt: new Date() })
            .where(
                and(
                    eq(communityEvents.id, communityEventId!),
                    eq(communityEvents.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityEvent: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteCommunityEvent = async (id: CommunityEventId) => {
    const { session } = await getUserAuth()
    const { id: communityEventId } = communityEventIdSchema.parse({ id })
    try {
        const [c] = await db
            .delete(communityEvents)
            .where(
                and(
                    eq(communityEvents.id, communityEventId!),
                    eq(communityEvents.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityEvent: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
