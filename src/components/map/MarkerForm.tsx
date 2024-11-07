"use client"

import { useState, useTransition } from "react"
import { useFormStatus } from "react-dom"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { useValidatedForm } from "@/lib/hooks/useValidatedForm"
import { type Action, cn } from "@/lib/utils"
import { type TAddOptimistic } from "@/app/(app)/regions/[regionId]/states/[stateId]/hubs/[hubId]/events/[eventId]/useOptimisticEventMarkers"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, Clock, MapPin, Type, X } from "lucide-react"

import {
    type EventMarker,
    insertEventMarkerParams,
} from "@/lib/db/schema/mapMarkers"
import { type Event } from "@/lib/db/schema/events"
import {
    createEventMarkerAction,
    updateEventMarkerAction,
    deleteEventMarkerAction,
} from "@/features/onboarding/map/hub/actions"
import CoordinatesSelector from "@/app/(onboarding)/onboarding/map/components/CoordinatesSelector"
import { useCurrentUser } from "@/features/auth/hooks/use-current-user"

const EVENT_TYPES = [
    "networking",
    "workshop",
    "social",
    "coworking",
    "cultural",
    "tech_talk",
    "community_meetup",
    "skill_sharing",
    "local_experience",
    "business_showcase",
    "other",
] as const

const validateCoordinates = (
    type: "latitude" | "longitude",
    value: number,
): string | null => {
    if (type === "latitude") {
        if (value < -90 || value > 90) {
            return "Latitude must be between -90 and 90 degrees"
        }
    } else {
        if (value < -180 || value > 180) {
            return "Longitude must be between -180 and 180 degrees"
        }
    }
    return null
}

export default function EventMarkerForm({
    marker,
    event,
    closeModal,
    addOptimistic,
}: {
    marker?: EventMarker | null
    event: Event
    closeModal?: () => void
    addOptimistic?: TAddOptimistic
}) {
    const { data: user } = useCurrentUser()
    const isCreator = user?.id === event.userId
    const { errors, hasErrors, setErrors, handleChange } =
        useValidatedForm<EventMarker>(insertEventMarkerParams)
    const editing = !!marker?.id

    const [isDeleting, setIsDeleting] = useState(false)
    const [pending, startMutation] = useTransition()

    const router = useRouter()

    const onSuccess = (action: Action, error?: string) => {
        if (error) {
            toast.error(`Failed to ${action}`, {
                description: error,
            })
        } else {
            router.refresh()
            toast.success(`Marker ${action}d!`)
            closeModal?.()
        }
    }

    const handleSubmit = async (data: FormData) => {
        setErrors(null)

        const payload = Object.fromEntries(data.entries())

        try {
            const markerParsed = await insertEventMarkerParams.safeParseAsync({
                ...payload,
                eventId: event.id,
                // Convert latitude and longitude to strings
                latitude: String(payload.latitude),
                longitude: String(payload.longitude),
                // Convert datetime strings to Date objects
                startTime: new Date(payload.startTime as string),
                endTime: new Date(payload.endTime as string),
            })

            if (!markerParsed.success) {
                setErrors(markerParsed?.error.flatten().fieldErrors)
                return
            }

            const values = markerParsed.data
            const pendingMarker: EventMarker = {
                ...values,
                updatedAt: marker?.updatedAt ?? new Date(),
                createdAt: marker?.createdAt ?? new Date(),
                id: marker?.id ?? "",
                userId: marker?.userId ?? "",
                venue: values.venue ?? null,
                object_id: marker?.object_id ?? null,
            }

            startMutation(async () => {
                addOptimistic?.({
                    data: pendingMarker,
                    action: editing ? "update" : "create",
                })

                const error = editing
                    ? await updateEventMarkerAction(marker.id, {
                          ...values,
                          id: marker.id,
                      })
                    : await createEventMarkerAction(values)

                onSuccess(editing ? "update" : "create", error ?? undefined)
            })
        } catch (e) {
            toast.error("Error saving marker")
            console.error(e)
        }
    }

    const handleCoordinateChange = (
        e: React.ChangeEvent<HTMLInputElement>,
        type: "latitude" | "longitude",
    ) => {
        const value = parseFloat(e.target.value)
        const error = validateCoordinates(type, value)

        if (error) {
            setErrors({ ...errors, [type]: [error] })
            e.target.value = e.target.defaultValue // Reset to previous value
        } else {
            // Clear error if valid
            const newErrors = { ...errors }
            delete newErrors[type]
            setErrors(newErrors)
        }
    }

    // Add state for coordinates
    const [coordinates, setCoordinates] = useState({
        latitude: marker?.latitude ? parseFloat(marker.latitude) : 5.4164,
        longitude: marker?.longitude ? parseFloat(marker.longitude) : 100.3327,
    })

    // Handle coordinate updates from the map
    const handleCoordinatesChange = (lat: number, lng: number) => {
        setCoordinates({ latitude: lat, longitude: lng })

        // Update the form inputs
        const latInput = document.querySelector(
            'input[name="latitude"]',
        ) as HTMLInputElement
        const lngInput = document.querySelector(
            'input[name="longitude"]',
        ) as HTMLInputElement
        if (latInput) latInput.value = lat.toString()
        if (lngInput) lngInput.value = lng.toString()
    }

    return (
        <form action={handleSubmit} onChange={handleChange}>
            <Card className="p-6">
                <div className="grid gap-8 md:grid-cols-1">
                    <div className="space-y-6">
                        <div>
                            <Label
                                className={cn(
                                    "mb-2 inline-flex items-center gap-2",
                                    errors?.venue ? "text-destructive" : "",
                                )}
                            >
                                <Type className="h-4 w-4" /> Venue Name
                            </Label>
                            <Input
                                name="venue"
                                className={cn(
                                    errors?.venue
                                        ? "ring ring-destructive"
                                        : "",
                                )}
                                defaultValue={marker?.venue ?? ""}
                                placeholder="Enter venue name"
                            />
                            {errors?.venue && (
                                <p className="mt-2 text-xs text-destructive">
                                    {errors.venue[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                className={cn(
                                    "mb-2 inline-flex items-center gap-2",
                                    errors?.address ? "text-destructive" : "",
                                )}
                            >
                                <MapPin className="h-4 w-4" /> Address
                            </Label>
                            <Textarea
                                name="address"
                                className={cn(
                                    "min-h-[100px] resize-none",
                                    errors?.address
                                        ? "ring ring-destructive"
                                        : "",
                                )}
                                defaultValue={marker?.address ?? ""}
                                placeholder="Enter full address"
                            />
                            {errors?.address && (
                                <p className="mt-2 text-xs text-destructive">
                                    {errors.address[0]}
                                </p>
                            )}
                        </div>

                        <div>
                            <Label
                                className={cn(
                                    "mb-2 inline-flex items-center gap-2",
                                    errors?.eventType ? "text-destructive" : "",
                                )}
                            >
                                <Type className="h-4 w-4" /> Event Type
                            </Label>
                            <Select
                                defaultValue={marker?.eventType}
                                name="eventType"
                            >
                                <SelectTrigger
                                    className={cn(
                                        errors?.eventType
                                            ? "ring ring-destructive"
                                            : "",
                                    )}
                                >
                                    <SelectValue placeholder="Select event type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EVENT_TYPES.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {type
                                                .split("_")
                                                .map(
                                                    (word) =>
                                                        word
                                                            .charAt(0)
                                                            .toUpperCase() +
                                                        word.slice(1),
                                                )
                                                .join(" ")}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors?.eventType && (
                                <p className="mt-2 text-xs text-destructive">
                                    {errors.eventType[0]}
                                </p>
                            )}
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-6">
                        <CoordinatesSelector
                            defaultLatitude={coordinates.latitude}
                            defaultLongitude={coordinates.longitude}
                            onCoordinatesChange={handleCoordinatesChange}
                        />
                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label
                                    className={cn(
                                        "mb-2 inline-flex items-center gap-2",
                                        errors?.latitude
                                            ? "text-destructive"
                                            : "",
                                    )}
                                >
                                    <MapPin className="h-4 w-4" /> Latitude
                                </Label>
                                <Input
                                    type="number"
                                    name="latitude"
                                    step="any"
                                    min="-90"
                                    max="90"
                                    className={cn(
                                        errors?.latitude
                                            ? "ring ring-destructive"
                                            : "",
                                    )}
                                    defaultValue={coordinates.latitude}
                                    placeholder="Enter latitude (-90 to 90)"
                                    onChange={(e) =>
                                        handleCoordinateChange(e, "latitude")
                                    }
                                />
                                {errors?.latitude && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {errors.latitude[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    className={cn(
                                        "mb-2 inline-flex items-center gap-2",
                                        errors?.longitude
                                            ? "text-destructive"
                                            : "",
                                    )}
                                >
                                    <MapPin className="h-4 w-4" /> Longitude
                                </Label>
                                <Input
                                    type="number"
                                    name="longitude"
                                    step="any"
                                    min="-180"
                                    max="180"
                                    className={cn(
                                        errors?.longitude
                                            ? "ring ring-destructive"
                                            : "",
                                    )}
                                    defaultValue={coordinates.longitude}
                                    placeholder="Enter longitude (-180 to 180)"
                                    onChange={(e) =>
                                        handleCoordinateChange(e, "longitude")
                                    }
                                />
                                {errors?.longitude && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {errors.longitude[0]}
                                    </p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-2">
                            <div>
                                <Label
                                    className={cn(
                                        "mb-2 inline-flex items-center gap-2",
                                        errors?.startTime
                                            ? "text-destructive"
                                            : "",
                                    )}
                                >
                                    <Clock className="h-4 w-4" /> Start Time
                                </Label>
                                <Input
                                    type="datetime-local"
                                    name="startTime"
                                    className={cn(
                                        errors?.startTime
                                            ? "ring ring-destructive"
                                            : "",
                                    )}
                                    defaultValue={
                                        marker?.startTime
                                            ? new Date(marker.startTime)
                                                  .toISOString()
                                                  .slice(0, 16)
                                            : new Date()
                                                  .toISOString()
                                                  .slice(0, 16)
                                    }
                                />
                                {errors?.startTime && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {errors.startTime[0]}
                                    </p>
                                )}
                            </div>

                            <div>
                                <Label
                                    className={cn(
                                        "mb-2 inline-flex items-center gap-2",
                                        errors?.endTime
                                            ? "text-destructive"
                                            : "",
                                    )}
                                >
                                    <Clock className="h-4 w-4" /> End Time
                                </Label>
                                <Input
                                    type="datetime-local"
                                    name="endTime"
                                    className={cn(
                                        errors?.endTime
                                            ? "ring ring-destructive"
                                            : "",
                                    )}
                                    defaultValue={
                                        marker?.endTime
                                            ? new Date(marker.endTime)
                                                  .toISOString()
                                                  .slice(0, 16)
                                            : new Date(Date.now() + 3600000)
                                                  .toISOString()
                                                  .slice(0, 16)
                                    }
                                />
                                {errors?.endTime && (
                                    <p className="mt-2 text-xs text-destructive">
                                        {errors.endTime[0]}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                <Separator className="my-8" />

                <div className="flex justify-end gap-4">
                    {editing && (
                        <Button
                            type="button"
                            disabled={isDeleting || pending || hasErrors}
                            variant="destructive"
                            onClick={() => {
                                setIsDeleting(true)
                                closeModal?.()
                                startMutation(async () => {
                                    addOptimistic?.({
                                        action: "delete",
                                        data: marker,
                                    })
                                    const error = await deleteEventMarkerAction(
                                        marker.id,
                                    )
                                    if (error) {
                                        toast.error("Failed to delete marker", {
                                            description: error,
                                        })
                                    } else {
                                        toast.success("Marker deleted!")
                                    }
                                    setIsDeleting(false)
                                })
                            }}
                        >
                            <X className="mr-2 h-4 w-4" />
                            Delet{isDeleting ? "ing..." : "e"}
                        </Button>
                    )}
                    <SaveButton errors={hasErrors} editing={editing} />
                </div>
            </Card>
        </form>
    )
}

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
            className="min-w-[120px]"
            disabled={isCreating || isUpdating || errors}
            aria-disabled={isCreating || isUpdating || errors}
        >
            {editing
                ? `Sav${isUpdating ? "ing..." : "e"}`
                : `Creat${isCreating ? "ing..." : "e"}`}
        </Button>
    )
}
