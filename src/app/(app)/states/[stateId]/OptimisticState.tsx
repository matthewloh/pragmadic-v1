"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/states/useOptimisticStates"
import { type State } from "@/lib/db/schema/states"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import StateForm from "@/components/states/StateForm"
import { type Region, type RegionId } from "@/lib/db/schema/regions"

export default function OptimisticState({
    state,
    regions,
    regionId,
}: {
    state: State

    regions: Region[]
    regionId?: RegionId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: State) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticState, setOptimisticState] = useOptimistic(state)
    const updateState: TAddOptimistic = (input) =>
        setOptimisticState({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <StateForm
                    state={optimisticState}
                    regions={regions}
                    regionId={regionId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateState}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticState.name}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticState.id === "optimistic" ? "animate-pulse" : "",
                )}
            >
                {JSON.stringify(optimisticState, null, 2)}
            </pre>
        </div>
    )
}
