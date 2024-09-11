import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getChatByIdWithMessages } from "@/lib/api/chats/queries"
import OptimisticChat from "./OptimisticChat"
import { checkAuth } from "@/lib/auth/utils"
import MessageList from "@/components/messages/MessageList"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function ChatPage({
    params,
}: {
    params: { chatId: string }
}) {
    return (
        <main className="overflow-auto">
            <Chat id={params.chatId} />
        </main>
    )
}

const Chat = async ({ id }: { id: string }) => {
    const { chat, messages } = await getChatByIdWithMessages(id)

    if (!chat) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="chats" />
                <OptimisticChat chat={chat} />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {chat.name}&apos;s Messages
                </h3>
                <MessageList chats={[]} chatId={chat.id} messages={messages} />
            </div>
        </Suspense>
    )
}
