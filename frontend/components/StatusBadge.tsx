import { statusLabels } from "@/lib/format";
import type { LeaveStatus } from "@/lib/types";

const statusClasses: Record<LeaveStatus, string> = {
  PENDING: "bg-yellow-100 text-yellow-800",
  APPROVED: "bg-green-100 text-green-800",
  REJECTED: "bg-red-100 text-red-800",
};

const baseClasses = "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium";

export default function StatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
