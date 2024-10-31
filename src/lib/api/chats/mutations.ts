import { getUserAuth } from "@/lib/auth/utils"
import { db } from "@/lib/db/index"
import { chats } from "@/lib/db/schema/chats"
import { Json } from "@/utils/supabase/types"
import { eq } from "drizzle-orm"

export async function createMessage({
    id,
    messages,
}: {
    id: string
    messages: Json
}) {
    const { session } = await getUserAuth()
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

    return await db.insert(chats).values({
        id,
        messages: JSON.stringify(messages),
        userId,
        name: "Test Name",
        description: "Test Description",
    })
}
