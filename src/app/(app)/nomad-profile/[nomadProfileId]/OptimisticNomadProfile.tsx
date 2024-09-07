"use client";

import { useOptimistic, useState } from "react";
import { TAddOptimistic } from "@/app/(app)/nomad-profile/useOptimisticNomadProfile";
import { type NomadProfile } from "@/lib/db/schema/nomadProfile";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import Modal from "@/components/shared/Modal";
import NomadProfileForm from "@/components/nomadProfile/NomadProfileForm";


export default function OptimisticNomadProfile({ 
  nomadProfile,
   
}: { 
  nomadProfile: NomadProfile; 
  
  
}) {
  const [open, setOpen] = useState(false);
  const openModal = (_?: NomadProfile) => {
    setOpen(true);
  };
  const closeModal = () => setOpen(false);
  const [optimisticNomadProfile, setOptimisticNomadProfile] = useOptimistic(nomadProfile);
  const updateNomadProfile: TAddOptimistic = (input) =>
    setOptimisticNomadProfile({ ...input.data });

  return (
    <div className="m-4">
      <Modal open={open} setOpen={setOpen}>
        <NomadProfileForm
          nomadProfile={optimisticNomadProfile}
          
          closeModal={closeModal}
          openModal={openModal}
          addOptimistic={updateNomadProfile}
        />
      </Modal>
      <div className="flex justify-between items-end mb-4">
        <h1 className="font-semibold text-2xl">{optimisticNomadProfile.bio}</h1>
        <Button className="" onClick={() => setOpen(true)}>
          Edit
        </Button>
      </div>
      <pre
        className={cn(
          "bg-secondary p-4 rounded-lg break-all text-wrap",
          optimisticNomadProfile.id === "optimistic" ? "animate-pulse" : "",
        )}
      >
        {JSON.stringify(optimisticNomadProfile, null, 2)}
      </pre>
    </div>
  );
}
