"use server"

import { revalidatePath } from "next/cache"
import {
    createState,
    deleteState,
    updateState,
} from "@/lib/api/states/mutations"
import {
    StateId,
    NewStateParams,
    UpdateStateParams,
    stateIdSchema,
    insertStateParams,
    updateStateParams,
} from "@/lib/db/schema/states"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateStates = () => revalidatePath("/states")

export const createStateAction = async (input: NewStateParams) => {
    try {
        const payload = insertStateParams.parse(input)
        await createState(payload)
        revalidateStates()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateStateAction = async (input: UpdateStateParams) => {
    try {
        const payload = updateStateParams.parse(input)
        await updateState(payload.id, payload)
        revalidateStates()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteStateAction = async (input: StateId) => {
    try {
        const payload = stateIdSchema.parse({ id: input })
        await deleteState(payload.id)
        revalidateStates()
    } catch (e) {
        return handleErrors(e)
    }
}
