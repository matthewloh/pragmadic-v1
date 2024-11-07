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
import { CalendarIcon, Clock, Info, Type, Users, X } from "lucide-react"
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
import { Textarea } from "@/components/ui/textarea"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

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
    const [isSubmitting, setIsSubmitting] = useState(false)
    const editing = !!event?.id
    const [eventDate, setEventDate] = useState<Date | undefined>(
        event ? new Date(event.startDate) : undefined,
    )
    const [completionDate, setCompletionDate] = useState<Date | undefined>(
        event?.endDate ? new Date(event.endDate) : undefined,
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
            if (action === "delete") router.push(`/hubs/${hubId}/events`)
        }
    }

    const handleSubmit = async (data: FormData) => {
        setIsSubmitting(true)
        setErrors(null)
        const payload = Object.fromEntries(data.entries())

        // Convert dates to proper format
        const formattedPayload = {
            ...payload,
            startDate: eventDate, // Use the state values instead of form data
            endDate: completionDate,
            isComplete: payload.isComplete === "on", // Convert checkbox value
            hubId: hubId || payload.hubId,
        }

        const eventParsed =
            await insertEventParams.safeParseAsync(formattedPayload)

        if (!eventParsed.success) {
            const fieldErrors = eventParsed.error.flatten().fieldErrors
            console.log("Validation errors:", fieldErrors) // For debugging
            setErrors(fieldErrors)
            setIsSubmitting(false)
            toast.error(`Please check the form for errors`)
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
            setIsSubmitting(false)
        }
    }

    return (
        <form
            action={handleSubmit}
            onChange={handleChange}
            className="space-y-8"
        >
            <Card className="p-6">
                <div className="grid gap-8 md:grid-cols-2">
                    {/* Left Column */}
                    <div className="space-y-6">
                        <div>
                            <Label
                                className={cn(
                                    "mb-2 inline-flex items-center gap-2",
                                    errors?.name ? "text-destructive" : "",
                                )}
                            >
                                <Type className="h-4 w-4" /> Event Name
                            </Label>
                            <Input
                                type="text"
                                name="name"
                                className={cn(
                                    errors?.name ? "ring ring-destructive" : "",
                                )}
                                defaultValue={event?.name ?? ""}
                                placeholder="Enter event name"
                            />
                            {errors?.name && (
                                <p className="mt-2 text-xs text-destructive">
                                    {errors.name[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                className={cn(
                                    "mb-2 inline-flex items-center gap-2",
                                    errors?.description
                                        ? "text-destructive"
                                        : "",
                                )}
                            >
                                <Info className="h-4 w-4" /> Description
                            </Label>
                            <Textarea
                                name="description"
                                className={cn(
                                    "min-h-[100px] resize-none",
                                    errors?.description
                                        ? "ring ring-destructive"
                                        : "",
                                )}
                                defaultValue={event?.description ?? ""}
                                placeholder="Describe your event"
                            />
                            {errors?.description && (
                                <p className="mt-2 text-xs text-destructive">
                                    {errors.description[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                className={cn(
                                    "mb-2 inline-flex items-center gap-2",
                                    errors?.typeOfEvent
                                        ? "text-destructive"
                                        : "",
                                )}
                            >
                                <Type className="h-4 w-4" /> Event Type
                            </Label>
                            <Select
                                defaultValue={event?.typeOfEvent}
                                name="typeOfEvent"
                            >
                                <SelectTrigger
                                    className={cn(
                                        errors?.typeOfEvent
                                            ? "ring ring-destructive"
                                            : "",
                                    )}
                                >
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="workshop">
                                        Workshop
                                    </SelectItem>
                                    <SelectItem value="meetup">
                                        Meetup
                                    </SelectItem>
                                    <SelectItem value="conference">
                                        Conference
                                    </SelectItem>
                                    <SelectItem value="social">
                                        Social
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            {errors?.typeOfEvent && (
                                <p className="mt-2 text-xs text-destructive">
                                    {errors.typeOfEvent[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label
                                    className={cn(
                                        "mb-2 inline-flex items-center gap-2",
                                        errors?.startDate
                                            ? "text-destructive"
                                            : "",
                                    )}
                                >
                                    <CalendarIcon className="h-4 w-4" /> Start
                                    Date
                                </Label>
                                <Popover modal={true}>
                                    <Input
                                        name="startDate"
                                        value={eventDate?.toUTCString()}
                                        className="hidden"
                                        readOnly
                                    />
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                            )}
                                        >
                                            {eventDate
                                                ? format(eventDate, "PPP")
                                                : "Select date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            onSelect={setEventDate}
                                            selected={eventDate}
                                            initialFocus
                                            fromDate={new Date()}
                                            toDate={
                                                new Date(
                                                    new Date().setFullYear(
                                                        new Date().getFullYear() +
                                                            1,
                                                    ),
                                                )
                                            }
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>

                            <div>
                                <Label
                                    className={cn(
                                        "mb-2 inline-flex items-center gap-2",
                                        errors?.endDate
                                            ? "text-destructive"
                                            : "",
                                    )}
                                >
                                    <Clock className="h-4 w-4" /> End Date
                                </Label>
                                <Popover modal={true}>
                                    <Input
                                        name="endDate"
                                        value={completionDate?.toUTCString()}
                                        className="hidden"
                                        readOnly
                                    />
                                    <PopoverTrigger asChild>
                                        <Button
                                            variant="outline"
                                            className={cn(
                                                "w-full justify-start text-left font-normal",
                                            )}
                                        >
                                            {completionDate
                                                ? format(completionDate, "PPP")
                                                : "Select date"}
                                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-auto p-0"
                                        align="start"
                                    >
                                        <Calendar
                                            mode="single"
                                            onSelect={setCompletionDate}
                                            selected={completionDate}
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                            </div>
                        </div>

                        <div>
                            <Label
                                className={cn(
                                    "mb-2 inline-flex items-center gap-2",
                                    errors?.info ? "text-destructive" : "",
                                )}
                            >
                                <Info className="h-4 w-4" /> Additional
                                Information
                            </Label>
                            <Textarea
                                name="info"
                                className={cn(
                                    errors?.info ? "ring ring-destructive" : "",
                                )}
                                defaultValue={event?.info ?? ""}
                                placeholder="Enter any additional information"
                            />
                            {errors?.info && (
                                <p className="mt-2 text-xs text-destructive">
                                    {errors.info[0]}
                                </p>
                            )}
                        </div>

                        <div className="flex items-center gap-2">
                            <Checkbox
                                defaultChecked={event?.isComplete}
                                name="isComplete"
                                id="isComplete"
                                className={cn(
                                    errors?.isComplete
                                        ? "ring ring-destructive"
                                        : "",
                                )}
                            />
                            <Label
                                htmlFor="isComplete"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Mark as Complete
                            </Label>
                        </div>
                    </div>
                </div>

                {!hubId && (
                    <div>
                        <Label
                            className={cn(
                                "mb-2 inline-flex items-center gap-2",
                                errors?.hubId ? "text-destructive" : "",
                            )}
                        >
                            <Users className="h-4 w-4" /> Hub
                        </Label>
                        <Select defaultValue={event?.hubId} name="hubId">
                            <SelectTrigger
                                className={cn(
                                    errors?.hubId
                                        ? "ring ring-destructive"
                                        : "",
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
                                        {hub.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors?.hubId && (
                            <p className="mt-2 text-xs text-destructive">
                                {errors.hubId[0]}
                            </p>
                        )}
                    </div>
                )}

                <Separator className="my-8" />

                <div className="flex justify-end gap-4">
                    {editing && (
                        <Button
                            type="button"
                            disabled={isDeleting || pending || hasErrors}
                            variant="destructive"
                            onClick={() => {
                                setIsDeleting(true)
                                closeModal && closeModal()
                                startMutation(async () => {
                                    addOptimistic &&
                                        addOptimistic({
                                            action: "delete",
                                            data: event,
                                        })
                                    const error = await deleteEventAction(
                                        event.id,
                                    )
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
                            <X className="mr-2 h-4 w-4" />
                            Delet{isDeleting ? "ing..." : "e"}
                        </Button>
                    )}
                    <SaveButton editing={editing} disabled={isSubmitting} />
                </div>
            </Card>
        </form>
    )
}

export default EventForm

const SaveButton = ({
    editing,
    disabled,
}: {
    editing: boolean
    disabled: boolean
}) => {
    const { pending } = useFormStatus()
    const isCreating = pending && editing === false
    const isUpdating = pending && editing === true
    return (
        <Button
            type="submit"
            className="min-w-[120px]"
            disabled={isCreating || isUpdating || disabled}
            aria-disabled={isCreating || isUpdating || disabled}
        >
            {editing
                ? `Sav${isUpdating ? "ing..." : "e"}`
                : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
    )
}
