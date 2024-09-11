"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/messages/useOptimisticMessages"
import { type Message } from "@/lib/db/schema/messages"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import MessageForm from "@/components/messages/MessageForm"
import { type Chat, type ChatId } from "@/lib/db/schema/chats"

export default function OptimisticMessage({
    message,
    chats,
    chatId,
}: {
    message: Message

    chats: Chat[]
    chatId?: ChatId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Message) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticMessage, setOptimisticMessage] = useOptimistic(message)
    const updateMessage: TAddOptimistic = (input) =>
        setOptimisticMessage({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <MessageForm
                    message={optimisticMessage}
                    chats={chats}
                    chatId={chatId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateMessage}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticMessage.role}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticMessage.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticMessage, null, 2)}
            </pre>
        </div>
    )
}
