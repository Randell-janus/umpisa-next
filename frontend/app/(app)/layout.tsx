import NavBar from "@/components/NavBar";
import { requireUser } from "@/lib/session";

export default async function AppLayout({ children }: LayoutProps<"/">) {
  const user = await requireUser();

  return (
    <>
      <NavBar user={user} />
      <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
    </>
  );
}
