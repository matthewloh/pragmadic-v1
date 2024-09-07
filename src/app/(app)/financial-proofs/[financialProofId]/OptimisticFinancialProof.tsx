"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/financial-proofs/useOptimisticFinancialProofs"
import { type FinancialProof } from "@/lib/db/schema/financialProofs"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import FinancialProofForm from "@/components/financialProofs/FinancialProofForm"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"

export default function OptimisticFinancialProof({
    financialProof,
    visaApplications,
    visaApplicationId,
}: {
    financialProof: FinancialProof

    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: FinancialProof) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticFinancialProof, setOptimisticFinancialProof] =
        useOptimistic(financialProof)
    const updateFinancialProof: TAddOptimistic = (input) =>
        setOptimisticFinancialProof({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <FinancialProofForm
                    financialProof={optimisticFinancialProof}
                    visaApplications={visaApplications}
                    visaApplicationId={visaApplicationId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateFinancialProof}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticFinancialProof.status}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticFinancialProof.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticFinancialProof, null, 2)}
            </pre>
        </div>
    )
}
