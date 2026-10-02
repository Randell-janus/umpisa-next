export type Role = "EMPLOYEE" | "MANAGER";

export type LeaveType = "VACATION" | "SICK";

export type LeaveStatus = "PENDING" | "APPROVED" | "REJECTED";

export type User = {
  id: string;
  username: string;
  fullName: string;
  role: Role;
};

export type LeaveBalance = {
  id: string;
  leaveType: LeaveType;
  allocatedDays: number;
  usedDays: number;
  remainingDays: number;
};

export type LeaveRequest = {
  id: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: LeaveStatus;
  createdAt: string;
  managerNote?: string;
  reviewedAt?: string | null;
  employee?: Pick<User, "id" | "fullName">;
  reviewedBy?: Pick<User, "fullName"> | null;
  balance?: Pick<LeaveBalance, "remainingDays"> | null;
};
