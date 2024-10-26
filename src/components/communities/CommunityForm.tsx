import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/communities/useOptimisticCommunities"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBackPath } from "@/components/shared/BackButton"

import { Checkbox } from "@/components/ui/checkbox"

import {
    type Community,
    insertCommunityParams,
} from "@/lib/db/schema/communities"
import {
    createCommunityAction,
    deleteCommunityAction,
    updateCommunityAction,
} from "@/lib/actions/communities"

const CommunityForm = ({
    community,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    community?: Community | null

    openModal?: (community?: Community) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Community>(insertCommunityParams)
    const editing = !!community?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("communities")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Community },
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
            toast.success(`Community ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const communityParsed = await insertCommunityParams.safeParseAsync({
            ...payload,
        })
        if (!communityParsed.success) {
            setErrors(communityParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = communityParsed.data
        const pendingCommunity: Community = {
            updatedAt: community?.updatedAt ?? new Date(),
            createdAt: community?.createdAt ?? new Date(),
            id: community?.id ?? "",
            userId: community?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingCommunity,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateCommunityAction({
                          ...values,
                          id: community.id,
                      })
                    : await createCommunityAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingCommunity,
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
                    defaultValue={community?.name ?? ""}
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
                    defaultValue={community?.description ?? ""}
                />
                {errors?.description ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.description[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.rules ? "text-destructive" : "",
                    )}
                >
                    Rules
                </Label>
                <Input
                    type="text"
                    name="rules"
                    className={cn(errors?.rules ? "ring ring-destructive" : "")}
                    defaultValue={community?.rules ?? ""}
                />
                {errors?.rules ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.rules[0]}
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
                    defaultChecked={community?.isPublic}
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
                                    data: community,
                                })
                            const error = await deleteCommunityAction(
                                community.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: community,
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

export default CommunityForm

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
