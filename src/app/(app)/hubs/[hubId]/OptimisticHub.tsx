"use client"

import { TAddOptimistic } from "@/app/(app)/hubs/useOptimisticHubs"
import { type Hub } from "@/lib/db/schema/hubs"
import { cn } from "@/lib/utils"
import { useOptimistic, useState } from "react"
import {
    Edit3,
    MapPin,
    Globe,
    Lock,
    Calendar,
    Clock,
    Info,
    Mail,
    Building2,
    Hash,
    Users,
} from "lucide-react"
import { format } from "date-fns"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import HubForm from "@/components/hubs/HubForm"
import Modal from "@/components/shared/Modal"
import { Button } from "@/components/ui/button"
import { type State, type StateId } from "@/lib/db/schema/states"
import { Badge } from "@/components/ui/badge"
import { BackButton } from "@/components/shared/BackButton"
import { Separator } from "@/components/ui/separator"

export default function OptimisticHub({
    hub,
    states,
    stateId,
}: {
    hub: Hub
    states: State[]
    stateId?: StateId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Hub) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticHub, setOptimisticHub] = useOptimistic(hub)
    const updateHub: TAddOptimistic = (input) =>
        setOptimisticHub({ ...input.data })

    const currentState = states.find(
        (state) => state.id === optimisticHub.stateId,
    )

    return (
        <div
            className={cn(
                "relative flex flex-col gap-6 rounded-xl bg-gradient-to-b from-background via-background to-accent/10",
                optimisticHub.id === "optimistic" ? "animate-pulse" : "",
            )}
        >
            <Modal open={open} setOpen={setOpen}>
                <HubForm
                    hub={optimisticHub}
                    states={states}
                    stateId={stateId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateHub}
                />
            </Modal>

            {/* Header Section */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <BackButton currentResource="hubs" />
                    <div>
                        <div className="flex flex-wrap items-center gap-2">
                            <Badge
                                variant={
                                    optimisticHub.public
                                        ? "secondary"
                                        : "destructive"
                                }
                                className="flex items-center gap-1 shadow-sm"
                            >
                                {optimisticHub.public ? (
                                    <Globe className="h-3 w-3" />
                                ) : (
                                    <Lock className="h-3 w-3" />
                                )}
                                {optimisticHub.public ? "Public" : "Private"}
                            </Badge>
                            <Badge
                                variant="outline"
                                className="flex items-center gap-1 bg-background/50 shadow-sm"
                            >
                                <MapPin className="h-3 w-3 text-blue-500" />
                                {currentState?.name || "Unknown Location"}
                            </Badge>
                            <Badge className="flex items-center gap-1 bg-primary/10 text-primary shadow-sm">
                                <Building2 className="h-3 w-3" />
                                {optimisticHub.typeOfHub}
                            </Badge>
                        </div>
                        <h1 className="mt-2 bg-gradient-to-br from-primary via-primary/90 to-primary/70 bg-clip-text text-3xl font-bold tracking-tight text-transparent">
                            {optimisticHub.name}
                        </h1>
                    </div>
                </div>
                <Button
                    onClick={() => setOpen(true)}
                    variant="outline"
                    size="sm"
                    className="h-8 gap-2 bg-background/50 shadow-sm hover:bg-accent"
                >
                    <Edit3 className="h-4 w-4 text-muted-foreground" />
                    <span className="hidden sm:inline">Edit Hub</span>
                </Button>
            </div>

            {/* Content Section */}
            <div className="grid gap-6 md:grid-cols-2">
                {/* Left Column */}
                <div className="flex flex-col gap-4">
                    {/* Description Card */}
                    <div className="flex-1 rounded-lg border bg-card/30 p-4 shadow-sm">
                        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                            <Info className="h-4 w-4 text-blue-500" />
                            Description
                        </div>
                        <p className="text-sm text-foreground/90">
                            {optimisticHub.description ||
                                "No description provided."}
                        </p>
                    </div>

                    {/* Metadata Card */}
                    <div className="flex-1 rounded-lg border bg-card/30 p-4 shadow-sm">
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Building2 className="h-4 w-4 text-violet-500" />
                                    Hub Type
                                </div>
                                <p className="text-sm font-medium text-foreground/90">
                                    {optimisticHub.typeOfHub || "Not specified"}
                                </p>
                            </div>
                            <div className="space-y-2">
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Clock className="h-4 w-4 text-orange-500" />
                                    Last Updated
                                </div>
                                <p className="text-sm font-medium text-foreground/90">
                                    {format(
                                        new Date(optimisticHub.updatedAt),
                                        "MMM d, yyyy",
                                    )}
                                </p>
                                <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                    <Calendar className="h-4 w-4 text-blue-500" />
                                    Established{" "}
                                    {format(
                                        new Date(optimisticHub.createdAt),
                                        "MMM d, yyyy",
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Additional Information */}
                <div className="flex flex-col">
                    {optimisticHub.info && (
                        <div className="flex-1 rounded-lg border bg-card/30 p-4 shadow-sm">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Hash className="h-4 w-4 text-emerald-500" />
                                Additional Information
                            </div>
                            <p className="text-sm text-foreground/90">
                                {optimisticHub.info}
                            </p>
                        </div>
                    )}
                    <div className="flex flex-col gap-4">
                        <div className="flex-1 rounded-lg border bg-card/30 p-4 shadow-sm">
                            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                                <Users className="h-4 w-4 text-blue-500" />
                                Members
                            </div>
                        </div>
                    </div>
                </div>
                <Card>
                    <CardHeader>
                        <CardTitle>Hub Location</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {/* TODO: */}
                        {/* <HubMarkerForm
                            marker={optimisticMarker}
                            event={event}
                            addOptimistic={updateMarker}
                        /> */}
                    </CardContent>
                </Card>
            </div>
            <Separator className="my-2" />
        </div>
    )
}
