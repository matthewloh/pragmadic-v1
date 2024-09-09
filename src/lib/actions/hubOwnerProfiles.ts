"use server"

import { revalidatePath } from "next/cache"
import {
    createHubOwnerProfile,
    deleteHubOwnerProfile,
    updateHubOwnerProfile,
} from "@/lib/api/hubOwnerProfiles/mutations"
import {
    HubOwnerProfileId,
    NewHubOwnerProfileParams,
    UpdateHubOwnerProfileParams,
    hubOwnerProfileIdSchema,
    insertHubOwnerProfileParams,
    updateHubOwnerProfileParams,
} from "@/lib/db/schema/hubOwnerProfiles"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateHubOwnerProfiles = () => revalidatePath("/hub-owner-profiles")

export const createHubOwnerProfileAction = async (
    input: NewHubOwnerProfileParams,
) => {
    try {
        const payload = insertHubOwnerProfileParams.parse(input)
        await createHubOwnerProfile(payload)
        revalidateHubOwnerProfiles()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateHubOwnerProfileAction = async (
    input: UpdateHubOwnerProfileParams,
) => {
    try {
        const payload = updateHubOwnerProfileParams.parse(input)
        await updateHubOwnerProfile(payload.id, payload)
        revalidateHubOwnerProfiles()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteHubOwnerProfileAction = async (input: HubOwnerProfileId) => {
    try {
        const payload = hubOwnerProfileIdSchema.parse({ id: input })
        await deleteHubOwnerProfile(payload.id)
        revalidateHubOwnerProfiles()
    } catch (e) {
        return handleErrors(e)
    }
}
