"use server"

import { revalidatePath } from "next/cache"
import {
    createCommunityEvent,
    deleteCommunityEvent,
    updateCommunityEvent,
} from "@/lib/api/communityEvents/mutations"
import {
    CommunityEventId,
    NewCommunityEventParams,
    UpdateCommunityEventParams,
    communityEventIdSchema,
    insertCommunityEventParams,
    updateCommunityEventParams,
} from "@/lib/db/schema/communityEvents"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateCommunityEvents = () => revalidatePath("/community-events")

export const createCommunityEventAction = async (
    input: NewCommunityEventParams,
) => {
    try {
        const payload = insertCommunityEventParams.parse(input)
        await createCommunityEvent(payload)
        revalidateCommunityEvents()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateCommunityEventAction = async (
    input: UpdateCommunityEventParams,
) => {
    try {
        const payload = updateCommunityEventParams.parse(input)
        await updateCommunityEvent(payload.id, payload)
        revalidateCommunityEvents()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteCommunityEventAction = async (input: CommunityEventId) => {
    try {
        const payload = communityEventIdSchema.parse({ id: input })
        await deleteCommunityEvent(payload.id)
        revalidateCommunityEvents()
    } catch (e) {
        return handleErrors(e)
    }
}
