import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/health-clearance-info/useOptimisticHealthClearanceInfo"

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

import {
    type HealthClearanceInfo,
    insertHealthClearanceInfoParams,
} from "@/lib/db/schema/healthClearanceInfo"
import {
    createHealthClearanceInfoAction,
    deleteHealthClearanceInfoAction,
    updateHealthClearanceInfoAction,
} from "@/lib/actions/healthClearanceInfo"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"

const HealthClearanceInfoForm = ({
    visaApplications,
    visaApplicationId,
    healthClearanceInfo,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    healthClearanceInfo?: HealthClearanceInfo | null
    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
    openModal?: (healthClearanceInfo?: HealthClearanceInfo) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<HealthClearanceInfo>(insertHealthClearanceInfoParams)
    const editing = !!healthClearanceInfo?.id
    const [clearanceDate, setClearanceDate] = useState<Date | undefined>(
        healthClearanceInfo?.clearanceDate
            ? new Date(healthClearanceInfo.clearanceDate)
            : undefined,
    )

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("health-clearance-info")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: HealthClearanceInfo },
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
            toast.success(`HealthClearanceInfo ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const healthClearanceInfoParsed =
            await insertHealthClearanceInfoParams.safeParseAsync({
                visaApplicationId,
                ...payload,
            })
        if (!healthClearanceInfoParsed.success) {
            setErrors(healthClearanceInfoParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = healthClearanceInfoParsed.data
        const pendingHealthClearanceInfo: HealthClearanceInfo = {
            updatedAt: healthClearanceInfo?.updatedAt ?? new Date(),
            createdAt: healthClearanceInfo?.createdAt ?? new Date(),
            id: healthClearanceInfo?.id ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingHealthClearanceInfo,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateHealthClearanceInfoAction({
                          ...values,
                          id: healthClearanceInfo.id,
                      })
                    : await createHealthClearanceInfoAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingHealthClearanceInfo,
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
                        errors?.status ? "text-destructive" : "",
                    )}
                >
                    Status
                </Label>
                <Input
                    type="text"
                    name="status"
                    className={cn(
                        errors?.status ? "ring ring-destructive" : "",
                    )}
                    defaultValue={healthClearanceInfo?.status ?? ""}
                />
                {errors?.status ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.status[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.clearanceDate ? "text-destructive" : "",
                    )}
                >
                    Clearance Date
                </Label>
                <br />
                <Popover>
                    <Input
                        name="clearanceDate"
                        onChange={() => {}}
                        readOnly
                        value={
                            clearanceDate?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !healthClearanceInfo?.clearanceDate &&
                                    "text-muted-foreground",
                            )}
                        >
                            {clearanceDate ? (
                                <span>{format(clearanceDate, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setClearanceDate(e)}
                            selected={clearanceDate}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.clearanceDate ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.clearanceDate[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.healthFacilityName ? "text-destructive" : "",
                    )}
                >
                    Health Facility Name
                </Label>
                <Input
                    type="text"
                    name="healthFacilityName"
                    className={cn(
                        errors?.healthFacilityName
                            ? "ring ring-destructive"
                            : "",
                    )}
                    defaultValue={healthClearanceInfo?.healthFacilityName ?? ""}
                />
                {errors?.healthFacilityName ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.healthFacilityName[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.medicalReport ? "text-destructive" : "",
                    )}
                >
                    Medical Report
                </Label>
                <Input
                    type="text"
                    name="medicalReport"
                    className={cn(
                        errors?.medicalReport ? "ring ring-destructive" : "",
                    )}
                    defaultValue={healthClearanceInfo?.medicalReport ?? ""}
                />
                {errors?.medicalReport ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.medicalReport[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.healthConditions ? "text-destructive" : "",
                    )}
                >
                    Health Conditions
                </Label>
                <Input
                    type="text"
                    name="healthConditions"
                    className={cn(
                        errors?.healthConditions ? "ring ring-destructive" : "",
                    )}
                    defaultValue={healthClearanceInfo?.healthConditions ?? ""}
                />
                {errors?.healthConditions ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.healthConditions[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {visaApplicationId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.visaApplicationId ? "text-destructive" : "",
                        )}
                    >
                        VisaApplication
                    </Label>
                    <Select
                        defaultValue={healthClearanceInfo?.visaApplicationId}
                        name="visaApplicationId"
                    >
                        <SelectTrigger
                            className={cn(
                                errors?.visaApplicationId
                                    ? "ring ring-destructive"
                                    : "",
                            )}
                        >
                            <SelectValue placeholder="Select a visaApplication" />
                        </SelectTrigger>
                        <SelectContent>
                            {visaApplications?.map((visaApplication) => (
                                <SelectItem
                                    key={visaApplication.id}
                                    value={visaApplication.id.toString()}
                                >
                                    {visaApplication.id}
                                    {/* TODO: Replace with a field from the visaApplication model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.visaApplicationId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.visaApplicationId[0]}
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
                                    data: healthClearanceInfo,
                                })
                            const error = await deleteHealthClearanceInfoAction(
                                healthClearanceInfo.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: healthClearanceInfo,
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

export default HealthClearanceInfoForm

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
