import { Suspense } from "react";
import { notFound } from "next/navigation";

import { getDerantauAdminProfileById } from "@/lib/api/derantauAdminProfile/queries";
import { getRegions } from "@/lib/api/regions/queries";import OptimisticDerantauAdminProfile from "./OptimisticDerantauAdminProfile";
import { checkAuth } from "@/lib/auth/utils";


import { BackButton } from "@/components/shared/BackButton";
import Loading from "@/app/loading";


export const revalidate = 0;

export default async function DerantauAdminProfilePage({
  params,
}: {
  params: { derantauAdminProfileId: string };
}) {

  return (
    <main className="overflow-auto">
      <DerantauAdminProfile id={params.derantauAdminProfileId} />
    </main>
  );
}

const DerantauAdminProfile = async ({ id }: { id: string }) => {
  await checkAuth();

  const { derantauAdminProfile } = await getDerantauAdminProfileById(id);
  const { regions } = await getRegions();

  if (!derantauAdminProfile) notFound();
  return (
    <Suspense fallback={<Loading />}>
      <div className="relative">
        <BackButton currentResource="derantau-admin-profile" />
        <OptimisticDerantauAdminProfile derantauAdminProfile={derantauAdminProfile} regions={regions} />
      </div>
    </Suspense>
  );
};
