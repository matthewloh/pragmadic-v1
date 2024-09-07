"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/health-clearance-info/useOptimisticHealthClearanceInfo"
import { type HealthClearanceInfo } from "@/lib/db/schema/healthClearanceInfo"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import HealthClearanceInfoForm from "@/components/healthClearanceInfo/HealthClearanceInfoForm"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"

export default function OptimisticHealthClearanceInfo({
    healthClearanceInfo,
    visaApplications,
    visaApplicationId,
}: {
    healthClearanceInfo: HealthClearanceInfo

    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: HealthClearanceInfo) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticHealthClearanceInfo, setOptimisticHealthClearanceInfo] =
        useOptimistic(healthClearanceInfo)
    const updateHealthClearanceInfo: TAddOptimistic = (input) =>
        setOptimisticHealthClearanceInfo({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <HealthClearanceInfoForm
                    healthClearanceInfo={optimisticHealthClearanceInfo}
                    visaApplications={visaApplications}
                    visaApplicationId={visaApplicationId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateHealthClearanceInfo}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticHealthClearanceInfo.status}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticHealthClearanceInfo.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticHealthClearanceInfo, null, 2)}
            </pre>
        </div>
    )
}
