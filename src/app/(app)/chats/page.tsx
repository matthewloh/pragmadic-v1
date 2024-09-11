import { Suspense } from "react"

import Loading from "@/app/loading"
import ChatList from "@/components/chats/ChatList"
import { getChats } from "@/lib/api/chats/queries"

import { checkAuth } from "@/lib/auth/utils"

export const revalidate = 0

export default async function ChatsPage() {
    return (
        <main>
            <div className="relative">
                <div className="flex justify-between">
                    <h1 className="my-2 text-2xl font-semibold">Chats</h1>
                </div>
                <Chats />
            </div>
        </main>
    )
}

const Chats = async () => {
    const { chats } = await getChats()

    return (
        <Suspense fallback={<Loading />}>
            <ChatList chats={chats} />
        </Suspense>
    )
}
