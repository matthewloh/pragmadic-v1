import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/hubs/useOptimisticHubs"

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

import { type Hub, insertHubParams } from "@/lib/db/schema/hubs"
import {
    createHubAction,
    deleteHubAction,
    updateHubAction,
} from "@/lib/actions/hubs"
import { type State, type StateId } from "@/lib/db/schema/states"

const HubForm = ({
    states,
    stateId,
    hub,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    hub?: Hub | null
    states: State[]
    stateId?: StateId
    openModal?: (hub?: Hub) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Hub>(insertHubParams)
    const editing = !!hub?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("hubs")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Hub },
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
            toast.success(`Hub ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const hubParsed = await insertHubParams.safeParseAsync({
            stateId,
            ...payload,
        })
        if (!hubParsed.success) {
            setErrors(hubParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = hubParsed.data
        const pendingHub: Hub = {
            updatedAt: hub?.updatedAt ?? new Date(),
            createdAt: hub?.createdAt ?? new Date(),
            id: hub?.id ?? "",
            userId: hub?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingHub,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateHubAction({ ...values, id: hub.id })
                    : await createHubAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingHub,
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
                    defaultValue={hub?.name ?? ""}
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
                    defaultValue={hub?.description ?? ""}
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
                        errors?.typeOfHub ? "text-destructive" : "",
                    )}
                >
                    Type Of Hub
                </Label>
                <Input
                    type="text"
                    name="typeOfHub"
                    className={cn(
                        errors?.typeOfHub ? "ring ring-destructive" : "",
                    )}
                    defaultValue={hub?.typeOfHub ?? ""}
                />
                {errors?.typeOfHub ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.typeOfHub[0]}
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
                    defaultChecked={hub?.public}
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
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.info ? "text-destructive" : "",
                    )}
                >
                    Info
                </Label>
                <Input
                    type="text"
                    name="info"
                    className={cn(errors?.info ? "ring ring-destructive" : "")}
                    defaultValue={hub?.info ?? ""}
                />
                {errors?.info ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.info[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {stateId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.stateId ? "text-destructive" : "",
                        )}
                    >
                        State
                    </Label>
                    <Select defaultValue={hub?.stateId} name="stateId">
                        <SelectTrigger
                            className={cn(
                                errors?.stateId ? "ring ring-destructive" : "",
                            )}
                        >
                            <SelectValue placeholder="Select a state" />
                        </SelectTrigger>
                        <SelectContent>
                            {states?.map((state) => (
                                <SelectItem
                                    key={state.id}
                                    value={state.id.toString()}
                                >
                                    {`${state.name}`}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.stateId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.stateId[0]}
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
                                addOptimistic({ action: "delete", data: hub })
                            const error = await deleteHubAction(hub.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: hub,
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

export default HubForm

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
