"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Users,
    PlusIcon,
    Globe,
    MessageCircle,
    Calendar,
    Search,
    Eye,
    Edit2Icon,
    Lock,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { format } from "date-fns"

import Modal from "@/components/shared/Modal"
import { type Community, CompleteCommunity } from "@/lib/db/schema/communities"
import { useOptimisticCommunities } from "@/app/(app)/communities/useOptimisticCommunities"
import { Button } from "@/components/ui/button"
import { AuthSession } from "@/lib/auth/types"
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
    CardFooter,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import CommunityForm from "./CommunityForm"
import { cn } from "@/lib/utils"

type TOpenModal = (community?: Community) => void

export default function CommunityList({
    communities,
    session,
}: {
    communities: CompleteCommunity[]
    session: AuthSession["session"]
}) {
    const { optimisticCommunities, addOptimisticCommunity } =
        useOptimisticCommunities(communities)
    const [open, setOpen] = useState(false)
    const [activeCommunity, setActiveCommunity] = useState<Community | null>(
        null,
    )
    const [searchQuery, setSearchQuery] = useState("")

    const filteredCommunities = optimisticCommunities.filter(
        (community) =>
            community.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            community.description
                .toLowerCase()
                .includes(searchQuery.toLowerCase()),
    )

    const openModal = (community?: Community) => {
        setOpen(true)
        community ? setActiveCommunity(community) : setActiveCommunity(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div className="flex h-full flex-1 flex-col gap-8 bg-gradient-to-br from-background to-secondary/20 p-4 md:p-8">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activeCommunity ? "Edit Community" : "Create Community"}
            >
                <CommunityForm
                    community={activeCommunity}
                    addOptimistic={addOptimisticCommunity}
                    openModal={openModal}
                    closeModal={closeModal}
                />
            </Modal>

            {/* Header Section */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-foreground md:text-4xl">
                        Communities
                    </h1>
                    <p className="mt-1 text-sm text-muted-foreground">
                        Join and participate in digital nomad communities
                    </p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <PlusIcon className="h-4 w-4" />
                    Create Community
                </Button>
            </div>

            {/* Search Section */}
            <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                    placeholder="Search communities..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10"
                />
            </div>

            {/* Communities Grid */}
            <AnimatePresence mode="wait">
                {filteredCommunities.length === 0 ? (
                    <EmptyState openModal={openModal} />
                ) : (
                    <motion.div
                        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {filteredCommunities.map((community, index) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                index={index}
                                openModal={openModal}
                                session={session}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function CommunityCard({
    community,
    index,
    openModal,
    session,
}: {
    community: Community
    index: number
    openModal: TOpenModal
    session: AuthSession["session"]
}) {
    const cardColors = [
        "from-violet-500/30 to-purple-500/30 dark:from-violet-500/20 dark:to-purple-500/20",
        "from-emerald-500/30 to-teal-500/30 dark:from-emerald-500/20 dark:to-teal-500/20",
        "from-orange-500/30 to-amber-500/30 dark:from-orange-500/20 dark:to-amber-500/20",
        "from-blue-500/30 to-cyan-500/30 dark:from-blue-500/20 dark:to-cyan-500/20",
    ]

    const canEdit = session?.user?.id === community.userId

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="h-full"
        >
            <div
                className={cn(
                    "h-full rounded-lg bg-gradient-to-br p-0.5 transition-all hover:shadow-lg",
                    cardColors[index % cardColors.length],
                )}
            >
                <Card className="flex h-full flex-col justify-between overflow-hidden bg-card">
                    <div>
                        <CardHeader className="relative pb-0">
                            <div className="absolute inset-0">
                                <Image
                                    src={`/placeholder.svg`}
                                    alt={community.name}
                                    width={800}
                                    height={200}
                                    className="h-48 w-full object-cover"
                                    priority
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-background to-background/20" />
                            </div>
                            <div className="relative z-10 flex flex-col gap-4 pt-32">
                                <div className="flex items-start justify-between">
                                    <CardTitle className="text-2xl font-bold text-white drop-shadow-md">
                                        {community.name}
                                    </CardTitle>
                                    <Badge
                                        variant={
                                            community.isPublic
                                                ? "secondary"
                                                : "destructive"
                                        }
                                        className="flex items-center gap-1"
                                    >
                                        {community.isPublic ? (
                                            <Globe className="h-3 w-3" />
                                        ) : (
                                            <Lock className="h-3 w-3" />
                                        )}
                                        {community.isPublic
                                            ? "Public"
                                            : "Private"}
                                    </Badge>
                                </div>
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <Users className="h-3 w-3" />
                                    <span>Created by {community.userId}</span>
                                    <span>•</span>
                                    <span>
                                        {format(
                                            new Date(community.createdAt),
                                            "MMM d, yyyy",
                                        )}
                                    </span>
                                </div>
                            </div>
                        </CardHeader>

                        <CardContent className="space-y-4 pt-4">
                            <p className="text-sm text-muted-foreground">
                                {community.description}
                            </p>
                            {community.rules && (
                                <div className="rounded-lg bg-muted p-4">
                                    <h4 className="mb-2 font-semibold">
                                        Community Rules
                                    </h4>
                                    <p className="text-sm text-muted-foreground">
                                        {community.rules}
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </div>

                    <CardFooter className="flex flex-col gap-4 pt-6">
                        <div className="flex w-full items-center justify-between">
                            <div className="flex gap-4">
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    <MessageCircle className="h-3 w-3" />
                                    24 posts
                                </Badge>
                                <Badge
                                    variant="secondary"
                                    className="flex items-center gap-1"
                                >
                                    <Calendar className="h-3 w-3" />
                                    12 events
                                </Badge>
                            </div>
                            {canEdit && (
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => openModal(community)}
                                >
                                    <Edit2Icon className="h-4 w-4" />
                                </Button>
                            )}
                        </div>
                        <div className="flex w-full gap-2">
                            <Button
                                variant="default"
                                className="flex-1"
                                asChild
                            >
                                <Link
                                    href={`/communities/${community.id}/community-posts`}
                                >
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    View Posts
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                asChild
                            >
                                <Link
                                    href={`/communities/${community.id}/community-events`}
                                >
                                    <Calendar className="mr-2 h-4 w-4" />
                                    Events
                                </Link>
                            </Button>
                            <Button
                                variant="outline"
                                className="flex-1"
                                asChild
                            >
                                <Link
                                    href={`/communities/${community.id}/members`}
                                >
                                    <Users className="mr-2 h-4 w-4" />
                                    Members
                                </Link>
                            </Button>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    )
}

function EmptyState({ openModal }: { openModal: TOpenModal }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-card/50 p-8 text-center"
        >
            <Users className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Communities Found</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Get started by creating a new community or try a different
                search.
            </p>
            <Button
                onClick={() => openModal()}
                className="mt-4"
                variant="outline"
            >
                <PlusIcon className="mr-2 h-4 w-4" />
                Create Community
            </Button>
        </motion.div>
    )
}
