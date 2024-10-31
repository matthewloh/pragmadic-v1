"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type Region, CompleteRegion } from "@/lib/db/schema/regions"
import Modal from "@/components/shared/Modal"
import { useOptimisticRegions } from "@/app/(app)/regions/useOptimisticRegions"
import { Button } from "@/components/ui/button"
import RegionForm from "./RegionForm"
import { PlusIcon, Edit2Icon, Eye } from "lucide-react"
import { RoleType } from "@/lib/auth/get-user-role"

type TOpenModal = (region?: Region) => void

export default function RegionList({
    regions,
    user_roles,
}: {
    regions: CompleteRegion[]
    user_roles: RoleType[]
}) {
    const { optimisticRegions, addOptimisticRegion } =
        useOptimisticRegions(regions)
    const [open, setOpen] = useState(false)
    const [activeRegion, setActiveRegion] = useState<Region | null>(null)

    const openModal = (region?: Region) => {
        setOpen(true)
        region ? setActiveRegion(region) : setActiveRegion(null)
    }

    const closeModal = () => setOpen(false)

    const isAdmin = user_roles.includes("admin")

    return (
        <div className="space-y-8">
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
            {optimisticRegions.length > 0 && isAdmin && (
                <div className="flex justify-start">
                    <Button onClick={() => openModal()} className="gap-2">
                        <PlusIcon className="h-4 w-4" /> Add Region
                    </Button>
                </div>
            )}
            <AnimatePresence>
                {optimisticRegions.length === 0 ? (
                    <EmptyState openModal={openModal} isAdmin={isAdmin} />
                ) : (
                    <motion.ul
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {optimisticRegions.map((region) => (
                            <Region
                                key={region.id}
                                region={region}
                                openModal={openModal}
                                isAdmin={isAdmin}
                            />
                        ))}
                    </motion.ul>
                )}
            </AnimatePresence>
        </div>
    )
}

const Region = ({
    region,
    openModal,
    isAdmin,
}: {
    region: CompleteRegion
    openModal: TOpenModal
    isAdmin: boolean
}) => {
    const optimistic = region.id === "optimistic"
    const deleting = region.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("regions")
        ? pathname
        : pathname + "/regions/"

    return (
        <motion.li
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className={cn(
                "rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md",
                mutating ? "animate-pulse opacity-30" : "",
                deleting ? "bg-destructive/30" : "",
            )}
        >
            <div className="flex items-start justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-primary">
                        {region.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {region.description}
                    </p>
                </div>
                <div className="flex space-x-2">
                    {isAdmin && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal(region)}
                        >
                            <Edit2Icon className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={basePath + "/" + region.id}>
                            <Eye className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.li>
    )
}

const EmptyState = ({
    openModal,
    isAdmin,
}: {
    openModal: TOpenModal
    isAdmin: boolean
}) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
        >
            <h3 className="mt-2 text-lg font-semibold text-secondary-foreground">
                No regions
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin
                    ? "Get started by creating a new region."
                    : "No regions are currently available."}
            </p>
            {isAdmin && (
                <div className="mt-6">
                    <Button onClick={() => openModal()}>
                        <PlusIcon className="mr-2 h-4 w-4" /> New Region
                    </Button>
                </div>
            )}
        </motion.div>
    )
}
