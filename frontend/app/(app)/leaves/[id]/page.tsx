import Link from "next/link";
import { notFound } from "next/navigation";

import Card from "@/components/Card";
import LeaveDetails from "@/components/LeaveDetails";
import { getClient } from "@/lib/graphql";
import { LEAVE_REQUEST_QUERY } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import type { LeaveRequest } from "@/lib/types";

export default async function LeaveDetailPage({ params }: PageProps<"/leaves/[id]">) {
  await requireRole("EMPLOYEE");
  const { id } = await params;
  const client = await getClient();
  const { leaveRequest } = await client.request<{ leaveRequest: LeaveRequest | null }>(
    LEAVE_REQUEST_QUERY,
    { id },
  );

  if (!leaveRequest) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-2xl">
      <Link href="/leaves" className="text-sm text-gray-800 underline">
        Back to my leaves
      </Link>
      <h1 className="mb-6 mt-2 text-xl font-semibold">Leave request</h1>
      <Card>
        <LeaveDetails request={leaveRequest} />
      </Card>
    </div>
  );
}
