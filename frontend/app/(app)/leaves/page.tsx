import BalanceCard from "@/components/BalanceCard";
import Card from "@/components/Card";
import LeaveTable from "@/components/LeaveTable";
import LinkButton from "@/components/LinkButton";
import { getClient } from "@/lib/graphql";
import { MY_LEAVES_QUERY } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import type { LeaveBalance, LeaveRequest } from "@/lib/types";

type MyLeavesResponse = {
  myBalances: LeaveBalance[];
  myLeaveRequests: LeaveRequest[];
};

export default async function LeavesPage() {
  await requireRole("EMPLOYEE");
  const client = await getClient();
  const { myBalances, myLeaveRequests } = await client.request<MyLeavesResponse>(MY_LEAVES_QUERY);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">My Leaves</h1>
        <LinkButton href="/leaves/new">File leave</LinkButton>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {myBalances.map((balance) => (
          <BalanceCard key={balance.id} balance={balance} />
        ))}
      </div>
      <Card title="My requests">
        <LeaveTable
          requests={myLeaveRequests}
          detailPath="/leaves"
          emptyMessage="You haven't filed any leave yet."
        />
      </Card>
    </div>
  );
}
