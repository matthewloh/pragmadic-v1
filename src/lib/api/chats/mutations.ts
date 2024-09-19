import { db } from "@/lib/db/index"
import { and, eq } from "drizzle-orm"
import {
    ChatId,
    NewChatParams,
    UpdateChatParams,
    updateChatSchema,
    insertChatSchema,
    chats,
    chatIdSchema,
} from "@/lib/db/schema/chats"
import { getUserAuth } from "@/lib/auth/utils"
import {
    insertMessageSchema,
    messages,
    NewMessageParams,
} from "@/lib/db/schema/messages"
import { ZodError } from "zod"

export const createChat = async (chat: NewChatParams) => {
    const { session } = await getUserAuth()
    const newChat = insertChatSchema.parse({
        ...chat,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db.insert(chats).values(newChat).returning()
        return { chat: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export async function createChatWithMessages(
    chatData: NewChatParams,
    messagesData: NewMessageParams[],
) {
    try {
        const { session } = await getUserAuth()
        if (!session?.user.id) {
            throw new Error("Unauthorized")
        }

        const userId = session.user.id

        return await db.transaction(async (tx) => {
            // Insert the chat
            const [newChat] = await tx
                .insert(chats)
                .values(insertChatSchema.parse({ ...chatData, userId }))
                .onConflictDoUpdate({
                    target: chats.id,
                    set: updateChatSchema.parse({ ...chatData, userId }),
                })
                .returning()

            // Insert the messages
            const messagesToInsert = messagesData.map((message) => ({
                ...message,
                chatId: newChat.id,
            }))
            console.log(messagesToInsert)
            await tx
                .insert(messages)
                .values(
                    messagesToInsert.map((msg) =>
                        insertMessageSchema.parse(msg),
                    ),
                )

            return newChat
        })
    } catch (error) {
        if (error instanceof ZodError) {
            console.error("Validation error:", error.errors)
            throw new Error("Invalid data provided")
        } else if (error instanceof Error) {
            console.error("Error creating chat with messages:", error.message)
            throw error
        } else {
            console.error("Unknown error:", error)
            throw new Error("An unexpected error occurred")
        }
    }
}

export const updateChat = async (id: ChatId, chat: UpdateChatParams) => {
    const { session } = await getUserAuth()
    const { id: chatId } = chatIdSchema.parse({ id })
    const newChat = updateChatSchema.parse({
        ...chat,
        userId: session?.user.id!,
    })
    try {
        const [c] = await db
            .update(chats)
            .set({ ...newChat, updatedAt: new Date() })
            .where(
                and(eq(chats.id, chatId!), eq(chats.userId, session?.user.id!)),
            )
            .returning()
        return { chat: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}

export const deleteChat = async (id: ChatId) => {
    const { session } = await getUserAuth()
    const { id: chatId } = chatIdSchema.parse({ id })
    try {
        const [c] = await db
            .delete(chats)
            .where(
                and(eq(chats.id, chatId!), eq(chats.userId, session?.user.id!)),
            )
            .returning()
        return { chat: c }
    } catch (err) {
        const message = (err as Error).message ?? "Error, please try again"
        console.error(message)
        throw { error: message }
    }
}
