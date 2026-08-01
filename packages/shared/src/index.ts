export type HealthStatus = "ok" | "degraded" | "down";

export interface HealthResponse {
  status: HealthStatus;
  service: string;
  timestamp: string;
}

export function createHealthResponse(service: string): HealthResponse {
  return {
    status: "ok",
    service,
    timestamp: new Date().toISOString(),
  };
}

export type * from "./model/index.js";
export type * from "./repository/index.js";
export type * from "./supabase/index.js";
export {
  createLexicon,
  deleteLexicon,
  getLexicon,
  getLexicons,
  updateLexicon,
} from "./repository/index.js";
