import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/messages/useOptimisticMessages"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBackPath } from "@/components/shared/BackButton"

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { type Message, insertMessageParams } from "@/lib/db/schema/messages"
import {
    createMessageAction,
    deleteMessageAction,
    updateMessageAction,
} from "@/lib/actions/messages"
import { type Chat, type ChatId } from "@/lib/db/schema/chats"

const MessageForm = ({
    chats,
    chatId,
    message,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    message?: Message | null
    chats: Chat[]
    chatId?: ChatId
    openModal?: (message?: Message) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Message>(insertMessageParams)
    const editing = !!message?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("messages")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Message },
    ) => {
        const failed = Boolean(data?.error)
        if (failed) {
            openModal && openModal(data?.values)
            toast.error(`Failed to ${action}`, {
                description: data?.error ?? "Error",
            })
        } else {
            router.refresh()
            postSuccess && postSuccess()
            toast.success(`Message ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const messageParsed = await insertMessageParams.safeParseAsync({
            chatId,
            ...payload,
        })
        if (!messageParsed.success) {
            setErrors(messageParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = messageParsed.data
        const pendingMessage: Message = {
            updatedAt: message?.updatedAt ?? new Date(),
            createdAt: message?.createdAt ?? new Date(),
            id: message?.id ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingMessage,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateMessageAction({ ...values, id: message.id })
                    : await createMessageAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingMessage,
                }
                onSuccess(
                    editing ? "update" : "create",
                    error ? errorFormatted : undefined,
                )
            })
        } catch (e) {
            if (e instanceof z.ZodError) {
                setErrors(e.flatten().fieldErrors)
            }
        }
    }

    return (
        <form
            action={handleSubmit}
            onChange={handleChange}
            className={"space-y-8"}
        >
            {/* Schema fields start */}
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.role ? "text-destructive" : "",
                    )}
                >
                    Role
                </Label>
                <Input
                    type="text"
                    name="role"
                    className={cn(errors?.role ? "ring ring-destructive" : "")}
                    defaultValue={message?.role ?? ""}
                />
                {errors?.role ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.role[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.content ? "text-destructive" : "",
                    )}
                >
                    Content
                </Label>
                <Input
                    type="text"
                    name="content"
                    className={cn(
                        errors?.content ? "ring ring-destructive" : "",
                    )}
                    defaultValue={message?.content ?? ""}
                />
                {errors?.content ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.content[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {chatId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.chatId ? "text-destructive" : "",
                        )}
                    >
                        Chat
                    </Label>
                    <Select defaultValue={message?.chatId} name="chatId">
                        <SelectTrigger
                            className={cn(
                                errors?.chatId ? "ring ring-destructive" : "",
                            )}
                        >
                            <SelectValue placeholder="Select a chat" />
                        </SelectTrigger>
                        <SelectContent>
                            {chats?.map((chat) => (
                                <SelectItem
                                    key={chat.id}
                                    value={chat.id.toString()}
                                >
                                    {chat.id}
                                    {/* TODO: Replace with a field from the chat model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.chatId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.chatId[0]}
                        </p>
                    ) : (
                        <div className="h-6" />
                    )}
                </div>
            )}
            {/* Schema fields end */}

            {/* Save Button */}
            <SaveButton errors={hasErrors} editing={editing} />

            {/* Delete Button */}
            {editing ? (
                <Button
                    type="button"
                    disabled={isDeleting || pending || hasErrors}
                    variant={"destructive"}
                    onClick={() => {
                        setIsDeleting(true)
                        closeModal && closeModal()
                        startMutation(async () => {
                            addOptimistic &&
                                addOptimistic({
                                    action: "delete",
                                    data: message,
                                })
                            const error = await deleteMessageAction(message.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: message,
                            }

                            onSuccess(
                                "delete",
                                error ? errorFormatted : undefined,
                            )
                        })
                    }}
                >
                    Delet{isDeleting ? "ing..." : "e"}
                </Button>
            ) : null}
        </form>
    )
}

export default MessageForm

const SaveButton = ({
    editing,
    errors,
}: {
    editing: Boolean
    errors: boolean
}) => {
    const { pending } = useFormStatus()
    const isCreating = pending && editing === false
    const isUpdating = pending && editing === true
    return (
        <Button
            type="submit"
            className="mr-2"
            disabled={isCreating || isUpdating || errors}
            aria-disabled={isCreating || isUpdating || errors}
        >
            {editing
                ? `Sav${isUpdating ? "ing..." : "e"}`
                : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
    )
}
