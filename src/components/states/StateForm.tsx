import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/states/useOptimisticStates"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBackPath } from "@/components/shared/BackButton"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { CalendarIcon } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { format } from "date-fns"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import { type State, insertStateParams } from "@/lib/db/schema/states"
import {
    createStateAction,
    deleteStateAction,
    updateStateAction,
} from "@/lib/actions/states"
import { type Region, type RegionId } from "@/lib/db/schema/regions"

const StateForm = ({
    regions,
    regionId,
    state,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    state?: State | null
    regions: Region[]
    regionId?: RegionId
    openModal?: (state?: State) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<State>(insertStateParams)
    const editing = !!state?.id
    const [approvedAt, setApprovedAt] = useState<Date | undefined>(
        state?.approvedAt ? new Date(state.approvedAt) : undefined,
    )

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("states")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: State },
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
            toast.success(`State ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const stateParsed = await insertStateParams.safeParseAsync({
            regionId,
            ...payload,
        })
        if (!stateParsed.success) {
            setErrors(stateParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = stateParsed.data
        const pendingState: State = {
            updatedAt: state?.updatedAt ?? new Date(),
            createdAt: state?.createdAt ?? new Date(),
            id: state?.id ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingState,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateStateAction({ ...values, id: state.id })
                    : await createStateAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingState,
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
                    defaultValue={state?.name ?? ""}
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
                    defaultValue={state?.description ?? ""}
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
                        errors?.capitalCity ? "text-destructive" : "",
                    )}
                >
                    Capital City
                </Label>
                <Input
                    type="text"
                    name="capitalCity"
                    className={cn(
                        errors?.capitalCity ? "ring ring-destructive" : "",
                    )}
                    defaultValue={state?.capitalCity ?? ""}
                />
                {errors?.capitalCity ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.capitalCity[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.population ? "text-destructive" : "",
                    )}
                >
                    Population
                </Label>
                <Input
                    type="text"
                    name="population"
                    className={cn(
                        errors?.population ? "ring ring-destructive" : "",
                    )}
                    defaultValue={state?.population ?? ""}
                />
                {errors?.population ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.population[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.approvedAt ? "text-destructive" : "",
                    )}
                >
                    Approved At
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="approvedAt"
                        onChange={() => {}}
                        readOnly
                        value={
                            approvedAt?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !state?.approvedAt && "text-muted-foreground",
                            )}
                        >
                            {approvedAt ? (
                                <span>{format(approvedAt, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setApprovedAt(e)}
                            selected={approvedAt}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.approvedAt ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.approvedAt[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {regionId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.regionId ? "text-destructive" : "",
                        )}
                    >
                        Region
                    </Label>
                    <Select defaultValue={state?.regionId} name="regionId">
                        <SelectTrigger
                            className={cn(
                                errors?.regionId ? "ring ring-destructive" : "",
                            )}
                        >
                            <SelectValue placeholder="Select a region" />
                        </SelectTrigger>
                        <SelectContent>
                            {regions?.map((region) => (
                                <SelectItem
                                    key={region.id}
                                    value={region.id.toString()}
                                >
                                    {region.id}
                                    {/* TODO: Replace with a field from the region model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.regionId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.regionId[0]}
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
                                addOptimistic({ action: "delete", data: state })
                            const error = await deleteStateAction(state.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: state,
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

export default StateForm

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
