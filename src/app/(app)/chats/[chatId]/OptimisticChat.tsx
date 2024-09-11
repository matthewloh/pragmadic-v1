"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/chats/useOptimisticChats"
import { type Chat } from "@/lib/db/schema/chats"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import ChatForm from "@/components/chats/ChatForm"

export default function OptimisticChat({ chat }: { chat: Chat }) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Chat) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticChat, setOptimisticChat] = useOptimistic(chat)
    const updateChat: TAddOptimistic = (input) =>
        setOptimisticChat({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <ChatForm
                    chat={optimisticChat}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateChat}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticChat.name}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticChat.id === "optimistic" ? "animate-pulse" : "",
                )}
            >
                {JSON.stringify(optimisticChat, null, 2)}
            </pre>
        </div>
    )
}
