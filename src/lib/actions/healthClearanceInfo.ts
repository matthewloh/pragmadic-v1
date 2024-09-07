"use server"

import { revalidatePath } from "next/cache"
import {
    createHealthClearanceInfo,
    deleteHealthClearanceInfo,
    updateHealthClearanceInfo,
} from "@/lib/api/healthClearanceInfo/mutations"
import {
    HealthClearanceInfoId,
    NewHealthClearanceInfoParams,
    UpdateHealthClearanceInfoParams,
    healthClearanceInfoIdSchema,
    insertHealthClearanceInfoParams,
    updateHealthClearanceInfoParams,
} from "@/lib/db/schema/healthClearanceInfo"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateHealthClearanceInfos = () =>
    revalidatePath("/health-clearance-info")

export const createHealthClearanceInfoAction = async (
    input: NewHealthClearanceInfoParams,
) => {
    try {
        const payload = insertHealthClearanceInfoParams.parse(input)
        await createHealthClearanceInfo(payload)
        revalidateHealthClearanceInfos()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateHealthClearanceInfoAction = async (
    input: UpdateHealthClearanceInfoParams,
) => {
    try {
        const payload = updateHealthClearanceInfoParams.parse(input)
        await updateHealthClearanceInfo(payload.id, payload)
        revalidateHealthClearanceInfos()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteHealthClearanceInfoAction = async (
    input: HealthClearanceInfoId,
) => {
    try {
        const payload = healthClearanceInfoIdSchema.parse({ id: input })
        await deleteHealthClearanceInfo(payload.id)
        revalidateHealthClearanceInfos()
    } catch (e) {
        return handleErrors(e)
    }
}
