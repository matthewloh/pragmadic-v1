import { ChatRSC } from "@/features/chat/components/ChatRSC"
import { AI } from "@/lib/ai/actions"
import { getUserAuth } from "@/lib/auth/utils"
import { nanoid } from "@/lib/utils"

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
    const id = nanoid()
    const session = await getUserAuth()
    const modelString = searchParams.model ? `- ${searchParams.model}` : ""
    const chatId = params.chatId ? params.chatId : ""

    return (
        <AI initialAIState={{ chatId: id, messages: [] }}>
            <div className="flex h-screen w-full flex-col">
                <ChatRSC id={id} session={session} />
                {/* server component */}
                {/* <ChatHeader modelString={modelString} />
                {chatId ? (
                    <Suspense fallback={<div className="flex-1">Loading</div>}>
                        <ExistingChat chatId={chatId} />
                    </Suspense>
                ) : (
                    <ChatContentClient createChatAction={createChatAction} />
                )} */}
            </div>
        </AI>
    )
}
