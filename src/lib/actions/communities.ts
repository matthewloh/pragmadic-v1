"use server"

import { revalidatePath } from "next/cache"
import {
    createCommunity,
    deleteCommunity,
    updateCommunity,
} from "@/lib/api/communities/mutations"
import {
    CommunityId,
    NewCommunityParams,
    UpdateCommunityParams,
    communityIdSchema,
    insertCommunityParams,
    updateCommunityParams,
} from "@/lib/db/schema/communities"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateCommunities = () => revalidatePath("/communities")

export const createCommunityAction = async (input: NewCommunityParams) => {
    try {
        const payload = insertCommunityParams.parse(input)
        await createCommunity(payload)
        revalidateCommunities()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateCommunityAction = async (input: UpdateCommunityParams) => {
    try {
        const payload = updateCommunityParams.parse(input)
        await updateCommunity(payload.id, payload)
        revalidateCommunities()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteCommunityAction = async (input: CommunityId) => {
    try {
        const payload = communityIdSchema.parse({ id: input })
        await deleteCommunity(payload.id)
        revalidateCommunities()
    } catch (e) {
        return handleErrors(e)
    }
}
