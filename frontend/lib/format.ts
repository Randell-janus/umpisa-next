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

const TIME_ZONE = "Asia/Manila";

const dateTimeFormatter = new Intl.DateTimeFormat("en-US", {
  month: "short",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZone: TIME_ZONE,
});

export function formatDateTime(value: string) {
  return dateTimeFormatter.format(new Date(value));
}

export function todayISO() {
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE }).format(new Date());
}

export function countWeekdays(start: string, end: string) {
  if (!start || !end || end < start) {
    return 0;
  }
  let days = 0;
  const current = new Date(start);
  const last = new Date(end);
  while (current <= last) {
    const weekday = current.getUTCDay();
    if (weekday !== 0 && weekday !== 6) {
      days += 1;
    }
    current.setUTCDate(current.getUTCDate() + 1);
  }
  return days;
}
