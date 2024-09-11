import { Suspense } from "react"

import Loading from "@/app/loading"
import MessageList from "@/components/messages/MessageList"
import { getMessages } from "@/lib/api/messages/queries"
import { getChats } from "@/lib/api/chats/queries"

export const revalidate = 0

export default async function MessagesPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Messages</h1>
                </div>
                <Messages />
            </div>
        </main>
    )
}

const Messages = async () => {
    const { messages } = await getMessages()
    const { chats } = await getChats()
    return (
        <Suspense fallback={<Loading />}>
            <MessageList messages={messages} chats={chats} />
        </Suspense>
    )
}
