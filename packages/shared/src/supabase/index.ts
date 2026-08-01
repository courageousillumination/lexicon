import type { Database } from "./database.js";

export type { Database, Json } from "./database.js";

export type LexiconRow = Database["public"]["Tables"]["lexicons"]["Row"];
export type LexiconEntryRow =
  Database["public"]["Tables"]["lexicon_entries"]["Row"];
