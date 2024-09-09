import { notFound } from "next/navigation";
import { Suspense } from "react";

import OptimisticCommunityEvent from "@/app/(app)/community-events/[communityEventId]/OptimisticCommunityEvent";
import CommunityEventInviteList from "@/components/communityEventInvites/CommunityEventInviteList";
import { getCommunities } from "@/lib/api/communities/queries";
import { getCommunityEventByIdWithCommunityEventInvites } from "@/lib/api/communityEvents/queries";

import Loading from "@/app/loading";
import { BackButton } from "@/components/shared/BackButton";


export const revalidate = 0;

export default async function CommunityEventPage({
  params,
}: {
  params: { communityEventId: string };
}) {

  return (
    <main className="overflow-auto">
      <CommunityEvent id={params.communityEventId} />
    </main>
  );
}

const CommunityEvent = async ({ id }: { id: string }) => {

  const { communityEvent, communityEventInvites } = await getCommunityEventByIdWithCommunityEventInvites(id);
  const { communities } = await getCommunities();

  if (!communityEvent) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="community-events" />
        <OptimisticCommunityEvent communityEvent={communityEvent} communities={communities} />
      </div>
      <div className="relative mt-8 mx-4">
        <h3 className="text-xl font-medium mb-4">{communityEvent.title}&apos;s Community Event Invites</h3>
        <CommunityEventInviteList
          communityEvents={[]}
          communityEventId={communityEvent.id}
          communityEventInvites={communityEventInvites}
        />
      </div>
    </Suspense>
  );
};
