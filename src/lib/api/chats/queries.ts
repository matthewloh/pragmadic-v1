import { db } from "@/lib/db/index"
import { eq, and } from "drizzle-orm"
import { getUserAuth } from "@/lib/auth/utils"
import { type ChatId, chatIdSchema, chats } from "@/lib/db/schema/chats"
import { messages, type CompleteMessage } from "@/lib/db/schema/messages"

export const getChats = async () => {
    const { session } = await getUserAuth()
    const rows = await db
        .select()
        .from(chats)
        .where(eq(chats.userId, session?.user.id!))
    const c = rows
    return { chats: c }
}

export const getChatById = async (id: ChatId) => {
    const { session } = await getUserAuth()
    const { id: chatId } = chatIdSchema.parse({ id })
    const [row] = await db
        .select()
        .from(chats)
        .where(and(eq(chats.id, chatId), eq(chats.userId, session?.user.id!)))
    if (row === undefined) return {}
    const c = row
    return { chat: c }
}

export const getChatByIdWithMessages = async (id: ChatId) => {
    const { session } = await getUserAuth()
    const { id: chatId } = chatIdSchema.parse({ id })
    const rows = await db
        .select({ chat: chats, message: messages })
        .from(chats)
        .where(and(eq(chats.id, chatId), eq(chats.userId, session?.user.id!)))
        .leftJoin(messages, eq(chats.id, messages.chatId))
    if (rows.length === 0) return {}
    const c = rows[0].chat
    const cm = rows
        .filter((r) => r.message !== null)
        .map((m) => m.message) as CompleteMessage[]

    return { chat: c, messages: cm }
}
