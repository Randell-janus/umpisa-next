import { ClientError, GraphQLClient } from "graphql-request";
import { cookies } from "next/headers";

export const TOKEN_COOKIE = "token";

const GRAPHQL_URL = process.env.GRAPHQL_URL ?? "http://localhost:8000/graphql/";

export async function getClient() {
  const token = (await cookies()).get(TOKEN_COOKIE)?.value;
  return new GraphQLClient(GRAPHQL_URL, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
}

export function getErrorMessage(error: unknown) {
  if (error instanceof ClientError) {
    return error.response.errors?.[0]?.message ?? "Something went wrong.";
  }
  return "Something went wrong. Please try again.";
}
