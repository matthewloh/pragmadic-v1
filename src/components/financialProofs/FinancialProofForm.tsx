import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/financial-proofs/useOptimisticFinancialProofs"

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

import { Checkbox } from "@/components/ui/checkbox"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"

import {
    type FinancialProof,
    insertFinancialProofParams,
} from "@/lib/db/schema/financialProofs"
import {
    createFinancialProofAction,
    deleteFinancialProofAction,
    updateFinancialProofAction,
} from "@/lib/actions/financialProofs"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"

const FinancialProofForm = ({
    visaApplications,
    visaApplicationId,
    financialProof,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    financialProof?: FinancialProof | null
    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
    openModal?: (financialProof?: FinancialProof) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<FinancialProof>(insertFinancialProofParams)
    const editing = !!financialProof?.id
    const [submissionDate, setSubmissionDate] = useState<Date | undefined>(
        financialProof?.submissionDate
            ? new Date(financialProof.submissionDate)
            : undefined,
    )

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("financial-proofs")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: FinancialProof },
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
            toast.success(`FinancialProof ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const financialProofParsed =
            await insertFinancialProofParams.safeParseAsync({
                visaApplicationId,
                ...payload,
            })
        if (!financialProofParsed.success) {
            setErrors(financialProofParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = financialProofParsed.data
        const pendingFinancialProof: FinancialProof = {
            updatedAt: financialProof?.updatedAt ?? new Date(),
            createdAt: financialProof?.createdAt ?? new Date(),
            id: financialProof?.id ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingFinancialProof,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateFinancialProofAction({
                          ...values,
                          id: financialProof.id,
                      })
                    : await createFinancialProofAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingFinancialProof,
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
                    defaultValue={financialProof?.status ?? ""}
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
                                !financialProof?.submissionDate &&
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
                    defaultValue={financialProof?.documentLinks ?? ""}
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
                        errors?.declaredAmount ? "text-destructive" : "",
                    )}
                >
                    Declared Amount
                </Label>
                <Input
                    type="text"
                    name="declaredAmount"
                    className={cn(
                        errors?.declaredAmount ? "ring ring-destructive" : "",
                    )}
                    defaultValue={financialProof?.declaredAmount ?? ""}
                />
                {errors?.declaredAmount ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.declaredAmount[0]}
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
                <br />
                <Checkbox
                    defaultChecked={financialProof?.verificationStatus}
                    name={"verificationStatus"}
                    className={cn(
                        errors?.verificationStatus
                            ? "ring ring-destructive"
                            : "",
                    )}
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
                    defaultValue={financialProof?.remarks ?? ""}
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
                        defaultValue={financialProof?.visaApplicationId}
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
                                    data: financialProof,
                                })
                            const error = await deleteFinancialProofAction(
                                financialProof.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: financialProof,
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

export default FinancialProofForm

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
