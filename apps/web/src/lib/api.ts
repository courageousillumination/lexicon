import type { Lexicon } from "@lexicon/shared/model";
import { getSupabase } from "./supabase";

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

export async function fetchLexicons(): Promise<Lexicon[]> {
  const response = await fetch("/api/lexicons", {
    headers: await authHeaders(),
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      message?: string;
    } | null;
    throw new Error(
      body?.message ?? `Failed to load lexicons (${response.status})`,
    );
  }

  return (await response.json()) as Lexicon[];
}
