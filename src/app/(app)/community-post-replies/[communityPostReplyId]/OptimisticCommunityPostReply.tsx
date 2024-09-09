"use client";

import { TAddOptimistic } from "@/app/(app)/community-post-replies/useOptimisticCommunityPostReplies";
import { type CommunityPostReply } from "@/lib/db/schema/communityPostReplies";
import { cn } from "@/lib/utils";
import { useOptimistic, useState } from "react";

import CommunityPostReplyForm from "@/components/communityPostReplies/CommunityPostReplyForm";
import Modal from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import { type CommunityPost, type CommunityPostId } from "@/lib/db/schema/communityPosts";

export default function OptimisticCommunityPostReply({ 
  communityPostReply,
  communityPosts,
  communityPostId 
}: { 
  communityPostReply: CommunityPostReply; 
  
  communityPosts: CommunityPost[];
  communityPostId?: CommunityPostId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: CommunityPostReply) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticCommunityPostReply, setOptimisticCommunityPostReply] = useOptimistic(communityPostReply);
  const updateCommunityPostReply: TAddOptimistic = (input) =>
    setOptimisticCommunityPostReply({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <CommunityPostReplyForm
          communityPostReply={optimisticCommunityPostReply}
          communityPosts={communityPosts}
        communityPostId={communityPostId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateCommunityPostReply}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticCommunityPostReply.content}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticCommunityPostReply.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticCommunityPostReply, null, 2)}
      </pre>
    </div>
  );
}
