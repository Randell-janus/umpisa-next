import { redirect } from "next/navigation";

import { getCurrentUser, homePath } from "@/lib/session";

import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const user = await getCurrentUser();
  if (user) {
    redirect(homePath(user));
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-lg border border-gray-200 bg-white p-8 shadow-sm">
        <h1 className="text-xl font-semibold">Leave Requests</h1>
        <p className="mb-6 mt-1 text-sm text-gray-500">Sign in to continue</p>
        <LoginForm />
        <p className="mt-6 text-xs text-gray-400">
          Usernames: juan, ana, manager | Password: password123
        </p>
      </div>
    </main>
  );
}
