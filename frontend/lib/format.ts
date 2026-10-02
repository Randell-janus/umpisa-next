import type { LeaveStatus, LeaveType } from "./types";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  timeZone: "UTC",
});

export const leaveTypeLabels: Record<LeaveType, string> = {
  VACATION: "Vacation",
  SICK: "Sick",
};

export const statusLabels: Record<LeaveStatus, string> = {
  PENDING: "Pending",
  APPROVED: "Approved",
  REJECTED: "Rejected",
};

export function formatDate(value: string) {
  return dateFormatter.format(new Date(value));
}

export function formatDateRange(start: string, end: string) {
  if (start === end) {
    return formatDate(start);
  }
  return `${formatDate(start)} - ${formatDate(end)}`;
}

export function formatDays(days: number) {
  return days === 1 ? "1 day" : `${days} days`;
}
