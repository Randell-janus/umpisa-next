import { requireRole } from "@/lib/session";

export default async function LeavesPage() {
  await requireRole("EMPLOYEE");

  return <h1 className="text-xl font-semibold">My Leaves</h1>;
}
