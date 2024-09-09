import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    CommunityEventInviteId,
    NewCommunityEventInviteParams,
    UpdateCommunityEventInviteParams,
    updateCommunityEventInviteSchema,
    insertCommunityEventInviteSchema,
    communityEventInvites,
    communityEventInviteIdSchema,
} from "@/lib/db/schema/communityEventInvites"
import { getUserAuth } from "@/lib/auth/utils"

export const createCommunityEventInvite = async (
    communityEventInvite: NewCommunityEventInviteParams,
) => {
    const { session } = await getUserAuth()
    const newCommunityEventInvite = insertCommunityEventInviteSchema.parse({
        ...communityEventInvite,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .insert(communityEventInvites)
            .values(newCommunityEventInvite)
            .returning()
        return { communityEventInvite: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateCommunityEventInvite = async (
    id: CommunityEventInviteId,
    communityEventInvite: UpdateCommunityEventInviteParams,
) => {
    const { session } = await getUserAuth()
    const { id: communityEventInviteId } = communityEventInviteIdSchema.parse({
        id,
    })
    const newCommunityEventInvite = updateCommunityEventInviteSchema.parse({
        ...communityEventInvite,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .update(communityEventInvites)
            .set({ ...newCommunityEventInvite, updatedAt: new Date() })
            .where(
                and(
                    eq(communityEventInvites.id, communityEventInviteId!),
                    eq(communityEventInvites.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityEventInvite: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteCommunityEventInvite = async (
    id: CommunityEventInviteId,
) => {
    const { session } = await getUserAuth()
    const { id: communityEventInviteId } = communityEventInviteIdSchema.parse({
        id,
    })
    try {
        const [c] = await db
            .delete(communityEventInvites)
            .where(
                and(
                    eq(communityEventInvites.id, communityEventInviteId!),
                    eq(communityEventInvites.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityEventInvite: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
