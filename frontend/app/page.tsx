import { redirect } from "next/navigation";

import { homePath, requireUser } from "@/lib/session";

export default async function Home() {
  const user = await requireUser();
  redirect(homePath(user));
}
