import { z } from "zod"

import { useValidatedForm } from "@/lib/hooks/useValidatedForm"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import { type TAddOptimistic } from "@/app/(app)/regions/useOptimisticRegions"
import { type Action, cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Checkbox } from "@/components/ui/checkbox"

import {
    createRegionAction,
    deleteRegionAction,
    updateRegionAction,
} from "@/lib/actions/regions"
import { type Region, insertRegionParams } from "@/lib/db/schema/regions"

const RegionForm = ({
    region,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    region?: Region | null

    openModal?: (region?: Region) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Region>(insertRegionParams)
    const editing = !!region?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Region },
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
            toast.success(`Region ${action}d!`)
            if (action === "delete") router.push("/regions")
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const regionParsed = await insertRegionParams.safeParseAsync({
            ...payload,
        })
        if (!regionParsed.success) {
            setErrors(regionParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = regionParsed.data
        const pendingRegion: Region = {
            updatedAt: region?.updatedAt ?? new Date(),
            createdAt: region?.createdAt ?? new Date(),
            id: region?.id ?? "",
            userId: region?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingRegion,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateRegionAction({ ...values, id: region.id })
                    : await createRegionAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingRegion,
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
                    defaultValue={region?.name ?? ""}
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
                    defaultValue={region?.description ?? ""}
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
                        errors?.public ? "text-destructive" : "",
                    )}
                >
                    Public
                </Label>
                <br />
                <Checkbox
                    defaultChecked={region?.public}
                    name={"public"}
                    className={cn(
                        errors?.public ? "ring ring-destructive" : "",
                    )}
                />
                {errors?.public ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.public[0]}
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
                                    data: region,
                                })
                            const error = await deleteRegionAction(region.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: region,
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

export default RegionForm

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
