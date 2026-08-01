import { getSupabase } from "../lib/supabase";

async function authHeaders(): Promise<HeadersInit> {
  const {
    data: { session },
  } = await getSupabase().auth.getSession();

  if (!session?.access_token) {
    throw new Error("Not signed in");
  }

  return {
    Authorization: `Bearer ${session.access_token}`,
  };
}

export async function authenticatedFetch<T>(
  input: RequestInfo | URL,
  init?: RequestInit,
): Promise<T> {
  const response = await fetch(input, {
    ...init,
    headers: await authHeaders(),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(
      body?.message ?? `Failed to fetch ${input} (${response.status})`,
    );
  }

  return (await response.json()) as T;
}
