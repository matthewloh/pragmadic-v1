import { z } from "zod"

import { useValidatedForm } from "@/lib/hooks/useValidatedForm"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { toast } from "sonner"

import { type TAddOptimistic } from "@/app/(app)/visa-applications/useOptimisticVisaApplications"
import { type Action, cn } from "@/lib/utils"

import { useBackPath } from "@/components/shared/BackButton"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { Calendar } from "@/components/ui/calendar"
import { Checkbox } from "@/components/ui/checkbox"
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"

import {
    createVisaApplicationAction,
    deleteVisaApplicationAction,
    updateVisaApplicationAction,
} from "@/lib/actions/visaApplications"
import { type Region, type RegionId } from "@/lib/db/schema/regions"
import {
    type VisaApplication,
    insertVisaApplicationParams,
} from "@/lib/db/schema/visaApplications"

const VisaApplicationForm = ({
    regions,
    regionId,
    visaApplication,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    visaApplication?: VisaApplication | null
    regions: Region[]
    regionId?: RegionId
    openModal?: (visaApplication?: VisaApplication) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<VisaApplication>(insertVisaApplicationParams)
    const editing = !!visaApplication?.id
    const [approvedAt, setApprovedAt] = useState<Date | undefined>(
        visaApplication?.approvedAt
            ? new Date(visaApplication.approvedAt)
            : undefined,
    )
    const [expiry, setExpiry] = useState<Date | undefined>(
        visaApplication?.expiry ? new Date(visaApplication.expiry) : undefined,
    )
    const [applicationDate, setApplicationDate] = useState<Date | undefined>(
        visaApplication?.applicationDate
            ? new Date(visaApplication.applicationDate)
            : undefined,
    )

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("visa-applications")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: VisaApplication },
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
            toast.success(`VisaApplication ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const visaApplicationParsed =
            await insertVisaApplicationParams.safeParseAsync({
                regionId,
                ...payload,
            })
        if (!visaApplicationParsed.success) {
            setErrors(visaApplicationParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = visaApplicationParsed.data
        const pendingVisaApplication: VisaApplication = {
            updatedAt: visaApplication?.updatedAt ?? new Date(),
            createdAt: visaApplication?.createdAt ?? new Date(),
            id: visaApplication?.id ?? "",
            userId: visaApplication?.userId ?? "",
            ...values,
            expiry: expiry ? new Date(expiry) : null,
        }

        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingVisaApplication,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateVisaApplicationAction({
                          ...values,
                          id: visaApplication.id,
                      })
                    : await createVisaApplicationAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingVisaApplication,
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
                    defaultValue={visaApplication?.status ?? ""}
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
                                !visaApplication?.approvedAt &&
                                    "text-muted-foreground",
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
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.expiry ? "text-destructive" : "",
                    )}
                >
                    Expiry
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="expiry"
                        onChange={() => {}}
                        readOnly
                        value={
                            expiry?.toUTCString() ?? new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !visaApplication?.expiry &&
                                    "text-muted-foreground",
                            )}
                        >
                            {expiry ? (
                                <span>{format(expiry, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setExpiry(e)}
                            selected={expiry}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.expiry ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.expiry[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.applicationType ? "text-destructive" : "",
                    )}
                >
                    Application Type
                </Label>
                <Input
                    type="text"
                    name="applicationType"
                    className={cn(
                        errors?.applicationType ? "ring ring-destructive" : "",
                    )}
                    defaultValue={visaApplication?.applicationType ?? ""}
                />
                {errors?.applicationType ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.applicationType[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.isRenewal ? "text-destructive" : "",
                    )}
                >
                    Is Renewal
                </Label>
                <br />
                <Checkbox
                    defaultChecked={visaApplication?.isRenewal ?? false}
                    name={"isRenewal"}
                    className={cn(
                        errors?.isRenewal ? "ring ring-destructive" : "",
                    )}
                />
                {errors?.isRenewal ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.isRenewal[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.applicationDate ? "text-destructive" : "",
                    )}
                >
                    Application Date
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="applicationDate"
                        onChange={() => {}}
                        readOnly
                        value={
                            applicationDate?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !visaApplication?.applicationDate &&
                                    "text-muted-foreground",
                            )}
                        >
                            {applicationDate ? (
                                <span>{format(applicationDate, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setApplicationDate(e)}
                            selected={applicationDate}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.applicationDate ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.applicationDate[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.healthClearanceStatus ? "text-destructive" : "",
                    )}
                >
                    Health Clearance Status
                </Label>
                <br />
                <Checkbox
                    defaultChecked={
                        visaApplication?.healthClearanceStatus ?? false
                    }
                    name={"healthClearanceStatus"}
                    className={cn(
                        errors?.healthClearanceStatus
                            ? "ring ring-destructive"
                            : "",
                    )}
                />
                {errors?.healthClearanceStatus ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.healthClearanceStatus[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.financialProofStatus ? "text-destructive" : "",
                    )}
                >
                    Financial Proof Status
                </Label>
                <Input
                    type="text"
                    name="financialProofStatus"
                    className={cn(
                        errors?.financialProofStatus
                            ? "ring ring-destructive"
                            : "",
                    )}
                    defaultValue={visaApplication?.financialProofStatus ?? ""}
                />
                {errors?.financialProofStatus ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.financialProofStatus[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.workContractStatus ? "text-destructive" : "",
                    )}
                >
                    Work Contract Status
                </Label>
                <br />
                <Checkbox
                    defaultChecked={
                        visaApplication?.workContractStatus ?? false
                    }
                    name={"workContractStatus"}
                    className={cn(
                        errors?.workContractStatus
                            ? "ring ring-destructive"
                            : "",
                    )}
                />
                {errors?.workContractStatus ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.workContractStatus[0]}
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
                    <Select
                        defaultValue={visaApplication?.regionId}
                        name="regionId"
                    >
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
                                    {region.name}
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
                                addOptimistic({
                                    action: "delete",
                                    data: visaApplication,
                                })
                            const error = await deleteVisaApplicationAction(
                                visaApplication.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: visaApplication,
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

export default VisaApplicationForm

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
