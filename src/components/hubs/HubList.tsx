"use client"

import Link from "next/link"
import { useState } from "react"
import { usePathname } from "next/navigation"
import { AnimatePresence, motion } from "framer-motion"
import { Eye, Users, Edit2Icon, PlusIcon, Crown } from "lucide-react"
import { useOptimisticHubs } from "@/app/(app)/hubs/useOptimisticHubs"
import { useUserRole } from "@/features/auth/hooks/use-user-role"
import { type Hub, CompleteHub } from "@/lib/db/schema/hubs"
import { type State, type StateId } from "@/lib/db/schema/states"
import { type SelectUser } from "@/lib/db/schema"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import Modal from "@/components/shared/Modal"
import HubForm from "./HubForm"
import { Badge } from "@/components/ui/badge"
import useSupabaseBrowser from "@/utils/supabase/client"
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query"

type TOpenModal = (hub?: Hub) => void

export default function HubList({
    hubs,
    states,
    stateId,
    user,
}: {
    hubs: CompleteHub[]
    states: State[]
    stateId?: StateId
    user: SelectUser | null
}) {
    const { optimisticHubs, addOptimisticHub } = useOptimisticHubs(hubs, states)
    const [open, setOpen] = useState(false)
    const [activeHub, setActiveHub] = useState<Hub | null>(null)
    const { data, isLoading } = useUserRole()
    const user_roles = data?.user_roles ?? []
    const isAdmin = user_roles.includes("admin")
    const isOwner = user_roles.includes("owner")
    const openModal = (hub?: Hub) => {
        setOpen(true)
        hub ? setActiveHub(hub) : setActiveHub(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div className="flex h-full flex-1 flex-col gap-2 rounded-xl bg-gradient-to-br from-background/10 to-primary/10">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeHub ? "Edit Hub" : "Create Hub"}
            >
                <HubForm
                    hub={activeHub}
                    addOptimistic={addOptimisticHub}
                    openModal={openModal}
                    closeModal={closeModal}
                    states={states}
                    stateId={stateId}
                />
            </Modal>

            {optimisticHubs.length > 0 && (isAdmin || isOwner) && (
                <div className="mt-4 flex justify-start">
                    <Button onClick={() => openModal()} className="gap-2">
                        <PlusIcon className="h-4 w-4" />
                        Add Hub
                    </Button>
                </div>
            )}

            <div className="h-full flex-1 rounded-xl p-4">
                <AnimatePresence>
                    {isLoading ? (
                        <SkeletonLoader />
                    ) : optimisticHubs.length === 0 ? (
                        <EmptyState
                            openModal={openModal}
                            isAdmin={isAdmin}
                            isOwner={isOwner}
                        />
                    ) : (
                        <motion.div
                            className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {optimisticHubs.map((hub, index) => (
                                <HubCard
                                    key={hub.id}
                                    hub={hub}
                                    openModal={openModal}
                                    isAdmin={isAdmin}
                                    isOwner={isOwner}
                                    user={user}
                                    index={index}
                                />
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

const EmptyState = ({
    openModal,
    isAdmin,
    isOwner,
}: {
    openModal: TOpenModal
    isAdmin: boolean
    isOwner: boolean
}) => {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex h-full flex-col items-center justify-center space-y-4 rounded-lg bg-card p-8 text-center"
        >
            <h2 className="text-2xl font-bold text-foreground">No Hubs Yet</h2>
            <p className="text-muted-foreground">
                {isAdmin
                    ? "Get started by creating your first hub."
                    : "No hubs are currently available."}
            </p>
            {isAdmin ||
                (isOwner && (
                    <Button onClick={() => openModal()} className="mt-4">
                        <PlusIcon className="mr-2 h-4 w-4" /> Create Hub
                    </Button>
                ))}
        </motion.div>
    )
}

const HubCard = ({
    hub,
    openModal,
    isAdmin,
    isOwner,
    user,
    index,
}: {
    hub: CompleteHub
    openModal: TOpenModal
    isAdmin: boolean
    isOwner: boolean
    user: SelectUser | null
    index: number
}) => {
    const pathname = usePathname()
    const basePath = pathname.includes("hubs") ? pathname : pathname + "/hubs/"
    const canEdit = isAdmin || (isOwner && hub.userId === user?.id)
    const isOwnerOfHub = hub.userId === user?.id
    const supabase = useSupabaseBrowser()
    const { data: usersToHub, isPending: isLoadingUsersToHub } = useQuery(
        supabase.from("users_to_hubs").select("*").eq("hub_id", hub.id),
    )
    const isMember = usersToHub?.some(
        (userToHub) => userToHub.user_id === user?.id,
    )
    const cardColors = [
        "from-blue-500/20 to-purple-600/20",
        "from-green-500/20 to-teal-600/20",
        "from-yellow-500/20 to-red-600/20",
        "from-pink-500/20 to-rose-600/20",
    ]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <div
                className={`rounded-lg bg-gradient-to-br ${cardColors[index % cardColors.length]} p-0.5`}
            >
                <Card className="overflow-hidden bg-card">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold">
                                {hub.name}
                            </CardTitle>
                            <div className="flex items-center gap-2">
                                {isMember && !isOwnerOfHub && (
                                    <Badge
                                        variant="outline"
                                        className="flex items-center gap-1 border-green-500/20 text-green-500"
                                    >
                                        <Users className="h-3 w-3" />
                                        <span className="text-xs">Member</span>
                                    </Badge>
                                )}
                                {isOwnerOfHub && (
                                    <Badge
                                        variant="secondary"
                                        className="flex items-center gap-1"
                                    >
                                        <Crown className="h-3 w-3 text-yellow-500" />
                                        <span className="text-xs">Owner</span>
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <p className="mb-4 text-sm text-muted-foreground">
                            {hub.description || "No description available."}
                        </p>
                        <div className="flex flex-wrap gap-2">
                            <span className="rounded-full bg-secondary px-3 py-1 text-xs text-secondary-foreground">
                                {hub.typeOfHub || "Not specified"}
                            </span>
                            {usersToHub && (
                                <span className="rounded-full bg-secondary/50 px-3 py-1 text-xs text-secondary-foreground">
                                    <Users className="mr-1 inline-block h-3 w-3" />
                                    {usersToHub.length}{" "}
                                    {usersToHub.length === 1
                                        ? "member"
                                        : "members"}
                                </span>
                            )}
                        </div>
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {canEdit && (
                            <Button
                                onClick={() => openModal(hub)}
                                variant="secondary"
                                size="sm"
                            >
                                <Edit2Icon className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        )}
                        <Button asChild variant="secondary" size="sm">
                            <Link href={`/hubs/${hub.id}/invites`}>
                                <Users className="mr-2 h-4 w-4" />
                                View Members
                            </Link>
                        </Button>
                        <Button asChild variant="secondary" size="sm">
                            <Link href={`${basePath}/${hub.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    )
}

const SkeletonLoader = () => {
    return (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
                <Card key={i} className="overflow-hidden">
                    <CardHeader>
                        <Skeleton className="h-6 w-2/3" />
                    </CardHeader>
                    <CardContent>
                        <Skeleton className="mb-4 h-16" />
                        <Skeleton className="h-4 w-1/3" />
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                        <Skeleton className="h-9 w-20" />
                    </CardFooter>
                </Card>
            ))}
        </div>
    )
}
