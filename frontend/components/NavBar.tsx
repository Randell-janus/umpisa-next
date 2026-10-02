import Link from "next/link";

import { logout } from "@/lib/auth-actions";
import type { User } from "@/lib/types";

import Button from "./Button";

const links = {
  EMPLOYEE: [
    { href: "/leaves", label: "My Leaves" },
    { href: "/leaves/new", label: "File Leave" },
  ],
  MANAGER: [{ href: "/approvals", label: "Approvals" }],
};

export default function NavBar({ user }: { user: User }) {
  return (
    <header className="border-b border-gray-200 bg-white">
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3">
        <div className="flex items-center gap-6">
          <Link href="/" className="font-semibold">
            Leave Requests
          </Link>
          {links[user.role].map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-gray-600">
              {link.label}
            </Link>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-600">{user.fullName}</span>
          <form action={logout}>
            <Button variant="secondary">Log out</Button>
          </form>
        </div>
      </nav>
    </header>
  );
}
