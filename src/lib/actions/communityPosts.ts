"use server"

import { revalidatePath } from "next/cache"
import {
    createCommunityPost,
    deleteCommunityPost,
    updateCommunityPost,
} from "@/lib/api/communityPosts/mutations"
import {
    CommunityPostId,
    NewCommunityPostParams,
    UpdateCommunityPostParams,
    communityPostIdSchema,
    insertCommunityPostParams,
    updateCommunityPostParams,
} from "@/lib/db/schema/communityPosts"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateCommunityPosts = () => revalidatePath("/community-posts")

export const createCommunityPostAction = async (
    input: NewCommunityPostParams,
) => {
    try {
        const payload = insertCommunityPostParams.parse(input)
        await createCommunityPost(payload)
        revalidateCommunityPosts()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateCommunityPostAction = async (
    input: UpdateCommunityPostParams,
) => {
    try {
        const payload = updateCommunityPostParams.parse(input)
        await updateCommunityPost(payload.id, payload)
        revalidateCommunityPosts()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteCommunityPostAction = async (input: CommunityPostId) => {
    try {
        const payload = communityPostIdSchema.parse({ id: input })
        await deleteCommunityPost(payload.id)
        revalidateCommunityPosts()
    } catch (e) {
        return handleErrors(e)
    }
}
