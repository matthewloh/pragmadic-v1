"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/visa-applications/useOptimisticVisaApplications"
import { type VisaApplication } from "@/lib/db/schema/visaApplications"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import VisaApplicationForm from "@/components/visaApplications/VisaApplicationForm"
import { type Region, type RegionId } from "@/lib/db/schema/regions"

export default function OptimisticVisaApplication({
    visaApplication,
    regions,
    regionId,
}: {
    visaApplication: VisaApplication

    regions: Region[]
    regionId?: RegionId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: VisaApplication) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticVisaApplication, setOptimisticVisaApplication] =
        useOptimistic(visaApplication)
    const updateVisaApplication: TAddOptimistic = (input) =>
        setOptimisticVisaApplication({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <VisaApplicationForm
                    visaApplication={optimisticVisaApplication}
                    regions={regions}
                    regionId={regionId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateVisaApplication}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticVisaApplication.status}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticVisaApplication.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticVisaApplication, null, 2)}
            </pre>
        </div>
    )
}
