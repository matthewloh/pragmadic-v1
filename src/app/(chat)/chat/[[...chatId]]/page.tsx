"use client"

import ChatContentClient from "@/features/chat/components/ChatContentClient"
import ChatHeader from "@/features/chat/components/ChatHeader"
import ExistingChat from "@/features/chat/components/ExistingChat"
import { createChatAction } from "@/lib/actions/chats"
import { Suspense } from "react"

type ChatPageSearchParams = {
    model?: string
    chatId?: string
}

export default function ChatPage({
    searchParams,
    params,
}: {
    searchParams: ChatPageSearchParams
    params: { chatId: string }
}) {
    const modelString = searchParams.model ? `- ${searchParams.model}` : ""
    const chatId = params.chatId ? params.chatId : ""
    console.log(chatId)

    return (
        <div className="flex h-screen w-full flex-col">
            {/* server component */}
            <ChatHeader modelString={modelString} />
            {chatId ? (
                <Suspense fallback={<div className="flex-1">Loading</div>}>
                    <ExistingChat chatId={chatId} />
                </Suspense>
            ) : (
                <ChatContentClient createChatAction={createChatAction} />
            )}
        </div>
    )
}
