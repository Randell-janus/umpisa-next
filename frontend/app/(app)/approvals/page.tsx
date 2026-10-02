import Card from "@/components/Card";
import LeaveTable from "@/components/LeaveTable";
import { getClient } from "@/lib/graphql";
import { PENDING_APPROVALS_QUERY } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import type { LeaveRequest } from "@/lib/types";

export default async function ApprovalsPage() {
  await requireRole("MANAGER");
  const client = await getClient();
  const { pendingApprovals } = await client.request<{ pendingApprovals: LeaveRequest[] }>(
    PENDING_APPROVALS_QUERY,
  );

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold">Approvals</h1>
      <Card title="Pending requests">
        <LeaveTable
          requests={pendingApprovals}
          detailPath="/approvals"
          emptyMessage="No pending requests from your team."
          showEmployee
        />
      </Card>
    </div>
  );
}
