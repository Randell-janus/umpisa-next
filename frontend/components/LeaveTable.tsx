import Link from "next/link";

import { formatDateRange, formatDays, leaveTypeLabels } from "@/lib/format";
import type { LeaveRequest } from "@/lib/types";

import StatusBadge from "./StatusBadge";

type LeaveTableProps = {
  requests: LeaveRequest[];
  detailPath: string;
  emptyMessage: string;
  showEmployee?: boolean;
};

export default function LeaveTable({
  requests,
  detailPath,
  emptyMessage,
  showEmployee = false,
}: LeaveTableProps) {
  if (requests.length === 0) {
    return <p className="py-6 text-center text-sm text-gray-500">{emptyMessage}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead className="border-b border-gray-200 text-gray-500">
          <tr>
            {showEmployee && <th className="py-2 pr-4 font-medium">Employee</th>}
            <th className="py-2 pr-4 font-medium">Type</th>
            <th className="py-2 pr-4 font-medium">Dates</th>
            <th className="py-2 pr-4 font-medium">Days</th>
            <th className="py-2 pr-4 font-medium">Status</th>
            <th className="py-2" />
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {requests.map((request) => (
            <tr key={request.id}>
              {showEmployee && <td className="py-3 pr-4">{request.employee?.fullName}</td>}
              <td className="py-3 pr-4">{leaveTypeLabels[request.leaveType]}</td>
              <td className="py-3 pr-4">{formatDateRange(request.startDate, request.endDate)}</td>
              <td className="py-3 pr-4">{formatDays(request.days)}</td>
              <td className="py-3 pr-4">
                <StatusBadge status={request.status} />
              </td>
              <td className="py-3 text-right">
                <Link href={`${detailPath}/${request.id}`} className="font-medium text-gray-800 underline">
                  View
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
