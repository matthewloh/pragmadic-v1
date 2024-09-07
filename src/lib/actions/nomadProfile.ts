"use server";

import { revalidatePath } from "next/cache";
import {
  createNomadProfile,
  deleteNomadProfile,
  updateNomadProfile,
} from "@/lib/api/nomadProfile/mutations";
import {
  NomadProfileId,
  NewNomadProfileParams,
  UpdateNomadProfileParams,
  nomadProfileIdSchema,
  insertNomadProfileParams,
  updateNomadProfileParams,
} from "@/lib/db/schema/nomadProfile";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateNomadProfiles = () => revalidatePath("/nomad-profile");

export const createNomadProfileAction = async (input: NewNomadProfileParams) => {
  try {
    const payload = insertNomadProfileParams.parse(input);
    await createNomadProfile(payload);
    revalidateNomadProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateNomadProfileAction = async (input: UpdateNomadProfileParams) => {
  try {
    const payload = updateNomadProfileParams.parse(input);
    await updateNomadProfile(payload.id, payload);
    revalidateNomadProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteNomadProfileAction = async (input: NomadProfileId) => {
  try {
    const payload = nomadProfileIdSchema.parse({ id: input });
    await deleteNomadProfile(payload.id);
    revalidateNomadProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};