import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    CommunityId,
    NewCommunityParams,
    UpdateCommunityParams,
    updateCommunitySchema,
    insertCommunitySchema,
    communities,
    communityIdSchema,
} from "@/lib/db/schema/communities"
import { getUserAuth } from "@/lib/auth/utils"

export const createCommunity = async (community: NewCommunityParams) => {
    const { session } = await getUserAuth()
    const newCommunity = insertCommunitySchema.parse({
        ...community,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .insert(communities)
            .values(newCommunity)
            .returning()
        return { community: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateCommunity = async (
    id: CommunityId,
    community: UpdateCommunityParams,
) => {
    const { session } = await getUserAuth()
    const { id: communityId } = communityIdSchema.parse({ id })
    const newCommunity = updateCommunitySchema.parse({
        ...community,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .update(communities)
            .set({ ...newCommunity, updatedAt: new Date() })
            .where(
                and(
                    eq(communities.id, communityId!),
                    eq(communities.userId, session?.user.id!),
                ),
            )
            .returning()
        return { community: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteCommunity = async (id: CommunityId) => {
    const { session } = await getUserAuth()
    const { id: communityId } = communityIdSchema.parse({ id })
    try {
        const [c] = await db
            .delete(communities)
            .where(
                and(
                    eq(communities.id, communityId!),
                    eq(communities.userId, session?.user.id!),
                ),
            )
            .returning()
        return { community: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
