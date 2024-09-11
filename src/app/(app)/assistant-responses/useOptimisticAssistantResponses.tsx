import { type Message } from "@/lib/db/schema/messages"
import {
    type AssistantResponse,
    type CompleteAssistantResponse,
} from "@/lib/db/schema/assistantResponses"
import { OptimisticAction } from "@/lib/utils"
import { useOptimistic } from "react"

export type TAddOptimistic = (
    action: OptimisticAction<AssistantResponse>,
) => void

export const useOptimisticAssistantResponses = (
    assistantResponses: CompleteAssistantResponse[],
    messages: Message[],
) => {
    const [optimisticAssistantResponses, addOptimisticAssistantResponse] =
        useOptimistic(
            assistantResponses,
            (
                currentState: CompleteAssistantResponse[],
                action: OptimisticAction<AssistantResponse>,
            ): CompleteAssistantResponse[] => {
                const { data } = action

                const optimisticMessage = messages.find(
                    (message) => message.id === data.messageId,
                )!

                const optimisticAssistantResponse = {
                    ...data,
                    message: optimisticMessage,
                    id: "optimistic",
                }

                switch (action.action) {
                    case "create":
                        return currentState.length === 0
                            ? [optimisticAssistantResponse]
                            : [...currentState, optimisticAssistantResponse]
                    case "update":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, ...optimisticAssistantResponse }
                                : item,
                        )
                    case "delete":
                        return currentState.map((item) =>
                            item.id === data.id
                                ? { ...item, id: "delete" }
                                : item,
                        )
                    default:
                        return currentState
                }
            },
        )

    return { addOptimisticAssistantResponse, optimisticAssistantResponses }
}
