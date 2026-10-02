"use client";

import { useActionState } from "react";

import Button from "@/components/Button";
import FormError from "@/components/FormError";
import Textarea from "@/components/Textarea";

import { reviewLeave } from "../actions";

export default function ReviewForm({ requestId }: { requestId: string }) {
  const [state, formAction, isPending] = useActionState(reviewLeave, undefined);

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state?.error} />
      <input type="hidden" name="id" value={requestId} />
      <Textarea
        label="Note to employee (optional)"
        name="note"
        rows={3}
        defaultValue={state?.note}
      />
      <div className="flex gap-3">
        <Button type="submit" name="decision" value="approve" disabled={isPending}>
          Approve
        </Button>
        <Button type="submit" name="decision" value="reject" variant="danger" disabled={isPending}>
          Reject
        </Button>
      </div>
    </form>
  );
}
