import { Suspense } from "react"
import { notFound } from "next/navigation"

import { getMessageByIdWithAssistantResponses } from "@/lib/api/messages/queries"
import { getChats } from "@/lib/api/chats/queries"
import OptimisticMessage from "@/app/(app)/messages/[messageId]/OptimisticMessage"
import AssistantResponseList from "@/components/assistantResponses/AssistantResponseList"

import { BackButton } from "@/components/shared/BackButton"
import Loading from "@/app/loading"

export const revalidate = 0

export default async function MessagePage({
    params,
}: {
    params: { messageId: string }
}) {
    return (
        <main className="overflow-auto">
            <Message id={params.messageId} />
        </main>
    )
}

const Message = async ({ id }: { id: string }) => {
    const { message, assistantResponses } =
        await getMessageByIdWithAssistantResponses(id)
    const { chats } = await getChats()

    if (!message) notFound()
    return (
        <Suspense fallback={<Loading />}>
            <div className="relative">
                <BackButton currentResource="messages" />
                <OptimisticMessage
                    message={message}
                    chats={chats}
                    chatId={message.chatId}
                />
            </div>
            <div className="relative mx-4 mt-8">
                <h3 className="mb-4 text-xl font-medium">
                    {message.role}&apos;s Assistant Responses
                </h3>
                <AssistantResponseList
                    messages={[]}
                    messageId={message.id}
                    assistantResponses={assistantResponses}
                />
            </div>
        </Suspense>
    )
}
