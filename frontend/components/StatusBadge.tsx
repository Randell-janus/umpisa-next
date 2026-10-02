import { statusLabels } from "@/lib/format";
import type { LeaveStatus } from "@/lib/types";

const statusClasses: Record<LeaveStatus, string> = {
  PENDING: "border border-gray-300 bg-white text-gray-700",
  APPROVED: "border border-gray-800 bg-gray-800 text-white",
  REJECTED: "border border-gray-300 bg-gray-100 text-gray-500",
};

const baseClasses = "inline-block rounded-full px-2.5 py-0.5 text-xs font-medium";

export default function StatusBadge({ status }: { status: LeaveStatus }) {
  return (
    <span className={`${baseClasses} ${statusClasses[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
