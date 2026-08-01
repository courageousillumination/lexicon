import type { PostgrestError } from "@supabase/supabase-js";

export type QueryResult<T> = {
  data: T;
  error: PostgrestError | null;
};

/**
 * Returns mapped query data, or throws the PostgREST error.
 * Use with `.single()` (and similar) where a row is required.
 */
export function dataOrThrow<T, R>(
  result: QueryResult<T | null>,
  map: (data: T) => R,
): R {
  if (result.error) {
    throw result.error;
  }

  if (result.data === null) {
    throw new Error("Expected query data, received null");
  }

  return map(result.data);
}

/**
 * Returns mapped query data (or null), or throws the PostgREST error.
 * Use with `.maybeSingle()` where absence is a valid result.
 * Omit `map` when there is no row data to transform (e.g. deletes).
 */
export function dataOrThrowMaybe<T>(result: QueryResult<T | null>): T | null;
export function dataOrThrowMaybe<T, R>(
  result: QueryResult<T | null>,
  map: (data: T) => R,
): R | null;
export function dataOrThrowMaybe<T, R>(
  result: QueryResult<T | null>,
  map?: (data: T) => R,
): T | R | null {
  if (result.error) {
    throw result.error;
  }

  if (result.data === null) {
    return null;
  }

  return map ? map(result.data) : result.data;
}

/**
 * Returns mapped query rows (empty array if none), or throws the PostgREST error.
 * Use with list queries.
 */
export function dataOrThrowMany<T, R>(
  result: QueryResult<T[] | null>,
  map: (data: T) => R,
): R[] {
  if (result.error) {
    throw result.error;
  }

  return (result.data ?? []).map(map);
}
