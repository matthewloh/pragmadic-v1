import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db/index"
import { chatIdSchema, chats, type ChatId } from "@/lib/db/schema/chats"
import { and, eq } from "drizzle-orm"

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

