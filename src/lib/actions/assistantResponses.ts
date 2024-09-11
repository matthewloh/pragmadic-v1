"use server"

import { revalidatePath } from "next/cache"
import {
    createAssistantResponse,
    deleteAssistantResponse,
    updateAssistantResponse,
} from "@/lib/api/assistantResponses/mutations"
import {
    AssistantResponseId,
    NewAssistantResponseParams,
    UpdateAssistantResponseParams,
    assistantResponseIdSchema,
    insertAssistantResponseParams,
    updateAssistantResponseParams,
} from "@/lib/db/schema/assistantResponses"

const handleErrors = (e: unknown) => {
    const errMsg = "Error, please try again."
    if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg
    if (e && typeof e === "object" && "error" in e) {
        const errAsStr = e.error as string
        return errAsStr.length > 0 ? errAsStr : errMsg
    }
    return errMsg
}

const revalidateAssistantResponses = () =>
    revalidatePath("/assistant-responses")

export const createAssistantResponseAction = async (
    input: NewAssistantResponseParams,
) => {
    try {
        const payload = insertAssistantResponseParams.parse(input)
        await createAssistantResponse(payload)
        revalidateAssistantResponses()
    } catch (e) {
        return handleErrors(e)
    }
}

export const updateAssistantResponseAction = async (
    input: UpdateAssistantResponseParams,
) => {
    try {
        const payload = updateAssistantResponseParams.parse(input)
        await updateAssistantResponse(payload.id, payload)
        revalidateAssistantResponses()
    } catch (e) {
        return handleErrors(e)
    }
}

export const deleteAssistantResponseAction = async (
    input: AssistantResponseId,
) => {
    try {
        const payload = assistantResponseIdSchema.parse({ id: input })
        await deleteAssistantResponse(payload.id)
        revalidateAssistantResponses()
    } catch (e) {
        return handleErrors(e)
    }
}
