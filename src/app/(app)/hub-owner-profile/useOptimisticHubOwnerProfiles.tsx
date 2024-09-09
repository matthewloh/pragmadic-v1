
import { type HubOwnerProfile, type CompleteHubOwnerProfile } from "@/lib/db/schema/hubOwnerProfiles";
import { OptimisticAction } from "@/lib/utils";
import { useOptimistic } from "react";

export type TAddOptimistic = (action: OptimisticAction<HubOwnerProfile>) => void;

export const useOptimisticHubOwnerProfiles = (
  hubOwnerProfiles: CompleteHubOwnerProfile[],
  
) => {
  const [optimisticHubOwnerProfiles, addOptimisticHubOwnerProfile] = useOptimistic(
    hubOwnerProfiles,
    (
      currentState: CompleteHubOwnerProfile[],
      action: OptimisticAction<HubOwnerProfile>,
    ): CompleteHubOwnerProfile[] => {
      const { data } = action;

      

      const optimisticHubOwnerProfile = {
        ...data,
        
        id: "optimistic",
      };

      switch (action.action) {
        case "create":
          return currentState.length === 0
            ? [optimisticHubOwnerProfile]
            : [...currentState, optimisticHubOwnerProfile];
        case "update":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, ...optimisticHubOwnerProfile } : item,
          );
        case "delete":
          return currentState.map((item) =>
            item.id === data.id ? { ...item, id: "delete" } : item,
          );
        default:
          return currentState;
      }
    },
  );

  return { addOptimisticHubOwnerProfile, optimisticHubOwnerProfiles };
};
