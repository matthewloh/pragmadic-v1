import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getHubOwnerProfileById } from "@/lib/api/hubOwnerProfiles/queries";
import OptimisticHubOwnerProfile from "./OptimisticHubOwnerProfile";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function HubOwnerProfilePage({
  params,
}: {
  params: { hubOwnerProfileId: string };
}) {

  return (
    <main className="overflow-auto">
      <HubOwnerProfile id={params.hubOwnerProfileId} />
    </main>
  );
}

const HubOwnerProfile = async ({ id }: { id: string }) => {
  await checkAuth();

  const { hubOwnerProfile } = await getHubOwnerProfileById(id);
  

  if (!hubOwnerProfile) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="hub-owner-profiles" />
        <OptimisticHubOwnerProfile hubOwnerProfile={hubOwnerProfile}  />
      </div>
    </Suspense>
  );
};
