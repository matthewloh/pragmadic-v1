"use client"

import { useState } from "react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { type State, CompleteState } from "@/lib/db/schema/states"
import Modal from "@/components/shared/Modal"
import { type Region, type RegionId } from "@/lib/db/schema/regions"
import { useOptimisticStates } from "@/app/(app)/states/useOptimisticStates"
import { Button } from "@/components/ui/button"
import StateForm from "./StateForm"
import { PlusIcon, Edit2Icon, Eye } from "lucide-react"
import { RoleType } from "@/lib/auth/get-user-role"

type TOpenModal = (state?: State) => void

export default function StateList({
    states,
    regions,
    regionId,
    user_roles,
}: {
    states: CompleteState[]
    regions: Region[]
    regionId?: RegionId
    user_roles: RoleType[]
}) {
    const { optimisticStates, addOptimisticState } = useOptimisticStates(
        states,
        regions,
    )
    const [open, setOpen] = useState(false)
    const [activeState, setActiveState] = useState<State | null>(null)
    const openModal = (state?: State) => {
        setOpen(true)
        state ? setActiveState(state) : setActiveState(null)
    }
    const closeModal = () => setOpen(false)

    const isAdmin = user_roles.includes("admin")

    return (
        <div className="space-y-8">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeState ? "Edit State" : "Create State"}
            >
                <StateForm
                    state={activeState}
                    addOptimistic={addOptimisticState}
                    openModal={openModal}
                    closeModal={closeModal}
                    regions={regions}
                    regionId={regionId}
                />
            </Modal>
            {isAdmin && (
                <div className="flex justify-end">
                    <Button onClick={() => openModal()} className="gap-2">
                        <PlusIcon className="h-4 w-4" /> Add State
                    </Button>
                </div>
            )}
            <AnimatePresence>
                {optimisticStates.length === 0 ? (
                    <EmptyState openModal={openModal} isAdmin={isAdmin} />
                ) : (
                    <motion.ul
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {optimisticStates.map((state) => (
                            <State
                                key={state.id}
                                state={state}
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

const State = ({
    state,
    openModal,
    isAdmin,
}: {
    state: CompleteState
    openModal: TOpenModal
    isAdmin: boolean
}) => {
    const optimistic = state.id === "optimistic"
    const deleting = state.id === "delete"
    const mutating = optimistic || deleting
    const pathname = usePathname()
    const basePath = pathname.includes("states")
        ? pathname
        : pathname + "/states/"

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
                        {state.name}
                    </h3>
                    <p className="mt-1 text-sm text-muted-foreground">
                        {state.description}
                    </p>
                </div>
                <div className="flex space-x-2">
                    {isAdmin && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal(state)}
                        >
                            <Edit2Icon className="h-4 w-4" />
                        </Button>
                    )}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href={basePath + "/" + state.id}>
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
                No states
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
                {isAdmin
                    ? "Get started by creating a new state."
                    : "No states are currently available."}
            </p>
            {isAdmin && (
                <div className="mt-6">
                    <Button onClick={() => openModal()}>
                        <PlusIcon className="mr-2 h-4 w-4" /> New State
                    </Button>
                </div>
            )}
        </motion.div>
    )
}
