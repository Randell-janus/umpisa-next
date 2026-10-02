import Card from "@/components/Card";
import LeaveTable from "@/components/LeaveTable";
import Tabs from "@/components/Tabs";
import { statusLabels } from "@/lib/format";
import { getClient } from "@/lib/graphql";
import { TEAM_LEAVE_REQUESTS_QUERY } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import type { LeaveRequest, LeaveStatus } from "@/lib/types";

const statuses: LeaveStatus[] = ["PENDING", "APPROVED", "REJECTED"];

const emptyMessages: Record<LeaveStatus, string> = {
  PENDING: "No pending requests from your team.",
  APPROVED: "No approved requests yet.",
  REJECTED: "No rejected requests yet.",
};

export default async function ApprovalsPage({ searchParams }: PageProps<"/approvals">) {
  await requireRole("MANAGER");
  const { status } = await searchParams;
  const current = statuses.find((value) => value.toLowerCase() === status) ?? "PENDING";

  const client = await getClient();
  const { teamLeaveRequests } = await client.request<{ teamLeaveRequests: LeaveRequest[] }>(
    TEAM_LEAVE_REQUESTS_QUERY,
    { status: current },
  );

  const tabs = statuses.map((value) => ({
    href: `/approvals?status=${value.toLowerCase()}`,
    label: statusLabels[value],
    active: value === current,
  }));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold">Approvals</h1>
      <Tabs tabs={tabs} />
      <Card>
        <LeaveTable
          requests={teamLeaveRequests}
          detailPath="/approvals"
          emptyMessage={emptyMessages[current]}
          showEmployee
        />
      </Card>
    </div>
  );
}
