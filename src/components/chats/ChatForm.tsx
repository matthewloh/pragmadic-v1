import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/chats/useOptimisticChats"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBackPath } from "@/components/shared/BackButton"

import { type Chat, insertChatParams } from "@/lib/db/schema/chats"
import {
    createChatAction,
    deleteChatAction,
    updateChatAction,
} from "@/lib/actions/chats"

const ChatForm = ({
    chat,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    chat?: Chat | null

    openModal?: (chat?: Chat) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Chat>(insertChatParams)
    const editing = !!chat?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("chats")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Chat },
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
            toast.success(`Chat ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const chatParsed = await insertChatParams.safeParseAsync({ ...payload })
        if (!chatParsed.success) {
            setErrors(chatParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = chatParsed.data
        const pendingChat: Chat = {
            updatedAt: chat?.updatedAt ?? new Date(),
            createdAt: chat?.createdAt ?? new Date(),
            userId: chat?.userId ?? "",
            ...values,
            id: chat?.id ?? "",
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingChat,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateChatAction({ ...values, id: chat.id })
                    : await createChatAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingChat,
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
                        errors?.name ? "text-destructive" : "",
                    )}
                >
                    Name
                </Label>
                <Input
                    type="text"
                    name="name"
                    className={cn(errors?.name ? "ring ring-destructive" : "")}
                    defaultValue={chat?.name ?? ""}
                />
                {errors?.name ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.name[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.description ? "text-destructive" : "",
                    )}
                >
                    Description
                </Label>
                <Input
                    type="text"
                    name="description"
                    className={cn(
                        errors?.description ? "ring ring-destructive" : "",
                    )}
                    defaultValue={chat?.description ?? ""}
                />
                {errors?.description ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.description[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
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
                                addOptimistic({ action: "delete", data: chat })
                            const error = await deleteChatAction(chat.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: chat,
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

export default ChatForm

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
