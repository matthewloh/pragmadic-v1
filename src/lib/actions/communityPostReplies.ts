"use server"

import { revalidatePath } from "next/cache"
import {
    createCommunityPostReply,
    deleteCommunityPostReply,
    updateCommunityPostReply,
} from "@/lib/api/communityPostReplies/mutations"
import {
    CommunityPostReplyId,
    NewCommunityPostReplyParams,
    UpdateCommunityPostReplyParams,
    communityPostReplyIdSchema,
    insertCommunityPostReplyParams,
    updateCommunityPostReplyParams,
} from "@/lib/db/schema/communityPostReplies"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateCommunityPostReplies = () =>
    revalidatePath("/community-post-replies")

export const createCommunityPostReplyAction = async (
    input: NewCommunityPostReplyParams,
) => {
    try {
        const payload = insertCommunityPostReplyParams.parse(input)
        await createCommunityPostReply(payload)
        revalidateCommunityPostReplies()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateCommunityPostReplyAction = async (
    input: UpdateCommunityPostReplyParams,
) => {
    try {
        const payload = updateCommunityPostReplyParams.parse(input)
        await updateCommunityPostReply(payload.id, payload)
        revalidateCommunityPostReplies()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteCommunityPostReplyAction = async (
    input: CommunityPostReplyId,
) => {
    try {
        const payload = communityPostReplyIdSchema.parse({ id: input })
        await deleteCommunityPostReply(payload.id)
        revalidateCommunityPostReplies()
    } catch (e) {
        return handleErrors(e)
    }
}
