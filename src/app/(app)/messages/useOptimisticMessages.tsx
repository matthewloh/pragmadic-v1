import { type Chat } from "@/lib/db/schema/chats"
import { type Message, type CompleteMessage } from "@/lib/db/schema/messages"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (action: OptimisticAction<Message>) => void

export const useOptimisticMessages = (
    messages: CompleteMessage[],
    chats: Chat[],
) => {
    const [optimisticMessages, addOptimisticMessage] = useOptimistic(
        messages,
        (
            currentState: CompleteMessage[],
            action: OptimisticAction<Message>,
        ): CompleteMessage[] => {
            const { data } = action

            const optimisticChat = chats.find(
                (chat) => chat.id === data.chatId,
            )!

            const optimisticMessage = {
                ...data,
                chat: optimisticChat,
                id: "optimistic",
            }

            switch (action.action) {
                case "create":
                    return currentState.length === 0
                        ? [optimisticMessage]
                        : [...currentState, optimisticMessage]
                case "update":
                    return currentState.map((item) =>
                        item.id === data.id
                            ? { ...item, ...optimisticMessage }
                            : item,
                    )
                case "delete":
                    return currentState.map((item) =>
                        item.id === data.id ? { ...item, id: "delete" } : item,
                    )
                default:
                    return currentState
            }
        },
    )

    return { addOptimisticMessage, optimisticMessages }
}
