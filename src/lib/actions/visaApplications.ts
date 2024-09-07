"use server"

import { revalidatePath } from "next/cache"
import {
    createVisaApplication,
    deleteVisaApplication,
    updateVisaApplication,
} from "@/lib/api/visaApplications/mutations"
import {
    VisaApplicationId,
    NewVisaApplicationParams,
    UpdateVisaApplicationParams,
    visaApplicationIdSchema,
    insertVisaApplicationParams,
    updateVisaApplicationParams,
} from "@/lib/db/schema/visaApplications"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateVisaApplications = () => revalidatePath("/visa-applications")

export const createVisaApplicationAction = async (
    input: NewVisaApplicationParams,
) => {
    try {
        const payload = insertVisaApplicationParams.parse(input)
        await createVisaApplication(payload)
        revalidateVisaApplications()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateVisaApplicationAction = async (
    input: UpdateVisaApplicationParams,
) => {
    try {
        const payload = updateVisaApplicationParams.parse(input)
        await updateVisaApplication(payload.id, payload)
        revalidateVisaApplications()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteVisaApplicationAction = async (input: VisaApplicationId) => {
    try {
        const payload = visaApplicationIdSchema.parse({ id: input })
        await deleteVisaApplication(payload.id)
        revalidateVisaApplications()
    } catch (e) {
        return handleErrors(e)
    }
}
