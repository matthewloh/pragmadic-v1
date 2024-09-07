import { z } from "zod";

import { useState, useTransition } from "react";
import { useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useValidatedForm } from "@/lib/hooks/useValidatedForm";

import { type Action, cn } from "@/lib/utils";
import { type TAddOptimistic } from "@/app/(app)/nomad-profile/useOptimisticNomadProfile";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useBackPath } from "@/components/shared/BackButton";




import { type NomadProfile, insertNomadProfileParams } from "@/lib/db/schema/nomadProfile";
import {
  createNomadProfileAction,
  deleteNomadProfileAction,
  updateNomadProfileAction,
} from "@/lib/actions/nomadProfile";


const NomadProfileForm = ({
  
  nomadProfile,
  openModal,
  closeModal,
  addOptimistic,
  postSuccess,
}: {
  nomadProfile?: NomadProfile | null;
  
  openModal?: (nomadProfile?: NomadProfile) => void;
  closeModal?: () => void;
  addOptimistic?: TAddOptimistic;
  postSuccess?: () => void;
}) => {
  const { errors, hasErrors, setErrors, handleChange } =
    useValidatedForm<NomadProfile>(insertNomadProfileParams);
  const editing = !!nomadProfile?.id;
  
  const [isDeleting, setIsDeleting] = useState(false);
  const [pending, startMutation] = useTransition();

  const router = useRouter();
  const backpath = useBackPath("nomad-profile");


  const onSuccess = (
    action: Action,
    data?: { error: string; values: NomadProfile },
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
      toast.success(`NomadProfile ${action}d!`);
      if (action === "delete") router.push(backpath);
    }
  };

  const handleSubmit = async (data: FormData) => {
    setErrors(null);

    const payload = Object.fromEntries(data.entries());
    const nomadProfileParsed = await insertNomadProfileParams.safeParseAsync({  ...payload });
    if (!nomadProfileParsed.success) {
      setErrors(nomadProfileParsed?.error.flatten().fieldErrors);
      return;
    }

    closeModal && closeModal();
    const values = nomadProfileParsed.data;
    const pendingNomadProfile: NomadProfile = {
      updatedAt: nomadProfile?.updatedAt ?? new Date(),
      createdAt: nomadProfile?.createdAt ?? new Date(),
      id: nomadProfile?.id ?? "",
      userId: nomadProfile?.userId ?? "",
      ...values,
    };
    try {
      startMutation(async () => {
        addOptimistic && addOptimistic({
          data: pendingNomadProfile,
          action: editing ? "update" : "create",
        });

        const error = editing
          ? await updateNomadProfileAction({ ...values, id: nomadProfile.id })
          : await createNomadProfileAction(values);

        const errorFormatted = {
          error: error ?? "Error",
          values: pendingNomadProfile 
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
            errors?.bio ? "text-destructive" : "",
          )}
        >
          Bio
        </Label>
        <Input
          type="text"
          name="bio"
          className={cn(errors?.bio ? "ring ring-destructive" : "")}
          defaultValue={nomadProfile?.bio ?? ""}
        />
        {errors?.bio ? (
          <p className="text-xs text-destructive mt-2">{errors.bio[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.skills ? "text-destructive" : "",
          )}
        >
          Skills
        </Label>
        <Input
          type="text"
          name="skills"
          className={cn(errors?.skills ? "ring ring-destructive" : "")}
          defaultValue={nomadProfile?.skills ?? ""}
        />
        {errors?.skills ? (
          <p className="text-xs text-destructive mt-2">{errors.skills[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.interests ? "text-destructive" : "",
          )}
        >
          Interests
        </Label>
        <Input
          type="text"
          name="interests"
          className={cn(errors?.interests ? "ring ring-destructive" : "")}
          defaultValue={nomadProfile?.interests ?? ""}
        />
        {errors?.interests ? (
          <p className="text-xs text-destructive mt-2">{errors.interests[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.currentLocation ? "text-destructive" : "",
          )}
        >
          Current Location
        </Label>
        <Input
          type="text"
          name="currentLocation"
          className={cn(errors?.currentLocation ? "ring ring-destructive" : "")}
          defaultValue={nomadProfile?.currentLocation ?? ""}
        />
        {errors?.currentLocation ? (
          <p className="text-xs text-destructive mt-2">{errors.currentLocation[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
        <div>
        <Label
          className={cn(
            "mb-2 inline-block",
            errors?.contactInformation ? "text-destructive" : "",
          )}
        >
          Contact Information
        </Label>
        <Input
          type="text"
          name="contactInformation"
          className={cn(errors?.contactInformation ? "ring ring-destructive" : "")}
          defaultValue={nomadProfile?.contactInformation ?? ""}
        />
        {errors?.contactInformation ? (
          <p className="text-xs text-destructive mt-2">{errors.contactInformation[0]}</p>
        ) : (
          <div className="h-6" />
        )}
      </div>
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
              addOptimistic && addOptimistic({ action: "delete", data: nomadProfile });
              const error = await deleteNomadProfileAction(nomadProfile.id);
              setIsDeleting(false);
              const errorFormatted = {
                error: error ?? "Error",
                values: nomadProfile,
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

export default NomadProfileForm;

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
