import { z } from "zod"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"

import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/events/useOptimisticEvents"

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

import { type Event, insertEventParams } from "@/lib/db/schema/events"
import {
    createEventAction,
    deleteEventAction,
    updateEventAction,
} from "@/lib/actions/events"
import { type Hub, type HubId } from "@/lib/db/schema/hubs"

const EventForm = ({
    hubs,
    hubId,
    event,
    openModal,
    closeModal,
    addOptimistic,
    postSuccess,
}: {
    event?: Event | null
    hubs: Hub[]
    hubId?: HubId
    openModal?: (event?: Event) => void
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
    postSuccess?: () => void
}) => {
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<Event>(insertEventParams)
    const editing = !!event?.id
    const [eventDate, setEventDate] = useState<Date | undefined>(
        event ? new Date(event.eventDate) : undefined,
    )
    const [completionDate, setCompletionDate] = useState<Date | undefined>(
        event?.completionDate ? new Date(event.completionDate) : undefined,
    )
    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()
    const backpath = useBackPath("events")

    const onSuccess = (
        action: Action,
        data?: { error: string; values: Event },
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
            toast.success(`Event ${action}d!`)
            if (action === "delete") router.push(backpath)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())
        const eventParsed = await insertEventParams.safeParseAsync({
            hubId,
            ...payload,
        })
        if (!eventParsed.success) {
            setErrors(eventParsed?.error.flatten().fieldErrors)
            return
        }

        closeModal && closeModal()
        const values = eventParsed.data
        const pendingEvent: Event = {
            updatedAt: event?.updatedAt ?? new Date(),
            createdAt: event?.createdAt ?? new Date(),
            id: event?.id ?? "",
            userId: event?.userId ?? "",
            ...values,
        }
        try {
            startMutation(async () => {
                addOptimistic &&
                    addOptimistic({
                        data: pendingEvent,
                        action: editing ? "update" : "create",
                    })

                const error = editing
                    ? await updateEventAction({ ...values, id: event.id })
                    : await createEventAction(values)

                const errorFormatted = {
                    error: error ?? "Error",
                    values: pendingEvent,
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
                    defaultValue={event?.name ?? ""}
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
                    defaultValue={event?.description ?? ""}
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
                        errors?.typeOfEvent ? "text-destructive" : "",
                    )}
                >
                    Type Of Event
                </Label>
                <Input
                    type="text"
                    name="typeOfEvent"
                    className={cn(
                        errors?.typeOfEvent ? "ring ring-destructive" : "",
                    )}
                    defaultValue={event?.typeOfEvent ?? ""}
                />
                {errors?.typeOfEvent ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.typeOfEvent[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.eventDate ? "text-destructive" : "",
                    )}
                >
                    Event Date
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="eventDate"
                        onChange={() => {}}
                        readOnly
                        value={
                            eventDate?.toUTCString() ?? new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !event?.eventDate && "text-muted-foreground",
                            )}
                        >
                            {eventDate ? (
                                <span>{format(eventDate, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setEventDate(e)}
                            selected={eventDate}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.eventDate ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.eventDate[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>
            <div>
                <Label
                    className={cn(
                        "mb-2 inline-block",
                        errors?.completionDate ? "text-destructive" : "",
                    )}
                >
                    Completion Date
                </Label>
                <br />
                <Popover modal={true}>
                    <Input
                        name="completionDate"
                        onChange={() => {}}
                        readOnly
                        value={
                            completionDate?.toUTCString() ??
                            new Date().toUTCString()
                        }
                        className="hidden"
                    />

                    <PopoverTrigger asChild>
                        <Button
                            variant={"outline"}
                            className={cn(
                                "w-[240px] pl-3 text-left font-normal",
                                !event?.completionDate &&
                                    "text-muted-foreground",
                            )}
                        >
                            {completionDate ? (
                                <span>{format(completionDate, "PPP")}</span>
                            ) : (
                                <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            onSelect={(e) => setCompletionDate(e)}
                            selected={completionDate}
                            disabled={(date) =>
                                date > new Date() ||
                                date < new Date("1900-01-01")
                            }
                            initialFocus
                        />
                    </PopoverContent>
                </Popover>
                {errors?.completionDate ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.completionDate[0]}
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
                    defaultChecked={event?.isComplete}
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
                        errors?.info ? "text-destructive" : "",
                    )}
                >
                    Info
                </Label>
                <Input
                    type="text"
                    name="info"
                    className={cn(errors?.info ? "ring ring-destructive" : "")}
                    defaultValue={event?.info ?? ""}
                />
                {errors?.info ? (
                    <p className="mt-2 text-xs text-destructive">
                        {errors.info[0]}
                    </p>
                ) : (
                    <div className="h-6" />
                )}
            </div>

            {hubId ? null : (
                <div>
                    <Label
                        className={cn(
                            "mb-2 inline-block",
                            errors?.hubId ? "text-destructive" : "",
                        )}
                    >
                        Hub
                    </Label>
                    <Select defaultValue={event?.hubId} name="hubId">
                        <SelectTrigger
                            className={cn(
                                errors?.hubId ? "ring ring-destructive" : "",
                            )}
                        >
                            <SelectValue placeholder="Select a hub" />
                        </SelectTrigger>
                        <SelectContent>
                            {hubs?.map((hub) => (
                                <SelectItem
                                    key={hub.id}
                                    value={hub.id.toString()}
                                >
                                    {hub.id}
                                    {/* TODO: Replace with a field from the hub model */}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    {errors?.hubId ? (
                        <p className="mt-2 text-xs text-destructive">
                            {errors.hubId[0]}
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
                                addOptimistic({ action: "delete", data: event })
                            const error = await deleteEventAction(event.id)
                            setIsDeleting(false)
                            const errorFormatted = {
                                error: error ?? "Error",
                                values: event,
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

export default EventForm

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
