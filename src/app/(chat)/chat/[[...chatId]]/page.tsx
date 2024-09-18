import ChatContentClient from "@/features/chat/components/ChatContentClient"
import ChatHeader from "@/features/chat/components/ChatHeader"
import ExistingChat from "@/features/chat/components/ExistingChat"
import { createChatAction } from "@/lib/actions/chats"
import { nanoid } from "@/lib/utils"
import { Suspense } from "react"

type ChatPageSearchParams = {
    model?: string
    chatId?: string
}

export default async function ChatPage({
    searchParams,
    params,
}: {
    searchParams: ChatPageSearchParams
    params: { chatId: string }
}) {
    const chatId = await nanoid()
    const modelString = searchParams.model ? `- ${searchParams.model}` : ""
    // const chatId = params.chatId ? params.chatId : ""
    console.log(chatId)

    return (
        <div className="flex h-screen w-full flex-col">
            {/* server component */}
            <ChatHeader modelString={modelString} />
            <ChatContentClient chatId={chatId} />
            {/* {chatId ? (
                <Suspense fallback={<div className="flex-1">Loading</div>}>
                    <ExistingChat chatId={chatId} />
                </Suspense>
            ) : (
                <ChatContentClient createChatAction={createChatAction} />
            )} */}
        </div>
    )
}
