"use client"

import { useOptimistic, useState } from "react"
import { TAddOptimistic } from "@/app/(app)/community-posts/useOptimisticCommunityPosts"
import { type CommunityPost } from "@/lib/db/schema/communityPosts"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import Modal from "@/components/shared/Modal"
import CommunityPostForm from "@/components/communityPosts/CommunityPostForm"
import { type Community, type CommunityId } from "@/lib/db/schema/communities"

export default function OptimisticCommunityPost({
    communityPost,
    communities,
    communityId,
}: {
    communityPost: CommunityPost

    communities: Community[]
    communityId?: CommunityId
}) {
    const [open, setOpen] = useState(false)
    const openModal = (_?: CommunityPost) => {
        setOpen(true)
    }
    const closeModal = () => setOpen(false)
    const [optimisticCommunityPost, setOptimisticCommunityPost] =
        useOptimistic(communityPost)
    const updateCommunityPost: TAddOptimistic = (input) =>
        setOptimisticCommunityPost({ ...input.data })

    return (
        <div className="m-4">
            <Modal open={open} setOpen={setOpen}>
                <CommunityPostForm
                    communityPost={optimisticCommunityPost}
                    communities={communities}
                    communityId={communityId}
                    closeModal={closeModal}
                    openModal={openModal}
                    addOptimistic={updateCommunityPost}
                />
            </Modal>
            <div className="mb-4 flex items-end justify-between">
                <h1 className="text-2xl font-semibold">
                    {optimisticCommunityPost.title}
                </h1>
                <Button className="" onClick={() => setOpen(true)}>
                    Edit
                </Button>
            </div>
            <pre
                className={cn(
                    "text-wrap break-all rounded-lg bg-secondary p-4",
                    optimisticCommunityPost.id === "optimistic"
                        ? "animate-pulse"
                        : "",
                )}
            >
                {JSON.stringify(optimisticCommunityPost, null, 2)}
            </pre>
        </div>
    )
}
