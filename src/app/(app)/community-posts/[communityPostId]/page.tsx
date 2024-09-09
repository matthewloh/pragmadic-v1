import { notFound } from "next/navigation";
import { Suspense } from "react";

import OptimisticCommunityPost from "@/app/(app)/community-posts/[communityPostId]/OptimisticCommunityPost";
import CommunityPostReplyList from "@/components/communityPostReplies/CommunityPostReplyList";
import { getCommunities } from "@/lib/api/communities/queries";
import { getCommunityPostByIdWithCommunityPostReplies } from "@/lib/api/communityPosts/queries";

import Loading from "@/app/loading";
import { BackButton } from "@/components/shared/BackButton";


export const revalidate = 0;

export default async function CommunityPostPage({
  params,
}: {
  params: { communityPostId: string };
}) {

  return (
    <main className="overflow-auto">
      <CommunityPost id={params.communityPostId} />
    </main>
  );
}

const CommunityPost = async ({ id }: { id: string }) => {

  const { communityPost, communityPostReplies } = await getCommunityPostByIdWithCommunityPostReplies(id);
  const { communities } = await getCommunities();

  if (!communityPost) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="community-posts" />
        <OptimisticCommunityPost communityPost={communityPost} communities={communities} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{communityPost.title}&apos;s Community Post Replies</h3>
        <CommunityPostReplyList
          communityPosts={[]}
          communityPostId={communityPost.id}
          communityPostReplies={communityPostReplies}
        />
      </div>
    </Suspense>
  );
};
