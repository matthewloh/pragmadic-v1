import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/community-events/useOptimisticCommunityEvents"

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
    type CommunityEvent,
    insertCommunityEventParams,
} from "@/lib/db/schema/communityEvents"
import {
    createCommunityEventAction,
    deleteCommunityEventAction,
    updateCommunityEventAction,
} from "@/lib/actions/communityEvents"
import { type Community, type CommunityId } from "@/lib/db/schema/communities"

const CommunityEventForm = ({
    communities,
    communityId,
    communityEvent,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    communityEvent?: CommunityEvent | null
    communities: Community[]
    communityId?: CommunityId
    openModal?: (communityEvent?: CommunityEvent) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<CommunityEvent>(insertCommunityEventParams)
    const editing = !!communityEvent?.id
    const [eventTimestamp, setEventTimestamp] = useState<Date | undefined>(
        communityEvent?.eventTimestamp,
    )
    const [completedAt, setCompletedAt] = useState<Date | undefined>(
        communityEvent?.completedAt
            ? new Date(communityEvent.completedAt)
            : undefined,
    )

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("community-events")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: CommunityEvent },
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
            toast.success(`CommunityEvent ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const communityEventParsed =
            await insertCommunityEventParams.safeParseAsync({
                communityId,
                ...payload,
            })
        if (!communityEventParsed.success) {
            setErrors(communityEventParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = communityEventParsed.data
        const pendingCommunityEvent: CommunityEvent = {
            updatedAt: communityEvent?.updatedAt ?? new Date(),
            createdAt: communityEvent?.createdAt ?? new Date(),
            id: communityEvent?.id ?? "",
            userId: communityEvent?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingCommunityEvent,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateCommunityEventAction({
                          ...values,
                          id: communityEvent.id,
                      })
                    : await createCommunityEventAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingCommunityEvent,
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
                        errors?.title ? "text-destructive" : "",
                    )}
                >
                    Title
                </Label>
                <Input
                    type="text"
                    name="title"
                    className={cn(errors?.title ? "ring ring-destructive" : "")}
                    defaultValue={communityEvent?.title ?? ""}
                />
                {errors?.title ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.title[0]}
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
                    defaultValue={communityEvent?.description ?? ""}
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
                        errors?.eventTimestamp ? "text-destructive" : "",
                    )}
                >
                    Event Timestamp
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="eventTimestamp"
                        onChange={() => {}}
                        readOnly
                        value={
                            eventTimestamp?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !communityEvent?.eventTimestamp &&
                                    "text-muted-foreground",
                            )}
                        >
                            {eventTimestamp ? (
                                <span>{format(eventTimestamp, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setEventTimestamp(e)}
                            selected={eventTimestamp}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.eventTimestamp ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.eventTimestamp[0]}
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
                    defaultValue={communityEvent?.location ?? ""}
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
                        errors?.eventType ? "text-destructive" : "",
                    )}
                >
                    Event Type
                </Label>
                <Input
                    type="text"
                    name="eventType"
                    className={cn(
                        errors?.eventType ? "ring ring-destructive" : "",
                    )}
                    defaultValue={communityEvent?.eventType ?? ""}
                />
                {errors?.eventType ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.eventType[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.isComplete ? "text-destructive" : "",
                    )}
                >
                    Is Complete
                </Label>
                <br />
                <Checkbox
                    defaultChecked={communityEvent?.isComplete}
                    name={"isComplete"}
                    className={cn(
                        errors?.isComplete ? "ring ring-destructive" : "",
                    )}
                />
                {errors?.isComplete ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.isComplete[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.completedAt ? "text-destructive" : "",
                    )}
                >
                    Completed At
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="completedAt"
                        onChange={() => {}}
                        readOnly
                        value={
                            completedAt?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !communityEvent?.completedAt &&
                                    "text-muted-foreground",
                            )}
                        >
                            {completedAt ? (
                                <span>{format(completedAt, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setCompletedAt(e)}
                            selected={completedAt}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.completedAt ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.completedAt[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {communityId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.communityId ? "text-destructive" : "",
                        )}
                    >
                        Community
                    </Label>
                    <Select
                        defaultValue={communityEvent?.communityId}
                        name="communityId"
                    >
                        <SelectTrigger
                            className={cn(
                                errors?.communityId
                                    ? "ring ring-destructive"
                                    : "",
                            )}
                        >
                            <SelectValue placeholder="Select a community" />
                        </SelectTrigger>
                        <SelectContent>
                            {communities?.map((community) => (
                                <SelectItem
                                    key={community.id}
                                    value={community.id.toString()}
                                >
                                    {community.id}
                                    {/* TODO: Replace with a field from the community model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.communityId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.communityId[0]}
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
                                    data: communityEvent,
                                })
                            const error = await deleteCommunityEventAction(
                                communityEvent.id,
                            )
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: communityEvent,
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

export default CommunityEventForm

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
