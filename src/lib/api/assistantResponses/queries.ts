import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    type AssistantResponseId,
    assistantResponseIdSchema,
    assistantResponses,
} from "@/lib/db/schema/assistantResponses"
import { messages } from "@/lib/db/schema/messages"

export const getAssistantResponses = async () => {
    const rows = await db
        .select({ assistantResponse: assistantResponses, message: messages })
        .from(assistantResponses)
        .leftJoin(messages, eq(assistantResponses.messageId, messages.id))
    const a = rows.map((r) => ({ ...r.assistantResponse, message: r.message }))
    return { assistantResponses: a }
}

export const getAssistantResponseById = async (id: AssistantResponseId) => {
    const { id: assistantResponseId } = assistantResponseIdSchema.parse({ id })
    const [row] = await db
        .select({ assistantResponse: assistantResponses, message: messages })
        .from(assistantResponses)
        .where(eq(assistantResponses.id, assistantResponseId))
        .leftJoin(messages, eq(assistantResponses.messageId, messages.id))
    if (row === undefined) return {}
    const a = { ...row.assistantResponse, message: row.message }
    return { assistantResponse: a }
}
