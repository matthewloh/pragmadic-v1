"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import {
    type HealthClearanceInfo,
    CompleteHealthClearanceInfo,
} from "@/lib/db/schema/healthClearanceInfo"
import Modal from "@/components/shared/Modal"
import {
    type VisaApplication,
    type VisaApplicationId,
} from "@/lib/db/schema/visaApplications"
import { useOptimisticHealthClearanceInfos } from "@/app/(app)/health-clearance-info/useOptimisticHealthClearanceInfo"
import { Button } from "@/components/ui/button"
import HealthClearanceInfoForm from "./HealthClearanceInfoForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (healthClearanceInfo?: HealthClearanceInfo) => void

export default function HealthClearanceInfoList({
    healthClearanceInfo,
    visaApplications,
    visaApplicationId,
}: {
    healthClearanceInfo: CompleteHealthClearanceInfo[]
    visaApplications: VisaApplication[]
    visaApplicationId?: VisaApplicationId
}) {
    const { optimisticHealthClearanceInfos, addOptimisticHealthClearanceInfo } =
        useOptimisticHealthClearanceInfos(healthClearanceInfo, visaApplications)
    const [open, setOpen] = useState(false)
    const [activeHealthClearanceInfo, setActiveHealthClearanceInfo] =
        useState<HealthClearanceInfo | null>(null)
    const openModal = (healthClearanceInfo?: HealthClearanceInfo) => {
        setOpen(true)
        healthClearanceInfo
            ? setActiveHealthClearanceInfo(healthClearanceInfo)
            : setActiveHealthClearanceInfo(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={
                    activeHealthClearanceInfo
                        ? "Edit HealthClearanceInfo"
                        : "Create Health Clearance Info"
                }
            >
                <HealthClearanceInfoForm
                    healthClearanceInfo={activeHealthClearanceInfo}
                    addOptimistic={addOptimisticHealthClearanceInfo}
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
            {optimisticHealthClearanceInfos.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticHealthClearanceInfos.map(
                        (healthClearanceInfo) => (
                            <HealthClearanceInfo
                                healthClearanceInfo={healthClearanceInfo}
                                key={healthClearanceInfo.id}
                                openModal={openModal}
                            />
                        ),
                    )}
                </ul>
            )}
        </div>
    )
}

const HealthClearanceInfo = ({
    healthClearanceInfo,
    openModal,
}: {
    healthClearanceInfo: CompleteHealthClearanceInfo
    openModal: TOpenModal
}) => {
    const optimistic = healthClearanceInfo.id === "optimistic"
    const deleting = healthClearanceInfo.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("health-clearance-info")
        ? pathname
        : pathname + "/health-clearance-info/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{healthClearanceInfo.status}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + healthClearanceInfo.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No health clearance info
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new health clearance info.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Health Clearance Info{" "}
                </Button>
            </div>
        </div>
    )
}
