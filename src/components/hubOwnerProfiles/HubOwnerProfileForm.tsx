import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBackPath } from "@/components/shared/BackButton"

import {
    type HubOwnerProfile,
    insertHubOwnerProfileParams,
} from "@/lib/db/schema/hubOwnerProfiles"
import {
    createHubOwnerProfileAction,
    deleteHubOwnerProfileAction,
    updateHubOwnerProfileAction,
} from "@/lib/actions/hubOwnerProfiles"

const HubOwnerProfileForm = ({
    hubOwnerProfile,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    hubOwnerProfile?: HubOwnerProfile | null

    openModal?: (hubOwnerProfile?: HubOwnerProfile) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<HubOwnerProfile>(insertHubOwnerProfileParams)
    const editing = !!hubOwnerProfile?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("hub-owner-profiles")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: HubOwnerProfile },
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
            toast.success(`HubOwnerProfile ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const hubOwnerProfileParsed =
            await insertHubOwnerProfileParams.safeParseAsync({ ...payload })
        if (!hubOwnerProfileParsed.success) {
            setErrors(hubOwnerProfileParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = hubOwnerProfileParsed.data
        const pendingHubOwnerProfile: HubOwnerProfile = {
            updatedAt: hubOwnerProfile?.updatedAt ?? new Date(),
            createdAt: hubOwnerProfile?.createdAt ?? new Date(),
            id: hubOwnerProfile?.id ?? "",
            userId: hubOwnerProfile?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingHubOwnerProfile,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateHubOwnerProfileAction({
                          ...values,
                          id: hubOwnerProfile.id,
                      })
                    : await createHubOwnerProfileAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingHubOwnerProfile,
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
                        errors?.companyName ? "text-destructive" : "",
                    )}
                >
                    Company Name
                </Label>
                <Input
                    type="text"
                    name="companyName"
                    className={cn(
                        errors?.companyName ? "ring ring-destructive" : "",
                    )}
                    defaultValue={hubOwnerProfile?.companyName ?? ""}
                />
                {errors?.companyName ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.companyName[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.businessRegistrationNumber
                            ? "text-destructive"
                            : "",
                    )}
                >
                    Business Registration Number
                </Label>
                <Input
                    type="text"
                    name="businessRegistrationNumber"
                    className={cn(
                        errors?.businessRegistrationNumber
                            ? "ring ring-destructive"
                            : "",
                    )}
                    defaultValue={
                        hubOwnerProfile?.businessRegistrationNumber ?? ""
                    }
                />
                {errors?.businessRegistrationNumber ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.businessRegistrationNumber[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.bio ? "text-destructive" : "",
                    )}
                >
                    Bio
                </Label>
                <Input
                    type="text"
                    name="bio"
                    className={cn(errors?.bio ? "ring ring-destructive" : "")}
                    defaultValue={hubOwnerProfile?.bio ?? ""}
                />
                {errors?.bio ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.bio[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.businessContactNo ? "text-destructive" : "",
                    )}
                >
                    Business Contact No
                </Label>
                <Input
                    type="text"
                    name="businessContactNo"
                    className={cn(
                        errors?.businessContactNo
                            ? "ring ring-destructive"
                            : "",
                    )}
                    defaultValue={hubOwnerProfile?.businessContactNo ?? ""}
                />
                {errors?.businessContactNo ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.businessContactNo[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.businessEmail ? "text-destructive" : "",
                    )}
                >
                    Business Email
                </Label>
                <Input
                    type="text"
                    name="businessEmail"
                    className={cn(
                        errors?.businessEmail ? "ring ring-destructive" : "",
                    )}
                    defaultValue={hubOwnerProfile?.businessEmail ?? ""}
                />
                {errors?.businessEmail ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.businessEmail[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.businessLocation ? "text-destructive" : "",
                    )}
                >
                    Business Location
                </Label>
                <Input
                    type="text"
                    name="businessLocation"
                    className={cn(
                        errors?.businessLocation ? "ring ring-destructive" : "",
                    )}
                    defaultValue={hubOwnerProfile?.businessLocation ?? ""}
                />
                {errors?.businessLocation ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.businessLocation[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.residingLocation ? "text-destructive" : "",
                    )}
                >
                    Residing Location
                </Label>
                <Input
                    type="text"
                    name="residingLocation"
                    className={cn(
                        errors?.residingLocation ? "ring ring-destructive" : "",
                    )}
                    defaultValue={hubOwnerProfile?.residingLocation ?? ""}
                />
                {errors?.residingLocation ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.residingLocation[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.socialMediaHandles ? "text-destructive" : "",
                    )}
                >
                    Social Media Handles
                </Label>
                <Input
                    type="text"
                    name="socialMediaHandles"
                    className={cn(
                        errors?.socialMediaHandles
                            ? "ring ring-destructive"
                            : "",
                    )}
                    defaultValue={hubOwnerProfile?.socialMediaHandles ?? ""}
                />
                {errors?.socialMediaHandles ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.socialMediaHandles[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.websiteUrl ? "text-destructive" : "",
                    )}
                >
                    Website Url
                </Label>
                <Input
                    type="text"
                    name="websiteUrl"
                    className={cn(
                        errors?.websiteUrl ? "ring ring-destructive" : "",
                    )}
                    defaultValue={hubOwnerProfile?.websiteUrl ?? ""}
                />
                {errors?.websiteUrl ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.websiteUrl[0]}
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
                                    data: hubOwnerProfile,
                                })
                            const error = await deleteHubOwnerProfileAction(
                                hubOwnerProfile.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: hubOwnerProfile,
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

export default HubOwnerProfileForm

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
