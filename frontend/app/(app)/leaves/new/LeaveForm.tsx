"use client";

import { useActionState, useState } from "react";

import Button from "@/components/Button";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import LinkButton from "@/components/LinkButton";
import Select from "@/components/Select";
import Textarea from "@/components/Textarea";
import { countWeekdays, formatDays, leaveTypeLabels } from "@/lib/format";
import type { LeaveBalance } from "@/lib/types";

import { fileLeave } from "../actions";

type LeaveFormProps = {
  balances: LeaveBalance[];
  today: string;
};

export default function LeaveForm({ balances, today }: LeaveFormProps) {
  const [state, formAction, isPending] = useActionState(fileLeave, undefined);
  const [startDate, setStartDate] = useState(state?.values.startDate ?? "");
  const [endDate, setEndDate] = useState(state?.values.endDate ?? "");

  const options = balances.map((balance) => ({
    value: balance.leaveType,
    label: `${leaveTypeLabels[balance.leaveType]} (${formatDays(balance.remainingDays)} left)`,
  }));
  const days = countWeekdays(startDate, endDate);

  return (
    <form action={formAction} className="space-y-5">
      <FormError message={state?.error} />
      <Select
        label="Leave type"
        name="leaveType"
        options={options}
        defaultValue={state?.values.leaveType}
        required
      />
      <div className="grid gap-5 sm:grid-cols-2">
        <Input
          label="Start date"
          name="startDate"
          type="date"
          min={today}
          defaultValue={state?.values.startDate}
          onChange={(event) => setStartDate(event.target.value)}
          required
        />
        <Input
          label="End date"
          name="endDate"
          type="date"
          min={startDate || today}
          defaultValue={state?.values.endDate}
          onChange={(event) => setEndDate(event.target.value)}
          required
        />
      </div>
      {days > 0 && (
        <p className="text-sm text-gray-600">
          This request is for {formatDays(days)}, weekends excluded.
        </p>
      )}
      <Textarea
        label="Reason"
        name="reason"
        defaultValue={state?.values.reason}
        placeholder="Let your manager know what the leave is for"
        required
      />
      <div className="flex gap-3">
        <Button type="submit" disabled={isPending}>
          {isPending ? "Submitting..." : "Submit request"}
        </Button>
        <LinkButton href="/leaves" variant="secondary">
          Cancel
        </LinkButton>
      </div>
    </form>
  );
}
