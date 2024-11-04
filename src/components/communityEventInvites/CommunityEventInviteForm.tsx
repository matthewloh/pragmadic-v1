import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/community-event-invites/useOptimisticCommunityEventInvites"

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
    type CommunityEventInvite,
    insertCommunityEventInviteParams,
} from "@/lib/db/schema/communityEventInvites"
import {
    createCommunityEventInviteAction,
    deleteCommunityEventInviteAction,
    updateCommunityEventInviteAction,
} from "@/lib/actions/communityEventInvites"
import {
    type CommunityEvent,
    type CommunityEventId,
} from "@/lib/db/schema/communityEvents"

const CommunityEventInviteForm = ({
    communityEvents,
    communityEventId,
    communityEventInvite,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    communityEventInvite?: CommunityEventInvite | null
    communityEvents: CommunityEvent[]
    communityEventId?: CommunityEventId
    openModal?: (communityEventInvite?: CommunityEventInvite) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<CommunityEventInvite>(insertCommunityEventInviteParams)
    const editing = !!communityEventInvite?.id
    const [acceptedAt, setAcceptedAt] = useState<Date | undefined>(
        communityEventInvite?.acceptedAt
            ? new Date(communityEventInvite.acceptedAt)
            : undefined,
    )

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("community-event-invites")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: CommunityEventInvite },
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
            toast.success(`CommunityEventInvite ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const communityEventInviteParsed =
            await insertCommunityEventInviteParams.safeParseAsync({
                communityEventId,
                ...payload,
            })
        if (!communityEventInviteParsed.success) {
            setErrors(communityEventInviteParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = communityEventInviteParsed.data
        const pendingCommunityEventInvite: CommunityEventInvite = {
            updatedAt: communityEventInvite?.updatedAt ?? new Date(),
            createdAt: communityEventInvite?.createdAt ?? new Date(),
            id: communityEventInvite?.id ?? "",
            userId: communityEventInvite?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingCommunityEventInvite,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateCommunityEventInviteAction({
                          ...values,
                          id: communityEventInvite.id,
                      })
                    : await createCommunityEventInviteAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingCommunityEventInvite,
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
                        errors?.inviteStatus ? "text-destructive" : "",
                    )}
                >
                    Invite Status
                </Label>
                <Input
                    type="text"
                    name="inviteStatus"
                    className={cn(
                        errors?.inviteStatus ? "ring ring-destructive" : "",
                    )}
                    defaultValue={communityEventInvite?.inviteStatus ?? ""}
                />
                {errors?.inviteStatus ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.inviteStatus[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.acceptedAt ? "text-destructive" : "",
                    )}
                >
                    Accepted At
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="acceptedAt"
                        onChange={() => {}}
                        readOnly
                        value={
                            acceptedAt?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !communityEventInvite?.acceptedAt &&
                                    "text-muted-foreground",
                            )}
                        >
                            {acceptedAt ? (
                                <span>{format(acceptedAt, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setAcceptedAt(e)}
                            selected={acceptedAt}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.acceptedAt ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.acceptedAt[0]}
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
                    defaultValue={communityEventInvite?.remarks ?? ""}
                />
                {errors?.remarks ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.remarks[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {communityEventId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.communityEventId ? "text-destructive" : "",
                        )}
                    >
                        CommunityEvent
                    </Label>
                    <Select
                        defaultValue={communityEventInvite?.communityEventId}
                        name="communityEventId"
                    >
                        <SelectTrigger
                            className={cn(
                                errors?.communityEventId
                                    ? "ring ring-destructive"
                                    : "",
                            )}
                        >
                            <SelectValue placeholder="Select a communityEvent" />
                        </SelectTrigger>
                        <SelectContent>
                            {communityEvents?.map((communityEvent) => (
                                <SelectItem
                                    key={communityEvent.id}
                                    value={communityEvent.id.toString()}
                                >
                                    {communityEvent.title}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.communityEventId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.communityEventId[0]}
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
                                    data: communityEventInvite,
                                })
                            const error =
                                await deleteCommunityEventInviteAction(
                                    communityEventInvite.id,
                                )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: communityEventInvite,
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

export default CommunityEventInviteForm

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
