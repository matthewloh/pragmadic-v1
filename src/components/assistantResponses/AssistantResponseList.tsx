"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type AssistantResponse,
    CompleteAssistantResponse,
} from "@/lib/db/schema/assistantResponses"
import Modal from "@/components/shared/Modal"
import { type Message, type MessageId } from "@/lib/db/schema/messages"
import { useOptimisticAssistantResponses } from "@/app/(app)/assistant-responses/useOptimisticAssistantResponses"
import { Button } from "@/components/ui/button"
import AssistantResponseForm from "./AssistantResponseForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (assistantResponse?: AssistantResponse) => void

export default function AssistantResponseList({
    assistantResponses,
    messages,
    messageId,
}: {
    assistantResponses: CompleteAssistantResponse[]
    messages: Message[]
    messageId?: MessageId
}) {
    const { optimisticAssistantResponses, addOptimisticAssistantResponse } =
        useOptimisticAssistantResponses(assistantResponses, messages)
    const [open, setOpen] = useState(false)
    const [activeAssistantResponse, setActiveAssistantResponse] =
        useState<AssistantResponse | null>(null)
    const openModal = (assistantResponse?: AssistantResponse) => {
        setOpen(true)
        assistantResponse
            ? setActiveAssistantResponse(assistantResponse)
            : setActiveAssistantResponse(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeAssistantResponse
                        ? "Edit AssistantResponse"
                        : "Create Assistant Response"
                }
            >
                <AssistantResponseForm
                    assistantResponse={activeAssistantResponse}
                    addOptimistic={addOptimisticAssistantResponse}
                    openModal={openModal}
                    closeModal={closeModal}
                    messages={messages}
                    messageId={messageId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticAssistantResponses.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticAssistantResponses.map((assistantResponse) => (
                        <AssistantResponse
                            assistantResponse={assistantResponse}
                            key={assistantResponse.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const AssistantResponse = ({
    assistantResponse,
    openModal,
}: {
    assistantResponse: CompleteAssistantResponse
    openModal: TOpenModal
}) => {
    const optimistic = assistantResponse.id === "optimistic"
    const deleting = assistantResponse.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("assistant-responses")
        ? pathname
        : pathname + "/assistant-responses/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{assistantResponse.toolInvocations}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + assistantResponse.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No assistant responses
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new assistant response.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Assistant Responses{" "}
                </Button>
            </div>
        </div>
    )
}
