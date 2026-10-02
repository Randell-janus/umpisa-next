import { leaveTypeLabels } from "@/lib/format";
import type { LeaveBalance } from "@/lib/types";

export default function BalanceCard({ balance }: { balance: LeaveBalance }) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-5">
      <p className="text-sm font-medium text-gray-500">
        {leaveTypeLabels[balance.leaveType]} leave
      </p>
      <p className="mt-2 text-3xl font-semibold">{balance.remainingDays}</p>
      <p className="mt-1 text-sm text-gray-500">
        days left of {balance.allocatedDays} ({balance.usedDays} used)
      </p>
    </div>
  );
}
