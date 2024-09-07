"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/work-contract-proofs/useOptimisticWorkContractProofs"
import { type WorkContractProof } from "@/lib/db/schema/workContractProofs"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import WorkContractProofForm from "@/components/workContractProofs/WorkContractProofForm"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"

export default function OptimisticWorkContractProof({
    workContractProof,
    visaApplications,
    visaApplicationId,
}: {
    workContractProof: WorkContractProof

    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: WorkContractProof) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticWorkContractProof, setOptimisticWorkContractProof] =
        useOptimistic(workContractProof)
    const updateWorkContractProof: TAddOptimistic = (input) =>
        setOptimisticWorkContractProof({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <WorkContractProofForm
                    workContractProof={optimisticWorkContractProof}
                    visaApplications={visaApplications}
                    visaApplicationId={visaApplicationId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateWorkContractProof}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticWorkContractProof.status}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticWorkContractProof.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticWorkContractProof, null, 2)}
            </pre>
        </div>
    )
}
