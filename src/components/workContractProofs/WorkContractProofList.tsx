"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type WorkContractProof,
    CompleteWorkContractProof,
} from "@/lib/db/schema/workContractProofs"
import Modal from "@/components/shared/Modal"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"
import { useOptimisticWorkContractProofs } from "@/app/(app)/work-contract-proofs/useOptimisticWorkContractProofs"
import { Button } from "@/components/ui/button"
import WorkContractProofForm from "./WorkContractProofForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (workContractProof?: WorkContractProof) => void

export default function WorkContractProofList({
    workContractProofs,
    visaApplications,
    visaApplicationId,
}: {
    workContractProofs: CompleteWorkContractProof[]
    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const { optimisticWorkContractProofs, addOptimisticWorkContractProof } =
        useOptimisticWorkContractProofs(workContractProofs, visaApplications)
    const [open, setOpen] = useState(false)
    const [activeWorkContractProof, setActiveWorkContractProof] =
        useState<WorkContractProof | null>(null)
    const openModal = (workContractProof?: WorkContractProof) => {
        setOpen(true)
        workContractProof
            ? setActiveWorkContractProof(workContractProof)
            : setActiveWorkContractProof(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeWorkContractProof
                        ? "Edit WorkContractProof"
                        : "Create Work Contract Proof"
                }
            >
                <WorkContractProofForm
                    workContractProof={activeWorkContractProof}
                    addOptimistic={addOptimisticWorkContractProof}
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
            {optimisticWorkContractProofs.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticWorkContractProofs.map((workContractProof) => (
                        <WorkContractProof
                            workContractProof={workContractProof}
                            key={workContractProof.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const WorkContractProof = ({
    workContractProof,
    openModal,
}: {
    workContractProof: CompleteWorkContractProof
    openModal: TOpenModal
}) => {
    const optimistic = workContractProof.id === "optimistic"
    const deleting = workContractProof.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("work-contract-proofs")
        ? pathname
        : pathname + "/work-contract-proofs/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{workContractProof.status}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + workContractProof.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No work contract proofs
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new work contract proof.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Work Contract Proofs{" "}
                </Button>
            </div>
        </div>
    )
}
