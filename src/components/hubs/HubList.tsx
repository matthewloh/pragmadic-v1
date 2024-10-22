"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { type Hub, CompleteHub } from "@/lib/db/schema/hubs"
import Modal from "@/components/shared/Modal"
import { type State, type StateId } from "@/lib/db/schema/states"
import { useOptimisticHubs } from "@/app/(app)/hubs/useOptimisticHubs"
import { Button } from "@/components/ui/button"
import HubForm from "./HubForm"
import { PlusIcon, Edit2Icon, Eye } from "lucide-react"
import { RoleType } from "@/lib/auth/get-user-role"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type TOpenModal = (hub?: Hub) => void

export default function HubList({
    hubs,
    states,
    stateId,
    role,
}: {
    hubs: CompleteHub[]
    states: State[]
    stateId?: StateId
    role: RoleType
}) {
    const { optimisticHubs, addOptimisticHub } = useOptimisticHubs(hubs, states)
    const [open, setOpen] = useState(false)
    const [activeHub, setActiveHub] = useState<Hub | null>(null)
    const openModal = (hub?: Hub) => {
        setOpen(true)
        hub ? setActiveHub(hub) : setActiveHub(null)
    }
    const closeModal = () => setOpen(false)
    const isAdmin = role === "admin"

    return (
        <div className="space-y-4">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeHub ? "Edit Hub" : "Create Hub"}
            >
                <HubForm
                    hub={activeHub}
                    addOptimistic={addOptimisticHub}
                    openModal={openModal}
                    closeModal={closeModal}
                    states={states}
                    stateId={stateId}
                    role={role}
                />
            </Modal>
            {isAdmin && (
                <div className="flex justify-end">
                    <Button onClick={() => openModal()} className="gap-2">
                        <PlusIcon className="h-4 w-4" /> Add Hub
                    </Button>
                </div>
            )}
            {optimisticHubs.length === 0 ? (
                <EmptyState openModal={openModal} isAdmin={isAdmin} />
            ) : (
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {optimisticHubs.map((hub) => (
                        <HubCard key={hub.id} hub={hub} openModal={openModal} isAdmin={isAdmin} />
                    ))}
                </div>
            )}
        </div>
    )
}

const HubCard = ({
    hub,
    openModal,
    isAdmin,
}: {
    hub: CompleteHub
    openModal: TOpenModal
    isAdmin: boolean
}) => {
    const optimistic = hub.id === "optimistic"
    const deleting = hub.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("hubs") ? pathname : pathname + "/hubs/"

    return (
        <Card className={cn(
            mutating ? "opacity-50" : "",
            deleting ? "bg-destructive/5" : ""
        )}>
            <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span>{hub.name}</span>
                    <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" asChild>
                            <Link href={`${basePath}/${hub.id}`}>
                                <Eye className="h-4 w-4" />
                            </Link>
                        </Button>
                        {isAdmin && (
                            <Button variant="ghost" size="icon" onClick={() => openModal(hub)}>
                                <Edit2Icon className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{hub.description || "No description available."}</p>
                <p className="mt-2 text-sm">Type: {hub.typeOfHub || "Not specified"}</p>
                <p className="text-sm">Status: {hub.public ? "Public" : "Private"}</p>
            </CardContent>
        </Card>
    )
}

const EmptyState = ({ openModal, isAdmin }: { openModal: TOpenModal; isAdmin: boolean }) => {
    return (
        <Card className="text-center p-6">
            <h3 className="text-lg font-semibold text-secondary-foreground">No hubs</h3>
            <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin ? "Get started by creating a new hub." : "No hubs available."}
            </p>
            {isAdmin && (
                <div className="mt-6">
                    <Button onClick={() => openModal()}>
                        <PlusIcon className="mr-2 h-4 w-4" /> New Hub
                    </Button>
                </div>
            )}
        </Card>
    )
}
