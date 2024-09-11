import { db } from "@/lib/db/index"
import { eq } from "drizzle-orm"
import {
    type MessageId,
    messageIdSchema,
    messages,
} from "@/lib/db/schema/messages"
import { chats } from "@/lib/db/schema/chats"
import {
    assistantResponses,
    type CompleteAssistantResponse,
} from "@/lib/db/schema/assistantResponses"

export const getMessages = async () => {
    const rows = await db
        .select({ message: messages, chat: chats })
        .from(messages)
        .leftJoin(chats, eq(messages.chatId, chats.id))
    const m = rows.map((r) => ({ ...r.message, chat: r.chat }))
    return { messages: m }
}

export const getMessageById = async (id: MessageId) => {
    const { id: messageId } = messageIdSchema.parse({ id })
    const [row] = await db
        .select({ message: messages, chat: chats })
        .from(messages)
        .where(eq(messages.id, messageId))
        .leftJoin(chats, eq(messages.chatId, chats.id))
    if (row === undefined) return {}
    const m = { ...row.message, chat: row.chat }
    return { message: m }
}

export const getMessageByIdWithAssistantResponses = async (id: MessageId) => {
    const { id: messageId } = messageIdSchema.parse({ id })
    const rows = await db
        .select({ message: messages, assistantResponse: assistantResponses })
        .from(messages)
        .where(eq(messages.id, messageId))
        .leftJoin(
            assistantResponses,
            eq(messages.id, assistantResponses.messageId),
        )
    if (rows.length === 0) return {}
    const m = rows[0].message
    const ma = rows
        .filter((r) => r.assistantResponse !== null)
        .map((a) => a.assistantResponse) as CompleteAssistantResponse[]

    return { message: m, assistantResponses: ma }
}
