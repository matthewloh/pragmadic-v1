"use server"

import { revalidatePath } from "next/cache"
import {
    createCommunityEventInvite,
    deleteCommunityEventInvite,
    updateCommunityEventInvite,
} from "@/lib/api/communityEventInvites/mutations"
import {
    CommunityEventInviteId,
    NewCommunityEventInviteParams,
    UpdateCommunityEventInviteParams,
    communityEventInviteIdSchema,
    insertCommunityEventInviteParams,
    updateCommunityEventInviteParams,
} from "@/lib/db/schema/communityEventInvites"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateCommunityEventInvites = () =>
    revalidatePath("/community-event-invites")

export const createCommunityEventInviteAction = async (
    input: NewCommunityEventInviteParams,
) => {
    try {
        const payload = insertCommunityEventInviteParams.parse(input)
        await createCommunityEventInvite(payload)
        revalidateCommunityEventInvites()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateCommunityEventInviteAction = async (
    input: UpdateCommunityEventInviteParams,
) => {
    try {
        const payload = updateCommunityEventInviteParams.parse(input)
        await updateCommunityEventInvite(payload.id, payload)
        revalidateCommunityEventInvites()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteCommunityEventInviteAction = async (
    input: CommunityEventInviteId,
) => {
    try {
        const payload = communityEventInviteIdSchema.parse({ id: input })
        await deleteCommunityEventInvite(payload.id)
        revalidateCommunityEventInvites()
    } catch (e) {
        return handleErrors(e)
    }
}
