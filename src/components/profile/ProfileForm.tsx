import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/(profile)/profile/useOptimisticProfile"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useBackPath } from "@/components/shared/BackButton"

import { type Profile, insertProfileParams } from "@/lib/db/schema/profile"
import {
    createProfileAction,
    deleteProfileAction,
    updateProfileAction,
} from "@/lib/actions/profile"

const ProfileForm = ({
    profile,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    profile?: Profile | null

    openModal?: (profile?: Profile) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Profile>(insertProfileParams)
    const editing = !!profile?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("profile")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Profile },
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
            toast.success(`Profile ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const profileParsed = await insertProfileParams.safeParseAsync({
            ...payload,
        })
        if (!profileParsed.success) {
            setErrors(profileParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = profileParsed.data
        const pendingProfile: Profile = {
            updatedAt: profile?.updatedAt ?? new Date(),
            createdAt: profile?.createdAt ?? new Date(),
            id: profile?.id ?? "",
            userId: profile?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingProfile,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateProfileAction({ ...values, id: profile.id })
                    : await createProfileAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingProfile,
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
                        errors?.bio ? "text-destructive" : "",
                    )}
                >
                    Bio
                </Label>
                <Input
                    type="text"
                    name="bio"
                    className={cn(errors?.bio ? "ring ring-destructive" : "")}
                    defaultValue={profile?.bio ?? ""}
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
                        errors?.occupation ? "text-destructive" : "",
                    )}
                >
                    Occupation
                </Label>
                <Input
                    type="text"
                    name="occupation"
                    className={cn(
                        errors?.occupation ? "ring ring-destructive" : "",
                    )}
                    defaultValue={profile?.occupation ?? ""}
                />
                {errors?.occupation ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.occupation[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.location ? "text-destructive" : "",
                    )}
                >
                    Location
                </Label>
                <Input
                    type="text"
                    name="location"
                    className={cn(
                        errors?.location ? "ring ring-destructive" : "",
                    )}
                    defaultValue={profile?.location ?? ""}
                />
                {errors?.location ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.location[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.website ? "text-destructive" : "",
                    )}
                >
                    Website
                </Label>
                <Input
                    type="text"
                    name="website"
                    className={cn(
                        errors?.website ? "ring ring-destructive" : "",
                    )}
                    defaultValue={profile?.website ?? ""}
                />
                {errors?.website ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.website[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.contactNumber ? "text-destructive" : "",
                    )}
                >
                    Contact Number
                </Label>
                <Input
                    type="text"
                    name="contactNumber"
                    className={cn(
                        errors?.contactNumber ? "ring ring-destructive" : "",
                    )}
                    defaultValue={profile?.contactNumber ?? ""}
                />
                {errors?.contactNumber ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.contactNumber[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.socialLinks ? "text-destructive" : "",
                    )}
                >
                    Social Links
                </Label>
                <Input
                    type="text"
                    name="socialLinks"
                    className={cn(
                        errors?.socialLinks ? "ring ring-destructive" : "",
                    )}
                    defaultValue={profile?.socialLinks ?? ""}
                />
                {errors?.socialLinks ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.socialLinks[0]}
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
                                    data: profile,
                                })
                            const error = await deleteProfileAction(profile.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: profile,
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

export default ProfileForm

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
