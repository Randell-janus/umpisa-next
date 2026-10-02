"use client";

import { useActionState } from "react";

import Button from "@/components/Button";
import FormError from "@/components/FormError";
import Input from "@/components/Input";
import { login } from "@/lib/auth-actions";

export default function LoginForm() {
  const [state, formAction, isPending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="space-y-4">
      <FormError message={state?.error} />
      <Input label="Username" name="username" autoComplete="username" required />
      <Input
        label="Password"
        name="password"
        type="password"
        autoComplete="current-password"
        required
      />
      <Button type="submit" className="w-full" disabled={isPending}>
        {isPending ? "Signing in..." : "Sign in"}
      </Button>
    </form>
  );
}
