import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db/index"
import { chats } from "@/lib/db/schema/chats"
import { Json } from "@/utils/supabase/types"
import { openai } from "@ai-sdk/openai"
import { generateObject } from "ai"
import { eq } from "drizzle-orm"
import { z } from "zod"

export async function createMessage({
    id,
    messages,
}: {
    id: string
    messages: Json
}) {
    const { session } = await getUserAuth()
    if (!session) {
        throw new Error("User not authenticated")
    }

    const userId = session?.user.id!

    const selectedChats = await db.select().from(chats).where(eq(chats.id, id))

    if (selectedChats.length > 0) {
        return await db
            .update(chats)
            .set({
                messages: JSON.stringify(messages),
            })
            .where(eq(chats.id, id))
    }
    const { object } = await generateObject({
        model: openai("gpt-4o-mini"),
        schema: z.object({
            name: z.string(),
            description: z.string(),
        }),
        prompt: `Generate a concise and descriptive name and description for the chat based on the following conversation
            <START_OF_CONVERSATION>
            ${JSON.stringify(messages)}
            <END_OF_CONVERSATION>`,
    })
    return await db.insert(chats).values({
        id,
        messages: JSON.stringify(messages),
        userId,
        name: object.name,
        description: object.description,
    })
}
