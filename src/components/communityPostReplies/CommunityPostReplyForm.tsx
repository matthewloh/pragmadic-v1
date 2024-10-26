import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/community-post-replies/useOptimisticCommunityPostReplies"

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
    type CommunityPostReply,
    insertCommunityPostReplyParams,
} from "@/lib/db/schema/communityPostReplies"
import {
    createCommunityPostReplyAction,
    deleteCommunityPostReplyAction,
    updateCommunityPostReplyAction,
} from "@/lib/actions/communityPostReplies"
import {
    type CommunityPost,
    type CommunityPostId,
} from "@/lib/db/schema/communityPosts"

const CommunityPostReplyForm = ({
    communityPosts,
    communityPostId,
    communityPostReply,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    communityPostReply?: CommunityPostReply | null
    communityPosts: CommunityPost[]
    communityPostId?: CommunityPostId
    openModal?: (communityPostReply?: CommunityPostReply) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<CommunityPostReply>(insertCommunityPostReplyParams)
    const editing = !!communityPostReply?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("community-post-replies")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: CommunityPostReply },
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
            toast.success(`CommunityPostReply ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const communityPostReplyParsed =
            await insertCommunityPostReplyParams.safeParseAsync({
                communityPostId,
                ...payload,
            })
        if (!communityPostReplyParsed.success) {
            setErrors(communityPostReplyParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = communityPostReplyParsed.data
        const pendingCommunityPostReply: CommunityPostReply = {
            updatedAt: communityPostReply?.updatedAt ?? new Date(),
            createdAt: communityPostReply?.createdAt ?? new Date(),
            id: communityPostReply?.id ?? "",
            userId: communityPostReply?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingCommunityPostReply,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateCommunityPostReplyAction({
                          ...values,
                          id: communityPostReply.id,
                      })
                    : await createCommunityPostReplyAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingCommunityPostReply,
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
                    defaultValue={communityPostReply?.content ?? ""}
                />
                {errors?.content ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.content[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {communityPostId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.communityPostId ? "text-destructive" : "",
                        )}
                    >
                        CommunityPost
                    </Label>
                    <Select
                        defaultValue={communityPostReply?.communityPostId}
                        name="communityPostId"
                    >
                        <SelectTrigger
                            className={cn(
                                errors?.communityPostId
                                    ? "ring ring-destructive"
                                    : "",
                            )}
                        >
                            <SelectValue placeholder="Select a communityPost" />
                        </SelectTrigger>
                        <SelectContent>
                            {communityPosts?.map((communityPost) => (
                                <SelectItem
                                    key={communityPost.id}
                                    value={communityPost.id.toString()}
                                >
                                    {communityPost.id}
                                    {/* TODO: Replace with a field from the communityPost model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.communityPostId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.communityPostId[0]}
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
                                    data: communityPostReply,
                                })
                            const error = await deleteCommunityPostReplyAction(
                                communityPostReply.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: communityPostReply,
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

export default CommunityPostReplyForm

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
