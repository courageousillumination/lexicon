import { useEffect, useState, type ReactNode } from "react";
import { useLexicons } from "../api/lexicon";
import { LexiconContext } from "./LexiconContext";

const STORAGE_KEY = "lexicon.selectedId";

function readStoredId(): string | null {
  try {
    return localStorage.getItem(STORAGE_KEY);
  } catch {
    return null;
  }
}

function writeStoredId(id: string | null) {
  try {
    if (id) {
      localStorage.setItem(STORAGE_KEY, id);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures (private mode, etc.).
  }
}

export function LexiconProvider({ children }: { children: ReactNode }) {
  const { data: lexicons = [], isPending } = useLexicons();
  const [lexiconId, setLexiconIdState] = useState<string | null>(readStoredId);

  function setLexiconId(id: string) {
    setLexiconIdState(id);
    writeStoredId(id);
  }

  useEffect(() => {
    if (isPending) {
      return;
    }

    if (lexicons.length === 0) {
      if (lexiconId !== null) {
        setLexiconIdState(null);
        writeStoredId(null);
      }
      return;
    }

    const stillExists = lexicons.some((lexicon) => lexicon.id === lexiconId);
    if (!stillExists) {
      const nextId = lexicons[0].id;
      setLexiconIdState(nextId);
      writeStoredId(nextId);
    }
  }, [isPending, lexiconId, lexicons]);

  const lexicon = lexicons.find((item) => item.id === lexiconId) ?? null;

  return (
    <LexiconContext.Provider value={{ lexicon, setLexiconId }}>
      {children}
    </LexiconContext.Provider>
  );
}
