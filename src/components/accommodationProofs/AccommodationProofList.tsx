"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type AccommodationProof,
    CompleteAccommodationProof,
} from "@/lib/db/schema/accommodationProofs"
import Modal from "@/components/shared/Modal"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"
import { useOptimisticAccommodationProofs } from "@/app/(app)/accommodation-proofs/useOptimisticAccommodationProofs"
import { Button } from "@/components/ui/button"
import AccommodationProofForm from "./AccommodationProofForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (accommodationProof?: AccommodationProof) => void

export default function AccommodationProofList({
    accommodationProofs,
    visaApplications,
    visaApplicationId,
}: {
    accommodationProofs: CompleteAccommodationProof[]
    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const { optimisticAccommodationProofs, addOptimisticAccommodationProof } =
        useOptimisticAccommodationProofs(accommodationProofs, visaApplications)
    const [open, setOpen] = useState(false)
    const [activeAccommodationProof, setActiveAccommodationProof] =
        useState<AccommodationProof | null>(null)
    const openModal = (accommodationProof?: AccommodationProof) => {
        setOpen(true)
        accommodationProof
            ? setActiveAccommodationProof(accommodationProof)
            : setActiveAccommodationProof(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeAccommodationProof
                        ? "Edit AccommodationProof"
                        : "Create Accommodation Proof"
                }
            >
                <AccommodationProofForm
                    accommodationProof={activeAccommodationProof}
                    addOptimistic={addOptimisticAccommodationProof}
                    openModal={openModal}
                    closeModal={closeModal}
                    visaApplications={visaApplications}
                    visaApplicationId={visaApplicationId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticAccommodationProofs.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticAccommodationProofs.map((accommodationProof) => (
                        <AccommodationProof
                            accommodationProof={accommodationProof}
                            key={accommodationProof.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const AccommodationProof = ({
    accommodationProof,
    openModal,
}: {
    accommodationProof: CompleteAccommodationProof
    openModal: TOpenModal
}) => {
    const optimistic = accommodationProof.id === "optimistic"
    const deleting = accommodationProof.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("accommodation-proofs")
        ? pathname
        : pathname + "/accommodation-proofs/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{accommodationProof.status}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + accommodationProof.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No accommodation proofs
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new accommodation proof.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Accommodation Proofs{" "}
                </Button>
            </div>
        </div>
    )
}
