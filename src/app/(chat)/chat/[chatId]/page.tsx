import { ChatComponent } from "@/features/chat/components/ChatComponent"
import ChatContentClient from "@/features/chat/components/ChatContentClient"
import ChatHeader from "@/features/chat/components/ChatHeader"
import { getChatById } from "@/lib/api/chats/queries"
import { Chat } from "@/lib/db/schema/chats"
import { type Message } from "ai"
import { notFound } from "next/navigation"

type ChatPageSearchParams = {
    model?: string
    chatId?: string
}

export default async function ChatById({
    params,
}: {
    params: { chatId: string }
}) {
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