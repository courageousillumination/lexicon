import { createContext } from "react";
import type { Lexicon } from "@lexicon/shared/model";

export type LexiconContextValue = {
  lexicon: Lexicon | null;
  setLexiconId: (id: string) => void;
};

export const LexiconContext = createContext<LexiconContextValue | null>(null);
