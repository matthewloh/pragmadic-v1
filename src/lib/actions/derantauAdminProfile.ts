"use server";

import { revalidatePath } from "next/cache";
import {
  createDerantauAdminProfile,
  deleteDerantauAdminProfile,
  updateDerantauAdminProfile,
} from "@/lib/api/derantauAdminProfile/mutations";
import {
  DerantauAdminProfileId,
  NewDerantauAdminProfileParams,
  UpdateDerantauAdminProfileParams,
  derantauAdminProfileIdSchema,
  insertDerantauAdminProfileParams,
  updateDerantauAdminProfileParams,
} from "@/lib/db/schema/derantauAdminProfile";

const handleErrors = (e: unknown) => {
  const errMsg = "Error, please try again.";
  if (e instanceof Error) return e.message.length > 0 ? e.message : errMsg;
  if (e && typeof e === "object" && "error" in e) {
    const errAsStr = e.error as string;
    return errAsStr.length > 0 ? errAsStr : errMsg;
  }
  return errMsg;
};

const revalidateDerantauAdminProfiles = () => revalidatePath("/derantau-admin-profile");

export const createDerantauAdminProfileAction = async (input: NewDerantauAdminProfileParams) => {
  try {
    const payload = insertDerantauAdminProfileParams.parse(input);
    await createDerantauAdminProfile(payload);
    revalidateDerantauAdminProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const updateDerantauAdminProfileAction = async (input: UpdateDerantauAdminProfileParams) => {
  try {
    const payload = updateDerantauAdminProfileParams.parse(input);
    await updateDerantauAdminProfile(payload.id, payload);
    revalidateDerantauAdminProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};

export const deleteDerantauAdminProfileAction = async (input: DerantauAdminProfileId) => {
  try {
    const payload = derantauAdminProfileIdSchema.parse({ id: input });
    await deleteDerantauAdminProfile(payload.id);
    revalidateDerantauAdminProfiles();
  } catch (e) {
    return handleErrors(e);
  }
};