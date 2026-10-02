"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getClient, getErrorMessage } from "@/lib/graphql";
import { FILE_LEAVE_MUTATION } from "@/lib/queries";

export type LeaveFormValues = {
  leaveType: string;
  startDate: string;
  endDate: string;
  reason: string;
};

export type FileLeaveState = { error: string; values: LeaveFormValues } | undefined;

export async function fileLeave(
  _state: FileLeaveState,
  formData: FormData,
): Promise<FileLeaveState> {
  const values: LeaveFormValues = {
    leaveType: String(formData.get("leaveType") ?? ""),
    startDate: String(formData.get("startDate") ?? ""),
    endDate: String(formData.get("endDate") ?? ""),
    reason: String(formData.get("reason") ?? ""),
  };

  try {
    const client = await getClient();
    await client.request(FILE_LEAVE_MUTATION, values);
  } catch (error) {
    return { error: getErrorMessage(error), values };
  }

  revalidatePath("/leaves");
  redirect("/leaves");
}
