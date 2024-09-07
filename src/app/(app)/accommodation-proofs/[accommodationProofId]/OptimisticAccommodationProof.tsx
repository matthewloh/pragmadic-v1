"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/accommodation-proofs/useOptimisticAccommodationProofs"
import { type AccommodationProof } from "@/lib/db/schema/accommodationProofs"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import AccommodationProofForm from "@/components/accommodationProofs/AccommodationProofForm"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"

export default function OptimisticAccommodationProof({
    accommodationProof,
    visaApplications,
    visaApplicationId,
}: {
    accommodationProof: AccommodationProof

    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: AccommodationProof) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticAccommodationProof, setOptimisticAccommodationProof] =
        useOptimistic(accommodationProof)
    const updateAccommodationProof: TAddOptimistic = (input) =>
        setOptimisticAccommodationProof({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <AccommodationProofForm
                    accommodationProof={optimisticAccommodationProof}
                    visaApplications={visaApplications}
                    visaApplicationId={visaApplicationId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateAccommodationProof}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticAccommodationProof.status}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticAccommodationProof.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticAccommodationProof, null, 2)}
            </pre>
        </div>
    )
}
