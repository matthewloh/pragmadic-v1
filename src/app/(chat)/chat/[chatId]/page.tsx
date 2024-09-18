import { type Metadata } from "next"
import { notFound, redirect } from "next/navigation"

import { getChatById, getChatByIdWithMessages } from "@/lib/api/chats/queries"
import { ChatRSC } from "@/features/chat/components/ChatRSC"
import { AI } from "@/lib/ai/actions"
import { getSession } from "../../../../../supabase/queries/cached-queries"

export interface ChatPageProps {
    params: {
        id: string
    }
}

export async function generateMetadata({
    params,
}: ChatPageProps): Promise<Metadata> {
    const {
        data: { session },
    } = await getSession()

    if (!session?.user) {
        return {}
    }

    const { chat } = await getChatById(params.id)

    if (!chat || "error" in chat) {
        redirect("/")
    } else {
        return {
            title: chat?.name?.toString().slice(0, 50) ?? "Chat",
        }
    }
}

export default async function ChatPage({ params }: ChatPageProps) {
    const {
        data: { session },
    } = await getSession()

    if (!session?.user) {
        redirect(`/login?next=/chat/${params.id}`)
    }

    const { chat, messages } = await getChatByIdWithMessages(params.id)

    if (!chat || "error" in chat) {
        redirect("/")
    } else {
        if (chat?.userId !== session?.user?.id) {
            notFound()
        }

        return (
            <AI
                initialAIState={{
                    chatId: chat.id,
                    messages: messages,
                }}
            >
                <ChatRSC
                    id={chat.id}
                    session={session}
                    initialMessages={messages}
                />
            </AI>
        )
    }
}
