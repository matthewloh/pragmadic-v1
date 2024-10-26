import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/community-posts/useOptimisticCommunityPosts"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBackPath } from "@/components/shared/BackButton"

import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    type CommunityPost,
    insertCommunityPostParams,
} from "@/lib/db/schema/communityPosts"
import {
    createCommunityPostAction,
    deleteCommunityPostAction,
    updateCommunityPostAction,
} from "@/lib/actions/communityPosts"
import { type Community, type CommunityId } from "@/lib/db/schema/communities"

const CommunityPostForm = ({
    communities,
    communityId,
    communityPost,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    communityPost?: CommunityPost | null
    communities: Community[]
    communityId?: CommunityId
    openModal?: (communityPost?: CommunityPost) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<CommunityPost>(insertCommunityPostParams)
    const editing = !!communityPost?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("community-posts")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: CommunityPost },
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
            toast.success(`CommunityPost ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const communityPostParsed =
            await insertCommunityPostParams.safeParseAsync({
                communityId,
                ...payload,
            })
        if (!communityPostParsed.success) {
            setErrors(communityPostParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = communityPostParsed.data
        const pendingCommunityPost: CommunityPost = {
            updatedAt: communityPost?.updatedAt ?? new Date(),
            createdAt: communityPost?.createdAt ?? new Date(),
            id: communityPost?.id ?? "",
            userId: communityPost?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingCommunityPost,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateCommunityPostAction({
                          ...values,
                          id: communityPost.id,
                      })
                    : await createCommunityPostAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingCommunityPost,
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
                        errors?.title ? "text-destructive" : "",
                    )}
                >
                    Title
                </Label>
                <Input
                    type="text"
                    name="title"
                    className={cn(errors?.title ? "ring ring-destructive" : "")}
                    defaultValue={communityPost?.title ?? ""}
                />
                {errors?.title ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.title[0]}
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
                    defaultValue={communityPost?.content ?? ""}
                />
                {errors?.content ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.content[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.category ? "text-destructive" : "",
                    )}
                >
                    Category
                </Label>
                <Input
                    type="text"
                    name="category"
                    className={cn(
                        errors?.category ? "ring ring-destructive" : "",
                    )}
                    defaultValue={communityPost?.category ?? ""}
                />
                {errors?.category ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.category[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.isPublic ? "text-destructive" : "",
                    )}
                >
                    Is Public
                </Label>
                <br />
                <Checkbox
                    defaultChecked={communityPost?.isPublic}
                    name={"isPublic"}
                    className={cn(
                        errors?.isPublic ? "ring ring-destructive" : "",
                    )}
                />
                {errors?.isPublic ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.isPublic[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {communityId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.communityId ? "text-destructive" : "",
                        )}
                    >
                        Community
                    </Label>
                    <Select
                        defaultValue={communityPost?.communityId}
                        name="communityId"
                    >
                        <SelectTrigger
                            className={cn(
                                errors?.communityId
                                    ? "ring ring-destructive"
                                    : "",
                            )}
                        >
                            <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                        <SelectContent>
                            {communities?.map((community) => (
                                <SelectItem
                                    key={community.id}
                                    value={community.id.toString()}
                                >
                                    {community.id}
                                    {/* TODO: Replace with a field from the community model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.communityId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.communityId[0]}
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
                                    data: communityPost,
                                })
                            const error = await deleteCommunityPostAction(
                                communityPost.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: communityPost,
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

export default CommunityPostForm

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
