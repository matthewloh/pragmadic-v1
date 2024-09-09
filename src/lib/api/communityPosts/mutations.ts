import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    CommunityPostId,
    NewCommunityPostParams,
    UpdateCommunityPostParams,
    updateCommunityPostSchema,
    insertCommunityPostSchema,
    communityPosts,
    communityPostIdSchema,
} from "@/lib/db/schema/communityPosts"
import { getUserAuth } from "@/lib/auth/utils"

export const createCommunityPost = async (
    communityPost: NewCommunityPostParams,
) => {
    const { session } = await getUserAuth()
    const newCommunityPost = insertCommunityPostSchema.parse({
        ...communityPost,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .insert(communityPosts)
            .values(newCommunityPost)
            .returning()
        return { communityPost: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateCommunityPost = async (
    id: CommunityPostId,
    communityPost: UpdateCommunityPostParams,
) => {
    const { session } = await getUserAuth()
    const { id: communityPostId } = communityPostIdSchema.parse({ id })
    const newCommunityPost = updateCommunityPostSchema.parse({
        ...communityPost,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .update(communityPosts)
            .set({ ...newCommunityPost, updatedAt: new Date() })
            .where(
                and(
                    eq(communityPosts.id, communityPostId!),
                    eq(communityPosts.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityPost: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteCommunityPost = async (id: CommunityPostId) => {
    const { session } = await getUserAuth()
    const { id: communityPostId } = communityPostIdSchema.parse({ id })
    try {
        const [c] = await db
            .delete(communityPosts)
            .where(
                and(
                    eq(communityPosts.id, communityPostId!),
                    eq(communityPosts.userId, session?.user.id!),
                ),
            )
            .returning()
        return { communityPost: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
