"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/states/useOptimisticStates"
import { type State } from "@/lib/db/schema/states"
import { type Region } from "@/lib/db/schema/regions"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import StateForm from "@/components/states/StateForm"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Edit2Icon,
    MapPinIcon,
    CalendarIcon,
    UsersIcon,
    CheckCircleIcon,
} from "lucide-react"
import { RoleType } from "@/lib/auth/get-user-role"

export default function OptimisticState({
    state,
    regions,
    user_roles,
}: {
    state: State
    regions: Region[]
    user_roles: RoleType[]
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: State) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticState, setOptimisticState] = useOptimistic(state)
    const updateState: TAddOptimistic = (input) =>
        setOptimisticState({ ...input.data })

    const isAdmin = user_roles.includes("admin")

    return (
        <>
            <Modal open={open} setOpen={setOpen}>
                <StateForm
                    state={optimisticState}
                    regions={regions}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateState}
                />
            </Modal>
            <Card
                className={cn(
                    "overflow-hidden transition-all duration-200",
                    optimisticState.id === "optimistic" ? "animate-pulse" : "",
                )}
            >
                <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-primary">
                                {optimisticState.name}
                            </CardTitle>
                            <CardDescription className="mt-1 flex items-center text-sm text-muted-foreground">
                                <MapPinIcon className="mr-1 h-3 w-3" /> State
                            </CardDescription>
                        </div>
                        {isAdmin && (
                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setOpen(true)}
                            >
                                <Edit2Icon className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="grid gap-4 pt-6">
                    <div>
                        <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                            Description
                        </h4>
                        <p className="text-sm">
                            {optimisticState.description ||
                                "No description available."}
                        </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                                Capital City
                            </h4>
                            <p className="text-sm">
                                {optimisticState.capitalCity || "Unknown"}
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                                Population
                            </h4>
                            <p className="flex items-center text-sm">
                                <UsersIcon className="mr-1 h-3 w-3" />
                                {optimisticState.population?.toLocaleString() ||
                                    "Unknown"}
                            </p>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                                Region
                            </h4>
                            <Badge variant="outline">
                                {regions.find(
                                    (r) => r.id === optimisticState.regionId,
                                )?.name || "Unknown Region"}
                            </Badge>
                        </div>
                        <div>
                            <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                                Approval Status
                            </h4>
                            <Badge
                                variant={
                                    optimisticState.approvedAt
                                        ? "secondary"
                                        : "outline"
                                }
                            >
                                {optimisticState.approvedAt ? (
                                    <>
                                        <CheckCircleIcon className="mr-1 h-3 w-3" />{" "}
                                        Approved
                                    </>
                                ) : (
                                    "Pending"
                                )}
                            </Badge>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                                Created
                            </h4>
                            <p className="flex items-center text-sm">
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                {new Date(
                                    optimisticState.createdAt,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                        <div>
                            <h4 className="mb-1 text-sm font-semibold text-muted-foreground">
                                Last Updated
                            </h4>
                            <p className="flex items-center text-sm">
                                <CalendarIcon className="mr-1 h-3 w-3" />
                                {new Date(
                                    optimisticState.updatedAt,
                                ).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
