'use client';

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import type { Lang, T } from '@/content/copy';

type LanguageValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  /** Resolve a { pt, en } pair to the active language. */
  t: (pair: T) => string;
};

const LanguageContext = createContext<LanguageValue | null>(null);

/**
 * Replaces the prototype's twin-`<span>` trick (README "Language toggle"), which existed only
 * because the prototype had no framework. Real keys live in content/copy.ts.
 */
export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('pt');
  const t = useCallback((pair: T) => pair[lang], [lang]);
  const value = useMemo(() => ({ lang, setLang, t }), [lang, t]);

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}
