import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/derantau-admin-profile/useOptimisticDerantauAdminProfile";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";


import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { type DerantauAdminProfile, insertDerantauAdminProfileParams } from "@/lib/db/schema/derantauAdminProfile";
import {
  createDerantauAdminProfileAction,
  deleteDerantauAdminProfileAction,
  updateDerantauAdminProfileAction,
} from "@/lib/actions/derantauAdminProfile";
import { type Region, type RegionId } from "@/lib/db/schema/regions";

const DerantauAdminProfileForm = ({
  regions,
  regionId,
  derantauAdminProfile,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  derantauAdminProfile?: DerantauAdminProfile | null;
  regions: Region[];
  regionId?: RegionId
  openModal?: (derantauAdminProfile?: DerantauAdminProfile) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<DerantauAdminProfile>(insertDerantauAdminProfileParams);
  const editing = !!derantauAdminProfile?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("derantau-admin-profile");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: DerantauAdminProfile },
  ) => {
    const failed = Boolean(data?.error);
    if (failed) {
      openModal && openModal(data?.values);
      toast.error(`Failed to ${action}`, {
        description: data?.error ?? "Error",
      });
    } else {
      router.refresh();
      postSuccess && postSuccess();
      toast.success(`DerantauAdminProfile ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const derantauAdminProfileParsed = await insertDerantauAdminProfileParams.safeParseAsync({ regionId, ...payload });
    if (!derantauAdminProfileParsed.success) {
      setErrors(derantauAdminProfileParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = derantauAdminProfileParsed.data;
    const pendingDerantauAdminProfile: DerantauAdminProfile = {
      updatedAt: derantauAdminProfile?.updatedAt ?? new Date(),
      createdAt: derantauAdminProfile?.createdAt ?? new Date(),
      id: derantauAdminProfile?.id ?? "",
      userId: derantauAdminProfile?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingDerantauAdminProfile,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateDerantauAdminProfileAction({ ...values, id: derantauAdminProfile.id })
          : await createDerantauAdminProfileAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingDerantauAdminProfile 
        };
        onSuccess(
          editing ? "update" : "create",
          error ? errorFormatted : undefined,
        );
      });
    } catch (e) {
      if (e instanceof z.ZodError) {
        setErrors(e.flatten().fieldErrors);
      }
    }
  };

  return (
    <form action={handleSubmit} onChange={handleChange} className={"space-y-8"}>
      {/* Schema fields start */}
              <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.department ? "text-destructive" : "",
          )}
        >
          Department
        </Label>
        <Input
          type="text"
          name="department"
          className={cn(errors?.department ? "ring ring-destructive" : "")}
          defaultValue={derantauAdminProfile?.department ?? ""}
        />
        {errors?.department ? (
          <p className="text-xs text-destructive mt-2">{errors.department[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.position ? "text-destructive" : "",
          )}
        >
          Position
        </Label>
        <Input
          type="text"
          name="position"
          className={cn(errors?.position ? "ring ring-destructive" : "")}
          defaultValue={derantauAdminProfile?.position ?? ""}
        />
        {errors?.position ? (
          <p className="text-xs text-destructive mt-2">{errors.position[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.adminLevel ? "text-destructive" : "",
          )}
        >
          Admin Level
        </Label>
        <Input
          type="text"
          name="adminLevel"
          className={cn(errors?.adminLevel ? "ring ring-destructive" : "")}
          defaultValue={derantauAdminProfile?.adminLevel ?? ""}
        />
        {errors?.adminLevel ? (
          <p className="text-xs text-destructive mt-2">{errors.adminLevel[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>

      {regionId ? null : <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.regionId ? "text-destructive" : "",
          )}
        >
          Region
        </Label>
        <Select defaultValue={derantauAdminProfile?.regionId} name="regionId">
          <SelectTrigger
            className={cn(errors?.regionId ? "ring ring-destructive" : "")}
          >
            <SelectValue placeholder="Select a region" />
          </SelectTrigger>
          <SelectContent>
          {regions?.map((region) => (
            <SelectItem key={region.id} value={region.id.toString()}>
              {region.id}{/* TODO: Replace with a field from the region model */}
            </SelectItem>
           ))}
          </SelectContent>
        </Select>
        {errors?.regionId ? (
          <p className="text-xs text-destructive mt-2">{errors.regionId[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div> }
      {/* Schema fields end */}

      {/* Save Button */}
      <SaveButton errors={hasErrors} editing={editing} />

      {/* Delete Button */}
      {editing ? (
        <Button
          type="button"
          disabled={isDeleting || pending || hasErrors}
          variant={"destructive"}
          onClick={() => {
            setIsDeleting(true);
            closeModal && closeModal();
            startMutation(async () => {
              addOptimistic && addOptimistic({ action: "delete", data: derantauAdminProfile });
              const error = await deleteDerantauAdminProfileAction(derantauAdminProfile.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: derantauAdminProfile,
              };

              onSuccess("delete", error ? errorFormatted : undefined);
            });
          }}
        >
          Delet{isDeleting ? "ing..." : "e"}
        </Button>
      ) : null}
    </form>
  );
};

export default DerantauAdminProfileForm;

const SaveButton = ({
  editing,
  errors,
}: {
  editing: Boolean;
  errors: boolean;
}) => {
  const { pending } = useFormStatus();
  const isCreating = pending && editing === false;
  const isUpdating = pending && editing === true;
  return (
    <Button
      type="submit"
      className="mr-2"
      disabled={isCreating || isUpdating || errors}
      aria-disabled={isCreating || isUpdating || errors}
    >
      {editing
        ? `Sav${isUpdating ? "ing..." : "e"}`
        : `Creat${isCreating ? "ing..." : "e"}`}
    </Button>
  );
};
