/**
 * Supported language tags (BCP 47: ISO 639-1 + ISO 3166-1 region).
 */
export type LanguageCode = "en-US" | "zh-CN" | "zh-TW" | "ja-JP";

export interface LanguageOption {
  /** BCP 47 language tag. */
  code: LanguageCode;
  /** Human-readable name in the native language. */
  label: string;
}

/** Languages available for lexicon source/target selection. */
export const LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { code: "en-US", label: "English" },
  { code: "zh-CN", label: "简体中文" },
  { code: "zh-TW", label: "繁體中文" },
  { code: "ja-JP", label: "日本語" },
] as const;

export function languageLabel(code: LanguageCode): string {
  return (
    LANGUAGE_OPTIONS.find((option) => option.code === code)?.label ?? code
  );
}
