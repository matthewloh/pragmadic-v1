import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    AssistantResponseId,
    NewAssistantResponseParams,
    UpdateAssistantResponseParams,
    updateAssistantResponseSchema,
    insertAssistantResponseSchema,
    assistantResponses,
    assistantResponseIdSchema,
} from "@/lib/db/schema/assistantResponses"

export const createAssistantResponse = async (
    assistantResponse: NewAssistantResponseParams,
) => {
    const newAssistantResponse =
        insertAssistantResponseSchema.parse(assistantResponse)
    try {
        const [a] = await db
            .insert(assistantResponses)
            .values(newAssistantResponse)
            .returning()
        return { assistantResponse: a }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const updateAssistantResponse = async (
    id: AssistantResponseId,
    assistantResponse: UpdateAssistantResponseParams,
) => {
    const { id: assistantResponseId } = assistantResponseIdSchema.parse({ id })
    const newAssistantResponse =
        updateAssistantResponseSchema.parse(assistantResponse)
    try {
        const [a] = await db
            .update(assistantResponses)
            .set(newAssistantResponse)
            .where(eq(assistantResponses.id, assistantResponseId!))
            .returning()
        return { assistantResponse: a }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteAssistantResponse = async (id: AssistantResponseId) => {
    const { id: assistantResponseId } = assistantResponseIdSchema.parse({ id })
    try {
        const [a] = await db
            .delete(assistantResponses)
            .where(eq(assistantResponses.id, assistantResponseId!))
            .returning()
        return { assistantResponse: a }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
