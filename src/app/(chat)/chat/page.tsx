import { ChatRSC } from "@/features/chat/components/ChatRSC"
import { AI } from "@/lib/ai/actions"
import { getUserAuth } from "@/lib/auth/utils"
import { nanoid } from "@/lib/utils"

export const metadata = {
    title: "RAG Chatbot",
}

export default async function ChatIndexPage() {
    const chatId = nanoid()
    const session = await getUserAuth()
    // const modelString = searchParams.model ? `- ${searchParams.model}` : ""

    return (
        <AI initialAIState={{ chatId: chatId, messages: [] }}>
            <ChatRSC id={chatId} session={session} />
            {/* server component */}
            {/* <ChatHeader modelString={modelString} />
                {chatId ? (
                    <Suspense fallback={<div className="flex-1">Loading</div>}>
                        <ExistingChat chatId={chatId} />
                    </Suspense>
                ) : (
                    <ChatContentClient createChatAction={createChatAction} />
                )} */}
            {/* <div className="flex h-screen w-full flex-col">
            </div> */}
        </AI>
    )
}
