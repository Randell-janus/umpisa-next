"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { getClient, getErrorMessage, TOKEN_COOKIE } from "./graphql";
import { LOGIN_MUTATION } from "./queries";
import { homePath } from "./session";
import type { User } from "./types";

export type LoginState = { error?: string } | undefined;

type LoginResponse = {
  login: { token: string; user: User };
};

export async function login(_state: LoginState, formData: FormData): Promise<LoginState> {
  const username = String(formData.get("username") ?? "").trim();
  const password = String(formData.get("password") ?? "");

  if (!username || !password) {
    return { error: "Please enter your username and password." };
  }

  let data: LoginResponse;
  try {
    const client = await getClient();
    data = await client.request<LoginResponse>(LOGIN_MUTATION, { username, password });
  } catch (error) {
    return { error: getErrorMessage(error) };
  }

  (await cookies()).set(TOKEN_COOKIE, data.login.token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  });

  redirect(homePath(data.login.user));
}

export async function logout() {
  (await cookies()).delete(TOKEN_COOKIE);
  redirect("/login");
}
