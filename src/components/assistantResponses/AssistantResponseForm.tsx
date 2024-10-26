import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/assistant-responses/useOptimisticAssistantResponses"

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

import {
    type AssistantResponse,
    insertAssistantResponseParams,
} from "@/lib/db/schema/assistantResponses"
import {
    createAssistantResponseAction,
    deleteAssistantResponseAction,
    updateAssistantResponseAction,
} from "@/lib/actions/assistantResponses"
import { type Message, type MessageId } from "@/lib/db/schema/messages"

const AssistantResponseForm = ({
    messages,
    messageId,
    assistantResponse,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    assistantResponse?: AssistantResponse | null
    messages: Message[]
    messageId?: MessageId
    openModal?: (assistantResponse?: AssistantResponse) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<AssistantResponse>(insertAssistantResponseParams)
    const editing = !!assistantResponse?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("assistant-responses")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: AssistantResponse },
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
            toast.success(`AssistantResponse ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const assistantResponseParsed =
            await insertAssistantResponseParams.safeParseAsync({
                messageId,
                ...payload,
            })
        if (!assistantResponseParsed.success) {
            setErrors(assistantResponseParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = assistantResponseParsed.data
        const pendingAssistantResponse: AssistantResponse = {
            id: assistantResponse?.id ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingAssistantResponse,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateAssistantResponseAction({
                          ...values,
                          id: assistantResponse.id,
                      })
                    : await createAssistantResponseAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingAssistantResponse,
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
                        errors?.toolInvocations ? "text-destructive" : "",
                    )}
                >
                    Tool Invocations
                </Label>
                <Input
                    type="text"
                    name="toolInvocations"
                    className={cn(
                        errors?.toolInvocations ? "ring ring-destructive" : "",
                    )}
                    defaultValue={assistantResponse?.toolInvocations ?? ""}
                />
                {errors?.toolInvocations ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.toolInvocations[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.usage ? "text-destructive" : "",
                    )}
                >
                    Usage
                </Label>
                <Input
                    type="text"
                    name="usage"
                    className={cn(errors?.usage ? "ring ring-destructive" : "")}
                    defaultValue={assistantResponse?.usage ?? ""}
                />
                {errors?.usage ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.usage[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.finishReason ? "text-destructive" : "",
                    )}
                >
                    Finish Reason
                </Label>
                <Input
                    type="text"
                    name="finishReason"
                    className={cn(
                        errors?.finishReason ? "ring ring-destructive" : "",
                    )}
                    defaultValue={assistantResponse?.finishReason ?? ""}
                />
                {errors?.finishReason ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.finishReason[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {messageId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.messageId ? "text-destructive" : "",
                        )}
                    >
                        Message
                    </Label>
                    <Select
                        defaultValue={assistantResponse?.messageId}
                        name="messageId"
                    >
                        <SelectTrigger
                            className={cn(
                                errors?.messageId
                                    ? "ring ring-destructive"
                                    : "",
                            )}
                        >
                            <SelectValue placeholder="Select a message" />
                        </SelectTrigger>
                        <SelectContent>
                            {messages?.map((message) => (
                                <SelectItem
                                    key={message.id}
                                    value={message.id.toString()}
                                >
                                    {message.id}
                                    {/* TODO: Replace with a field from the message model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.messageId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.messageId[0]}
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
                                    data: assistantResponse,
                                })
                            const error = await deleteAssistantResponseAction(
                                assistantResponse.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: assistantResponse,
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

export default AssistantResponseForm

const SaveButton = ({
    editing,
    errors,
}: {
    editing: boolean
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
