import ChatContentClient from "@/features/chat/components/ChatContentClient"
import { nanoid } from "@/lib/utils"

export default async function ChatPage({}: {}) {
    const chatId = await nanoid()
    return (
        <div className="flex h-screen w-full flex-col bg-background/50">
            <ChatContentClient chatId={chatId} initialMessages={[]} />
        </div>
    )
}
