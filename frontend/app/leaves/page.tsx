import Button from "@/components/Button";
import { logout } from "@/lib/auth-actions";
import { requireRole } from "@/lib/session";

export default async function LeavesPage() {
  const user = await requireRole("EMPLOYEE");

  return (
    <main className="mx-auto max-w-4xl p-6">
      <h1 className="text-xl font-semibold">My Leaves</h1>
      <p className="mt-1 text-sm text-gray-500">Signed in as {user.fullName}</p>
      <form action={logout} className="mt-4">
        <Button variant="secondary">Log out</Button>
      </form>
    </main>
  );
}
