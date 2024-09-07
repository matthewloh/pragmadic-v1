"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type VisaApplication,
    CompleteVisaApplication,
} from "@/lib/db/schema/visaApplications"
import Modal from "@/components/shared/Modal"
import { type Region, type RegionId } from "@/lib/db/schema/regions"
import { useOptimisticVisaApplications } from "@/app/(app)/visa-applications/useOptimisticVisaApplications"
import { Button } from "@/components/ui/button"
import VisaApplicationForm from "./VisaApplicationForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (visaApplication?: VisaApplication) => void

export default function VisaApplicationList({
    visaApplications,
    regions,
    regionId,
}: {
    visaApplications: CompleteVisaApplication[]
    regions: Region[]
    regionId?: RegionId
}) {
    const { optimisticVisaApplications, addOptimisticVisaApplication } =
        useOptimisticVisaApplications(visaApplications, regions)
    const [open, setOpen] = useState(false)
    const [activeVisaApplication, setActiveVisaApplication] =
        useState<VisaApplication | null>(null)
    const openModal = (visaApplication?: VisaApplication) => {
        setOpen(true)
        visaApplication
            ? setActiveVisaApplication(visaApplication)
            : setActiveVisaApplication(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeVisaApplication
                        ? "Edit VisaApplication"
                        : "Create Visa Application"
                }
            >
                <VisaApplicationForm
                    visaApplication={activeVisaApplication}
                    addOptimistic={addOptimisticVisaApplication}
                    openModal={openModal}
                    closeModal={closeModal}
                    regions={regions}
                    regionId={regionId}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticVisaApplications.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticVisaApplications.map((visaApplication) => (
                        <VisaApplication
                            visaApplication={visaApplication}
                            key={visaApplication.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const VisaApplication = ({
    visaApplication,
    openModal,
}: {
    visaApplication: CompleteVisaApplication
    openModal: TOpenModal
}) => {
    const optimistic = visaApplication.id === "optimistic"
    const deleting = visaApplication.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("visa-applications")
        ? pathname
        : pathname + "/visa-applications/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{visaApplication.status}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + visaApplication.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No visa applications
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new visa application.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Visa Applications{" "}
                </Button>
            </div>
        </div>
    )
}
