"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/assistant-responses/useOptimisticAssistantResponses"
import { type AssistantResponse } from "@/lib/db/schema/assistantResponses"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import AssistantResponseForm from "@/components/assistantResponses/AssistantResponseForm"
import { type Message, type MessageId } from "@/lib/db/schema/messages"

export default function OptimisticAssistantResponse({
    assistantResponse,
    messages,
    messageId,
}: {
    assistantResponse: AssistantResponse

    messages: Message[]
    messageId?: MessageId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: AssistantResponse) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticAssistantResponse, setOptimisticAssistantResponse] =
        useOptimistic(assistantResponse)
    const updateAssistantResponse: TAddOptimistic = (input) =>
        setOptimisticAssistantResponse({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <AssistantResponseForm
                    assistantResponse={optimisticAssistantResponse}
                    messages={messages}
                    messageId={messageId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateAssistantResponse}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticAssistantResponse.toolInvocations}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticAssistantResponse.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticAssistantResponse, null, 2)}
            </pre>
        </div>
    )
}
