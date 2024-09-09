"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"
import { type Region, CompleteRegion } from "@/lib/db/schema/regions"
import Modal from "@/components/shared/Modal"

import { useOptimisticRegions } from "@/app/(app)/regions/useOptimisticRegions"
import { Button } from "@/components/ui/button"
import RegionForm from "./RegionForm"
import { PlusIcon } from "lucide-react"

type TOpenModal = (region?: Region) => void

export default function RegionList({ regions }: { regions: CompleteRegion[] }) {
    const { optimisticRegions, addOptimisticRegion } =
        useOptimisticRegions(regions)

    const [open, setOpen] = useState(false)

    const [activeRegion, setActiveRegion] = useState<Region | null>(null)

    const openModal = (region?: Region) => {
        setOpen(true)
        region ? setActiveRegion(region) : setActiveRegion(null)
    }

    const closeModal = () => setOpen(false)

    return (
        <div>
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeRegion ? "Edit Region" : "Create Region"}
            >
                <RegionForm
                    region={activeRegion}
                    addOptimistic={addOptimisticRegion}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            </Modal>
            <div className="absolute right-0 top-0">
                <Button onClick={() => openModal()} variant={"outline"}>
                    +
                </Button>
            </div>
            {optimisticRegions.length === 0 ? (
                <EmptyState openModal={openModal} />
            ) : (
                <ul>
                    {optimisticRegions.map((region) => (
                        <Region
                            region={region}
                            key={region.id}
                            openModal={openModal}
                        />
                    ))}
                </ul>
            )}
        </div>
    )
}

const Region = ({
    region,
    openModal,
}: {
    region: CompleteRegion
    openModal: TOpenModal
}) => {
    const optimistic = region.id === "optimistic"
    const deleting = region.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("regions")
        ? pathname
        : pathname + "/regions/"

    return (
        <li
            className={cn(
                "my-2 flex justify-between",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "text-destructive" : "",
            )}
        >
            <div className="w-full">
                <div>{region.name}</div>
            </div>
            <Button variant={"link"} asChild>
                <Link href={basePath + "/" + region.id}>Edit</Link>
            </Button>
        </li>
    )
}

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
    return (
        <div className="text-center">
            <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
                No regions
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                Get started by creating a new region.
            </p>
            <div className="mt-6">
                <Button onClick={() => openModal()}>
                    <PlusIcon className="h-4" /> New Regions{" "}
                </Button>
            </div>
        </div>
    )
}
