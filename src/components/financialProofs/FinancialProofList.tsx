"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type FinancialProof,
    CompleteFinancialProof,
} from "@/lib/db/schema/financialProofs"
import Modal from "@/components/shared/Modal"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"
import { useOptimisticFinancialProofs } from "@/app/(app)/financial-proofs/useOptimisticFinancialProofs"
import { Button } from "@/components/ui/button"
import FinancialProofForm from "./FinancialProofForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (financialProof?: FinancialProof) => void

export default function FinancialProofList({
    financialProofs,
    visaApplications,
    visaApplicationId,
}: {
    financialProofs: CompleteFinancialProof[]
    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const { optimisticFinancialProofs, addOptimisticFinancialProof } =
        useOptimisticFinancialProofs(financialProofs, visaApplications)
    const [open, setOpen] = useState(false)
    const [activeFinancialProof, setActiveFinancialProof] =
        useState<FinancialProof | null>(null)
    const openModal = (financialProof?: FinancialProof) => {
        setOpen(true)
        financialProof
            ? setActiveFinancialProof(financialProof)
            : setActiveFinancialProof(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeFinancialProof
                        ? "Edit FinancialProof"
                        : "Create Financial Proof"
                }
            >
                <FinancialProofForm
                    financialProof={activeFinancialProof}
                    addOptimistic={addOptimisticFinancialProof}
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
            {optimisticFinancialProofs.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticFinancialProofs.map((financialProof) => (
                        <FinancialProof
                            financialProof={financialProof}
                            key={financialProof.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const FinancialProof = ({
    financialProof,
    openModal,
}: {
    financialProof: CompleteFinancialProof
    openModal: TOpenModal
}) => {
    const optimistic = financialProof.id === "optimistic"
    const deleting = financialProof.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("financial-proofs")
        ? pathname
        : pathname + "/financial-proofs/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{financialProof.status}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + financialProof.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No financial proofs
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new financial proof.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Financial Proofs{" "}
                </Button>
            </div>
        </div>
    )
}
