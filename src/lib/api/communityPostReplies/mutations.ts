import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    CommunityPostReplyId,
    NewCommunityPostReplyParams,
    UpdateCommunityPostReplyParams,
    updateCommunityPostReplySchema,
    insertCommunityPostReplySchema,
    communityPostReplies,
    communityPostReplyIdSchema,
} from "@/lib/db/schema/communityPostReplies"
import { getUserAuth } from "@/lib/auth/utils"

export const createCommunityPostReply = async (
    communityPostReply: NewCommunityPostReplyParams,
) => {
    const { session } = await getUserAuth()
    const newCommunityPostReply = insertCommunityPostReplySchema.parse({
        ...communityPostReply,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .insert(communityPostReplies)
            .values(newCommunityPostReply)
            .returning()
        return { communityPostReply: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateCommunityPostReply = async (
    id: CommunityPostReplyId,
    communityPostReply: UpdateCommunityPostReplyParams,
) => {
    const { session } = await getUserAuth()
    const { id: communityPostReplyId } = communityPostReplyIdSchema.parse({
        id,
    })
    const newCommunityPostReply = updateCommunityPostReplySchema.parse({
        ...communityPostReply,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .update(communityPostReplies)
            .set({ ...newCommunityPostReply, updatedAt: new Date() })
            .where(
                and(
                    eq(communityPostReplies.id, communityPostReplyId!),
                    eq(communityPostReplies.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityPostReply: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteCommunityPostReply = async (id: CommunityPostReplyId) => {
    const { session } = await getUserAuth()
    const { id: communityPostReplyId } = communityPostReplyIdSchema.parse({
        id,
    })
    try {
        const [c] = await db
            .delete(communityPostReplies)
            .where(
                and(
                    eq(communityPostReplies.id, communityPostReplyId!),
                    eq(communityPostReplies.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityPostReply: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
