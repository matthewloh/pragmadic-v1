"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { type Message, CompleteMessage } from "@/lib/db/schema/messages"
import Modal from "@/components/shared/Modal"
import { type Chat, type ChatId } from "@/lib/db/schema/chats"
import { useOptimisticMessages } from "@/app/(app)/messages/useOptimisticMessages"
import { Button } from "@/components/ui/button"
import MessageForm from "./MessageForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (message?: Message) => void

export default function MessageList({
    messages,
    chats,
    chatId,
}: {
    messages: CompleteMessage[]
    chats: Chat[]
    chatId?: ChatId
}) {
    const { optimisticMessages, addOptimisticMessage } = useOptimisticMessages(
        messages,
        chats,
    )
    const [open, setOpen] = useState(false)
    const [activeMessage, setActiveMessage] = useState<Message | null>(null)
    const openModal = (message?: Message) => {
        setOpen(true)
        message ? setActiveMessage(message) : setActiveMessage(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeMessage ? "Edit Message" : "Create Message"}
            >
                <MessageForm
                    message={activeMessage}
                    addOptimistic={addOptimisticMessage}
                    openModal={openModal}
                    closeModal={closeModal}
                    chats={chats}
                    chatId={chatId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticMessages.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticMessages.map((message) => (
                        <Message
                            message={message}
                            key={message.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const Message = ({
    message,
    openModal,
}: {
    message: CompleteMessage
    openModal: TOpenModal
}) => {
    const optimistic = message.id === "optimistic"
    const deleting = message.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("messages")
        ? pathname
        : pathname + "/messages/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{message.role}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + message.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No messages
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new message.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Messages{" "}
                </Button>
            </div>
        </div>
    )
}
