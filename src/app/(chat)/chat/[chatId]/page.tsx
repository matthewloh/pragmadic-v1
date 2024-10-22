import ChatContentClient from "@/features/chat/components/ChatContentClient"
import { getChatById } from "@/lib/api/chats/queries"
import { Chat } from "@/lib/db/schema/chats"
import { type Message } from "ai"
import { notFound } from "next/navigation"

export default async function ChatById(
    props: {
        params: Promise<{ chatId: string }>
    }
) {
    const params = await props.params;
    const { chatId } = params
    const { chat: chatFromDb } = await getChatById(chatId)
    if (!chatFromDb) {
        notFound()
    }

    // type casting
    const chat: Chat = {
        ...chatFromDb,
        messages: chatFromDb.messages as Message[],
    }
    return (
        <div className="flex h-screen w-full flex-col">
            <ChatContentClient
                chatId={chatId}
                initialMessages={chat.messages}
            />
        </div>
    )
}
