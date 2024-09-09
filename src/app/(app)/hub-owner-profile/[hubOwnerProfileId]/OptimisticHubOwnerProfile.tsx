"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles";
import { type HubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import HubOwnerProfileForm from "@/components/hubOwnerProfiles/HubOwnerProfileForm";


export default function OptimisticHubOwnerProfile({ 
  hubOwnerProfile,
   
}: { 
  hubOwnerProfile: HubOwnerProfile; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: HubOwnerProfile) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticHubOwnerProfile, setOptimisticHubOwnerProfile] = useOptimistic(hubOwnerProfile);
  const updateHubOwnerProfile: TAddOptimistic = (input) =>
    setOptimisticHubOwnerProfile({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <HubOwnerProfileForm
          hubOwnerProfile={optimisticHubOwnerProfile}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateHubOwnerProfile}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticHubOwnerProfile.companyName}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticHubOwnerProfile.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticHubOwnerProfile, null, 2)}
      </pre>
    </div>
  );
}
