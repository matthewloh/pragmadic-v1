"use server"

import { revalidatePath } from "next/cache"
import {
    createRegion,
    deleteRegion,
    updateRegion,
} from "@/lib/api/regions/mutations"
import {
    RegionId,
    NewRegionParams,
    UpdateRegionParams,
    regionIdSchema,
    insertRegionParams,
    updateRegionParams,
} from "@/lib/db/schema/regions"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateRegions = () => revalidatePath("/regions")

export const createRegionAction = async (input: NewRegionParams) => {
    try {
        const payload = insertRegionParams.parse(input)
        await createRegion(payload)
        revalidateRegions()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateRegionAction = async (input: UpdateRegionParams) => {
    try {
        const payload = updateRegionParams.parse(input)
        await updateRegion(payload.id, payload)
        revalidateRegions()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteRegionAction = async (input: RegionId) => {
    try {
        const payload = regionIdSchema.parse({ id: input })
        await deleteRegion(payload.id)
        revalidateRegions()
    } catch (e) {
        return handleErrors(e)
    }
}
