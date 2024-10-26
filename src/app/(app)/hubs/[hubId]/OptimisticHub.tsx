"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/hubs/useOptimisticHubs"
import { type Hub } from "@/lib/db/schema/hubs"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import HubForm from "@/components/hubs/HubForm"
import { type State, type StateId } from "@/lib/db/schema/states"
import { RoleType } from "@/lib/auth/get-user-role"

export default function OptimisticHub({
    hub,
    states,
    stateId,
    user_roles,
}: {
    hub: Hub

    states: State[]
    stateId?: StateId
    user_roles: RoleType[]
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Hub) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticHub, setOptimisticHub] = useOptimistic(hub)
    const updateHub: TAddOptimistic = (input) =>
        setOptimisticHub({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <HubForm
                    hub={optimisticHub}
                    states={states}
                    stateId={stateId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateHub}
                    user_roles={user_roles}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">{optimisticHub.name}</h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticHub.id === "optimistic" ? "animate-pulse" : "",
                )}
            >
                {JSON.stringify(optimisticHub, null, 2)}
            </pre>
        </div>
    )
}
