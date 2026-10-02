"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { getClient, getErrorMessage } from "@/lib/graphql";
import { APPROVE_LEAVE_MUTATION, REJECT_LEAVE_MUTATION } from "@/lib/queries";

export type ReviewState = { error: string; note: string } | undefined;

export async function reviewLeave(_state: ReviewState, formData: FormData): Promise<ReviewState> {
  const id = String(formData.get("id") ?? "");
  const decision = formData.get("decision");
  const note = String(formData.get("note") ?? "");
  const mutation = decision === "approve" ? APPROVE_LEAVE_MUTATION : REJECT_LEAVE_MUTATION;

  try {
    const client = await getClient();
    await client.request(mutation, { id, note });
  } catch (error) {
    return { error: getErrorMessage(error), note };
  }

  revalidatePath("/approvals");
  redirect("/approvals");
}
