import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/reviews/useOptimisticReviews"

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

import { type Review, insertReviewParams } from "@/lib/db/schema/reviews"
import {
    createReviewAction,
    deleteReviewAction,
    updateReviewAction,
} from "@/lib/actions/reviews"
import { type Hub, type HubId } from "@/lib/db/schema/hubs"

const ReviewForm = ({
    hubs,
    hubId,
    review,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    review?: Review | null
    hubs: Hub[]
    hubId?: HubId
    openModal?: (review?: Review) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Review>(insertReviewParams)
    const editing = !!review?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("reviews")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Review },
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
            toast.success(`Review ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const reviewParsed = await insertReviewParams.safeParseAsync({
            hubId,
            ...payload,
        })
        if (!reviewParsed.success) {
            setErrors(reviewParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = reviewParsed.data
        const pendingReview: Review = {
            updatedAt: review?.updatedAt ?? new Date(),
            createdAt: review?.createdAt ?? new Date(),
            id: review?.id ?? "",
            userId: review?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingReview,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateReviewAction({ ...values, id: review.id })
                    : await createReviewAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingReview,
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
                    defaultValue={review?.title ?? ""}
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
                    defaultValue={review?.content ?? ""}
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
                        errors?.rating ? "text-destructive" : "",
                    )}
                >
                    Rating
                </Label>
                <Input
                    type="text"
                    name="rating"
                    className={cn(
                        errors?.rating ? "ring ring-destructive" : "",
                    )}
                    defaultValue={review?.rating ?? ""}
                />
                {errors?.rating ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.rating[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.photoUrl ? "text-destructive" : "",
                    )}
                >
                    Photo Url
                </Label>
                <Input
                    type="text"
                    name="photoUrl"
                    className={cn(
                        errors?.photoUrl ? "ring ring-destructive" : "",
                    )}
                    defaultValue={review?.photoUrl ?? ""}
                />
                {errors?.photoUrl ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.photoUrl[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {hubId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.hubId ? "text-destructive" : "",
                        )}
                    >
                        Hub
                    </Label>
                    <Select defaultValue={review?.hubId} name="hubId">
                        <SelectTrigger
                            className={cn(
                                errors?.hubId ? "ring ring-destructive" : "",
                            )}
                        >
                            <SelectValue placeholder="Select a hub" />
                        </SelectTrigger>
                        <SelectContent>
                            {hubs?.map((hub) => (
                                <SelectItem
                                    key={hub.id}
                                    value={hub.id.toString()}
                                >
                                    {hub.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.hubId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.hubId[0]}
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
                                    data: review,
                                })
                            const error = await deleteReviewAction(review.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: review,
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

export default ReviewForm

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
