"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { type HubOwnerProfile, CompleteHubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles";
import Modal from "@/components/shared/Modal";

import { useOptimisticHubOwnerProfiles } from "@/app/(app)/hub-owner-profile/useOptimisticHubOwnerProfiles";
import { Button } from "@/components/ui/button";
import HubOwnerProfileForm from "./HubOwnerProfileForm";
import { PlusIcon } from "lucide-react";

type TOpenModal = (hubOwnerProfile?: HubOwnerProfile) => void;

export default function HubOwnerProfileList({
  hubOwnerProfiles,
   
}: {
  hubOwnerProfiles: CompleteHubOwnerProfile[];
   
}) {
  const { optimisticHubOwnerProfiles, addOptimisticHubOwnerProfile } = useOptimisticHubOwnerProfiles(
    hubOwnerProfiles,
     
  );
  const [open, setOpen] = useState(false);
  const [activeHubOwnerProfile, setActiveHubOwnerProfile] = useState<HubOwnerProfile | null>(null);
  const openModal = (hubOwnerProfile?: HubOwnerProfile) => {
    setOpen(true);
    hubOwnerProfile ? setActiveHubOwnerProfile(hubOwnerProfile) : setActiveHubOwnerProfile(null);
  };
  const closeModal = () => setOpen(false);

  return (
    <div>
      <Modal
        open={open}
        setOpen={setOpen}
        title={activeHubOwnerProfile ? "Edit HubOwnerProfile" : "Create Hub Owner Profile"}
      >
        <HubOwnerProfileForm
          hubOwnerProfile={activeHubOwnerProfile}
          addOptimistic={addOptimisticHubOwnerProfile}
          openModal={openModal}
          closeModal={closeModal}
          
        />
      </Modal>
      <div className="absolute right-0 top-0 ">
        <Button onClick={() => openModal()} variant={"outline"}>
          +
        </Button>
      </div>
      {optimisticHubOwnerProfiles.length === 0 ? (
        <EmptyState openModal={openModal} />
      ) : (
        <ul>
          {optimisticHubOwnerProfiles.map((hubOwnerProfile) => (
            <HubOwnerProfile
              hubOwnerProfile={hubOwnerProfile}
              key={hubOwnerProfile.id}
              openModal={openModal}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

const HubOwnerProfile = ({
  hubOwnerProfile,
  openModal,
}: {
  hubOwnerProfile: CompleteHubOwnerProfile;
  openModal: TOpenModal;
}) => {
  const optimistic = hubOwnerProfile.id === "optimistic";
  const deleting = hubOwnerProfile.id === "delete";
  const mutating = optimistic || deleting;
  const pathname = usePathname();
  const basePath = pathname.includes("hub-owner-profiles")
    ? pathname
    : pathname + "/hub-owner-profiles/";


  return (
    <li
      className={cn(
        "flex justify-between my-2",
        mutating ? "opacity-30 animate-pulse" : "",
        deleting ? "text-destructive" : "",
      )}
    >
      <div className="w-full">
        <div>{hubOwnerProfile.companyName}</div>
      </div>
      <Button variant={"link"} asChild>
        <Link href={ basePath + "/" + hubOwnerProfile.id }>
          Edit
        </Link>
      </Button>
    </li>
  );
};

const EmptyState = ({ openModal }: { openModal: TOpenModal }) => {
  return (
    <div className="text-center">
      <h3 className="mt-2 text-sm font-semibold text-secondary-foreground">
        No hub owner profiles
      </h3>
      <p className="mt-1 text-sm text-muted-foreground">
        Get started by creating a new hub owner profile.
      </p>
      <div className="mt-6">
        <Button onClick={() => openModal()}>
          <PlusIcon className="h-4" /> New Hub Owner Profiles </Button>
      </div>
    </div>
  );
};
