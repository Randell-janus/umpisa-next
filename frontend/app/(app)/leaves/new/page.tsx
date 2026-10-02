import Card from "@/components/Card";
import { getClient } from "@/lib/graphql";
import { todayISO } from "@/lib/format";
import { MY_BALANCES_QUERY } from "@/lib/queries";
import { requireRole } from "@/lib/session";
import type { LeaveBalance } from "@/lib/types";

import LeaveForm from "./LeaveForm";

export default async function NewLeavePage() {
  await requireRole("EMPLOYEE");
  const client = await getClient();
  const { myBalances } = await client.request<{ myBalances: LeaveBalance[] }>(MY_BALANCES_QUERY);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-xl font-semibold">File leave</h1>
      <Card>
        <LeaveForm balances={myBalances} today={todayISO()} />
      </Card>
    </div>
  );
}
