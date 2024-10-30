"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    MessageSquarePlus,
    MessageCircle,
    ChevronRight,
    ThumbsUp,
    Eye,
} from "lucide-react"
import { format } from "date-fns"

import {
    CompleteCommunityPost,
    type CommunityPost,
} from "@/lib/db/schema/communityPosts"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Modal from "@/components/shared/Modal"
import CommunityPostForm from "./CommunityPostForm"
import { useOptimisticCommunityPosts } from "@/app/(app)/community-posts/useOptimisticCommunityPosts"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Community } from "@/lib/db/schema"

type TOpenModal = (post?: CommunityPost) => void

export function CommunityPostsList({
    posts,
    communityId,
    communities,
}: {
    posts: CompleteCommunityPost[]
    communityId: string
    communities: Community[]
}) {
    const { optimisticCommunityPosts, addOptimisticCommunityPost } =
        useOptimisticCommunityPosts(posts, communities)
    const [open, setOpen] = useState(false)
    const [activePost, setActivePost] = useState<CommunityPost | null>(null)

    const openModal = (post?: CommunityPost) => {
        setOpen(true)
        post ? setActivePost(post) : setActivePost(null)
    }
    const closeModal = () => setOpen(false)

    return (
        <div className="space-y-8">
            <Modal
                open={open}
                setOpen={setOpen}
                title={activePost ? "Edit Post" : "Create Post"}
            >
                <CommunityPostForm
                    communities={communities}
                    communityPost={activePost}
                    communityId={communityId}
                    closeModal={closeModal}
                    addOptimistic={addOptimisticCommunityPost}
                />
            </Modal>

            <div className="flex items-center justify-between">
                <div className="space-y-1">
                    <h2 className="text-2xl font-semibold tracking-tight">
                        Community Posts
                    </h2>
                    <p className="text-sm text-muted-foreground">
                        Join the discussion with other community members
                    </p>
                </div>
                <Button onClick={() => openModal()} className="gap-2">
                    <MessageSquarePlus className="h-4 w-4" />
                    New Post
                </Button>
            </div>

            <AnimatePresence mode="wait">
                {optimisticCommunityPosts.length === 0 ? (
                    <EmptyState openModal={openModal} />
                ) : (
                    <motion.div
                        className="space-y-4"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    >
                        {optimisticCommunityPosts.map((post, index) => (
                            <PostCard
                                key={post.id}
                                post={post}
                                index={index}
                                openModal={openModal}
                                communityId={communityId}
                            />
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}

function PostCard({
    post,
    index,
    openModal,
    communityId,
}: {
    post: CommunityPost
    index: number
    openModal: (post: CommunityPost) => void
    communityId: string
}) {
    const optimistic = post.id === "optimistic"
    const deleting = post.id === "delete"
    const mutating = optimistic || deleting

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
        >
            <Card
                className={cn(
                    "group relative overflow-hidden transition-all hover:shadow-md",
                    mutating ? "animate-pulse opacity-50" : "",
                    deleting ? "bg-destructive/10" : "bg-card",
                )}
            >
                <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                        <div className="flex items-start gap-4">
                            <Avatar>
                                <AvatarImage
                                    src={`https://avatar.vercel.sh/${post.userId}`}
                                />
                                <AvatarFallback>UN</AvatarFallback>
                            </Avatar>
                            <div className="space-y-1">
                                <h3 className="text-xl font-semibold">
                                    {post.title}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                    Posted by {post.userId} •{" "}
                                    {format(
                                        new Date(post.createdAt),
                                        "MMM d, yyyy",
                                    )}
                                </p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openModal(post)}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                    <p className="mt-4 line-clamp-3 text-muted-foreground">
                        {post.content}
                    </p>
                </CardContent>
                <CardFooter className="border-t bg-muted/50 p-4">
                    <div className="flex w-full items-center justify-between">
                        <div className="flex gap-4">
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <MessageCircle className="h-3 w-3" />
                                12 replies
                            </Badge>
                            <Badge
                                variant="secondary"
                                className="flex items-center gap-1"
                            >
                                <ThumbsUp className="h-3 w-3" />
                                24 likes
                            </Badge>
                        </div>
                        <Button variant="ghost" size="sm" asChild>
                            <Link
                                href={`/communities/${communityId}/community-posts/${post.id}`}
                            >
                                <Eye className="mr-2 h-4 w-4" />
                                View Discussion
                            </Link>
                        </Button>
                    </div>
                </CardFooter>
            </Card>
        </motion.div>
    )
}

function EmptyState({ openModal }: { openModal: () => void }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center rounded-lg border border-dashed bg-muted/50 p-8 text-center"
        >
            <MessageCircle className="h-12 w-12 text-muted-foreground/50" />
            <h3 className="mt-4 text-lg font-semibold">No Posts Yet</h3>
            <p className="mt-2 text-sm text-muted-foreground">
                Start the conversation by creating the first post.
            </p>
            <Button onClick={openModal} className="mt-4" variant="outline">
                <MessageSquarePlus className="mr-2 h-4 w-4" />
                Create Post
            </Button>
        </motion.div>
    )
}
