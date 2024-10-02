import { Chat } from "@/lib/db/schema/chats"
import { useQuery } from "@tanstack/react-query"

export const useChatHistory = () => {
    return useQuery<Chat[]>({
        queryKey: ["chat-history"],
        queryFn: async () => {
            const response = await fetch("/api/chat/history")
            if (!response.ok) {
                throw new Error("Failed to fetch chat history")
            }
            const chats = await response.json()
            return chats
        },
    })
}
