"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/regions/useOptimisticRegions"
import { type Region } from "@/lib/db/schema/regions"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import RegionForm from "@/components/regions/RegionForm"

export default function OptimisticRegion({ region }: { region: Region }) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: Region) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticRegion, setOptimisticRegion] = useOptimistic(region)
    const updateRegion: TAddOptimistic = (input) =>
        setOptimisticRegion({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <RegionForm
                    region={optimisticRegion}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateRegion}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticRegion.name}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticRegion.id === "optimistic" ? "animate-pulse" : "",
                )}
            >
                {JSON.stringify(optimisticRegion, null, 2)}
            </pre>
        </div>
    )
}
