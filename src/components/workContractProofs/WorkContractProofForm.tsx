import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/work-contract-proofs/useOptimisticWorkContractProofs"

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
    type WorkContractProof,
    insertWorkContractProofParams,
} from "@/lib/db/schema/workContractProofs"
import {
    createWorkContractProofAction,
    deleteWorkContractProofAction,
    updateWorkContractProofAction,
} from "@/lib/actions/workContractProofs"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"

const WorkContractProofForm = ({
    visaApplications,
    visaApplicationId,
    workContractProof,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    workContractProof?: WorkContractProof | null
    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
    openModal?: (workContractProof?: WorkContractProof) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<WorkContractProof>(insertWorkContractProofParams)
    const editing = !!workContractProof?.id
    const [submissionDate, setSubmissionDate] = useState<Date | undefined>(
        workContractProof?.submissionDate
            ? new Date(workContractProof.submissionDate)
            : undefined,
    )

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("work-contract-proofs")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: WorkContractProof },
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
            toast.success(`WorkContractProof ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const workContractProofParsed =
            await insertWorkContractProofParams.safeParseAsync({
                visaApplicationId,
                ...payload,
            })
        if (!workContractProofParsed.success) {
            setErrors(workContractProofParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = workContractProofParsed.data
        const pendingWorkContractProof: WorkContractProof = {
            updatedAt: workContractProof?.updatedAt ?? new Date(),
            createdAt: workContractProof?.createdAt ?? new Date(),
            id: workContractProof?.id ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingWorkContractProof,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateWorkContractProofAction({
                          ...values,
                          id: workContractProof.id,
                      })
                    : await createWorkContractProofAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingWorkContractProof,
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
                    defaultValue={workContractProof?.status ?? ""}
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
                        errors?.submissionDate ? "text-destructive" : "",
                    )}
                >
                    Submission Date
                </Label>
                <br />
                <Popover>
                    <Input
                        name="submissionDate"
                        onChange={() => {}}
                        readOnly
                        value={
                            submissionDate?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !workContractProof?.submissionDate &&
                                    "text-muted-foreground",
                            )}
                        >
                            {submissionDate ? (
                                <span>{format(submissionDate, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setSubmissionDate(e)}
                            selected={submissionDate}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.submissionDate ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.submissionDate[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.documentLinks ? "text-destructive" : "",
                    )}
                >
                    Document Links
                </Label>
                <Input
                    type="text"
                    name="documentLinks"
                    className={cn(
                        errors?.documentLinks ? "ring ring-destructive" : "",
                    )}
                    defaultValue={workContractProof?.documentLinks ?? ""}
                />
                {errors?.documentLinks ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.documentLinks[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.employerDetails ? "text-destructive" : "",
                    )}
                >
                    Employer Details
                </Label>
                <Input
                    type="text"
                    name="employerDetails"
                    className={cn(
                        errors?.employerDetails ? "ring ring-destructive" : "",
                    )}
                    defaultValue={workContractProof?.employerDetails ?? ""}
                />
                {errors?.employerDetails ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.employerDetails[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.contractDetails ? "text-destructive" : "",
                    )}
                >
                    Contract Details
                </Label>
                <Input
                    type="text"
                    name="contractDetails"
                    className={cn(
                        errors?.contractDetails ? "ring ring-destructive" : "",
                    )}
                    defaultValue={workContractProof?.contractDetails ?? ""}
                />
                {errors?.contractDetails ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.contractDetails[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.verificationStatus ? "text-destructive" : "",
                    )}
                >
                    Verification Status
                </Label>
                <Input
                    type="text"
                    name="verificationStatus"
                    className={cn(
                        errors?.verificationStatus
                            ? "ring ring-destructive"
                            : "",
                    )}
                    defaultValue={workContractProof?.verificationStatus ?? ""}
                />
                {errors?.verificationStatus ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.verificationStatus[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.remarks ? "text-destructive" : "",
                    )}
                >
                    Remarks
                </Label>
                <Input
                    type="text"
                    name="remarks"
                    className={cn(
                        errors?.remarks ? "ring ring-destructive" : "",
                    )}
                    defaultValue={workContractProof?.remarks ?? ""}
                />
                {errors?.remarks ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.remarks[0]}
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
                        defaultValue={workContractProof?.visaApplicationId}
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
                                    data: workContractProof,
                                })
                            const error = await deleteWorkContractProofAction(
                                workContractProof.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: workContractProof,
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

export default WorkContractProofForm

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
