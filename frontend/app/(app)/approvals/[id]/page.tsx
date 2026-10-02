import Link from "next/link";
import { notFound } from "next/navigation";

import Card from "@/components/Card";
import LeaveDetails from "@/components/LeaveDetails";
import { formatDays, leaveTypeLabels } from "@/lib/format";
import { getClient } from "@/lib/graphql";
import { LEAVE_REQUEST_QUERY } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import type { LeaveRequest } from "@/lib/types";

import ReviewForm from "./ReviewForm";

export default async function ReviewPage({ params }: PageProps<"/approvals/[id]">) {
  await requireRole("MANAGER");
  const { id } = await params;
  const client = await getClient();
  const { leaveRequest } = await client.request<{ leaveRequest: LeaveRequest | null }>(
    LEAVE_REQUEST_QUERY,
    { id },
  );

  if (!leaveRequest) {
    notFound();
  }

  const remaining = leaveRequest.balance?.remainingDays ?? 0;
  const isPending = leaveRequest.status === "PENDING";

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <Link href="/approvals" className="text-sm text-gray-800 underline">
          Back to approvals
        </Link>
        <h1 className="mt-2 text-xl font-semibold">Review leave request</h1>
      </div>
      <Card>
        <LeaveDetails request={leaveRequest} />
      </Card>
      {isPending && (
        <Card title="Decision">
          <p className="mb-5 text-sm text-gray-600">
            {leaveRequest.employee?.fullName} has {formatDays(remaining)} of{" "}
            {leaveTypeLabels[leaveRequest.leaveType].toLowerCase()} leave left.
            {leaveRequest.days > remaining && " This request is more than the remaining balance."}
          </p>
          <ReviewForm requestId={leaveRequest.id} />
        </Card>
      )}
    </div>
  );
}
