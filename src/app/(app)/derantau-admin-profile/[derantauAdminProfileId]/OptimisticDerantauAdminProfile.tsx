"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/derantau-admin-profile/useOptimisticDerantauAdminProfile";
import { type DerantauAdminProfile } from "@/lib/db/schema/derantauAdminProfile";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import DerantauAdminProfileForm from "@/components/derantauAdminProfile/DerantauAdminProfileForm";
import { type Region, type RegionId } from "@/lib/db/schema/regions";

export default function OptimisticDerantauAdminProfile({ 
  derantauAdminProfile,
  regions,
  regionId 
}: { 
  derantauAdminProfile: DerantauAdminProfile; 
  
  regions: Region[];
  regionId?: RegionId
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: DerantauAdminProfile) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticDerantauAdminProfile, setOptimisticDerantauAdminProfile] = useOptimistic(derantauAdminProfile);
  const updateDerantauAdminProfile: TAddOptimistic = (input) =>
    setOptimisticDerantauAdminProfile({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <DerantauAdminProfileForm
          derantauAdminProfile={optimisticDerantauAdminProfile}
          regions={regions}
        regionId={regionId}
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateDerantauAdminProfile}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticDerantauAdminProfile.department}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticDerantauAdminProfile.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticDerantauAdminProfile, null, 2)}
      </pre>
    </div>
  );
}
