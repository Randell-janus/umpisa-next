import type { ReactNode } from "react";

import {
  formatDate,
  formatDateRange,
  formatDateTime,
  formatDays,
  leaveTypeLabels,
} from "@/lib/format";
import type { LeaveRequest } from "@/lib/types";

import StatusBadge from "./StatusBadge";

function Detail({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <dt className="text-sm text-gray-500">{label}</dt>
      <dd className="mt-1 text-sm">{children}</dd>
    </div>
  );
}

export default function LeaveDetails({ request }: { request: LeaveRequest }) {
  const isReviewed = request.status !== "PENDING";

  return (
    <dl className="grid gap-5 sm:grid-cols-2">
      {request.employee && <Detail label="Employee">{request.employee.fullName}</Detail>}
      <Detail label="Status">
        <StatusBadge status={request.status} />
      </Detail>
      <Detail label="Leave type">{leaveTypeLabels[request.leaveType]}</Detail>
      <Detail label="Dates">{formatDateRange(request.startDate, request.endDate)}</Detail>
      <Detail label="Days">{formatDays(request.days)}</Detail>
      <Detail label="Filed on">{formatDate(request.createdAt)}</Detail>
      <div className="sm:col-span-2">
        <Detail label="Reason">{request.reason}</Detail>
      </div>
      {isReviewed && (
        <>
          <Detail label="Reviewed by">{request.reviewedBy?.fullName ?? "-"}</Detail>
          <Detail label="Reviewed on">
            {request.reviewedAt ? formatDateTime(request.reviewedAt) : "-"}
          </Detail>
          <div className="sm:col-span-2">
            <Detail label="Manager note">{request.managerNote || "-"}</Detail>
          </div>
        </>
      )}
    </dl>
  );
}
