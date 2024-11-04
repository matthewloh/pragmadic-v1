"use server"

import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db"
import { chats } from "@/lib/db/schema/chats"
import { Message } from "ai"
import { and, eq } from "drizzle-orm"
import { revalidatePath } from "next/cache"

export async function updateChatDescriptionAction(
    chatId: string,
    description: string,
) {
    try {
        const { session } = await getUserAuth()
        if (!session) {
            throw new Error("Unauthorized")
        }
        await db
            .update(chats)
            .set({ description })
            .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)))
        revalidatePath(`/chat/${chatId}`)
    } catch (error) {
        console.error(error)
        throw new Error("Error updating chat description")
    }
}

export async function updateChatNameAction(chatId: string, name: string) {
    try {
        const { session } = await getUserAuth()
        if (!session) {
            throw new Error("Unauthorized")
        }
        await db
            .update(chats)
            .set({ name })
            .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)))
        revalidatePath(`/chat/${chatId}`)
    } catch (error) {
        console.error(error)
        throw new Error("Error updating chat name")
    }
}

export async function deleteChatAction(chatId: string) {
    try {
        const { session } = await getUserAuth()
        if (!session) {
            throw new Error("Unauthorized")
        }
        await db
            .delete(chats)
            .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)))
        revalidatePath(`/chat/${chatId}`)
    } catch (error) {
        console.error(error)
        throw new Error("Error deleting chat")
    }
}

export async function updateChatMessagesAction(
    chatId: string,
    messages: Message[],
) {
    try {
        const { session } = await getUserAuth()
        if (!session) {
            throw new Error("Unauthorized")
        }
        await db
            .update(chats)
            .set({ messages: JSON.stringify(messages) })
            .where(and(eq(chats.id, chatId), eq(chats.userId, session.user.id)))
        revalidatePath(`/chat/${chatId}`)
    } catch (error) {
        console.error(error)
        throw new Error("Error updating chat messages")
    }
}
