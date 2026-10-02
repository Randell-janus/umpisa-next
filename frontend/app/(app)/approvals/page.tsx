import { requireRole } from "@/lib/session";

export default async function ApprovalsPage() {
  await requireRole("MANAGER");

  return <h1 className="text-xl font-semibold">Approvals</h1>;
}
