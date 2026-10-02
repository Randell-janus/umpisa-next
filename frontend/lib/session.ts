import { redirect } from "next/navigation";
import { cache } from "react";

import { getClient } from "./graphql";
import { ME_QUERY } from "./queries";
import type { Role, User } from "./types";

export const getCurrentUser = cache(async (): Promise<User | null> => {
  const client = await getClient();
  try {
    const data = await client.request<{ me: User | null }>(ME_QUERY);
    return data.me;
  } catch {
    return null;
  }
});

export function homePath(user: User) {
  return user.role === "MANAGER" ? "/approvals" : "/leaves";
}

export async function requireUser() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}

export async function requireRole(role: Role) {
  const user = await requireUser();
  if (user.role !== role) {
    redirect(homePath(user));
  }
  return user;
}
