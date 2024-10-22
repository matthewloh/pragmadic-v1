"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/regions/useOptimisticRegions"
import { type Region } from "@/lib/db/schema/regions"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import RegionForm from "@/components/regions/RegionForm"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Edit2Icon, MapPinIcon, CalendarIcon } from "lucide-react"
import { RoleType } from "@/lib/auth/get-user-role"

export default function OptimisticRegion({
    region,
    role,
}: {
    region: Region
    role: RoleType
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Region) => setOpen(true)
    const closeModal = () => setOpen(false)
    const [optimisticRegion, setOptimisticRegion] = useOptimistic(region)
    const updateRegion: TAddOptimistic = (input) =>
        setOptimisticRegion({ ...input.data })

    const isAdmin = role === "admin"

    return (
        <>
            <Modal open={open} setOpen={setOpen}>
                <RegionForm
                    region={optimisticRegion}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateRegion}
                />
            </Modal>
            <Card
                className={cn(
                    "overflow-hidden transition-all duration-200",
                    optimisticRegion.id === "optimistic" ? "animate-pulse" : "",
                )}
            >
                <CardHeader className="bg-primary/5 pb-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle className="text-2xl font-bold text-primary">
                                {optimisticRegion.name}
                            </CardTitle>
                            <CardDescription className="flex items-center text-sm text-muted-foreground mt-1">
                                <MapPinIcon className="mr-1 h-3 w-3" /> Region
                            </CardDescription>
                        </div>
                        {isAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => setOpen(true)}>
                                <Edit2Icon className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardHeader>
                <CardContent className="pt-6">
                    <div className="space-y-4">
                        <div>
                            <h4 className="text-sm font-semibold text-muted-foreground mb-1">Description</h4>
                            <p className="text-sm">{optimisticRegion.description || "No description available."}</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <div>
                                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Status</h4>
                                <Badge variant={optimisticRegion.public ? "default" : "secondary"}>
                                    {optimisticRegion.public ? "Public" : "Private"}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <h4 className="text-sm font-semibold text-muted-foreground mb-1">Created</h4>
                                <p className="text-sm flex items-center justify-end">
                                    <CalendarIcon className="mr-1 h-3 w-3" />
                                    {new Date(optimisticRegion.createdAt).toLocaleDateString()}
                                </p>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </>
    )
}
