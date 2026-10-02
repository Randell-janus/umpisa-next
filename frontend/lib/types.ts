export type Role = "EMPLOYEE" | "MANAGER";

export type User = {
  id: string;
  username: string;
  fullName: string;
  role: Role;
};
