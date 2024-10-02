import ChatContentClient from "@/features/chat/components/ChatContentClient"
import ChatSettingsSidebar from "@/features/chat/components/ChatSettingsSidebar"
import { nanoid } from "@/lib/utils"

export default async function ChatPage({}: {}) {
    const chatId = await nanoid()
    return (
        <div className="flex h-screen w-full flex-col">
            <ChatContentClient chatId={chatId} initialMessages={[]} />
        </div>
    )
}
