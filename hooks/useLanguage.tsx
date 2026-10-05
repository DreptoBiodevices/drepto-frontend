import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import { translations, LangCode } from '../lib/translations';

interface LanguageContextType {
  language: LangCode;
  setLanguage: (lang: LangCode) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType>({
  language: 'en',
  setLanguage: () => {},
  t: (key: string) => key,
});

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LangCode>(() => {
    const stored = localStorage.getItem('drepto_language') as LangCode | null;
    return stored && ['en', 'hi', 'mr', 'bn', 'ta', 'te', 'kn', 'gu'].includes(stored)
      ? stored
      : 'en';
  });

  const setLanguage = useCallback((lang: LangCode) => {
    setLanguageState(lang);
    localStorage.setItem('drepto_language', lang);
  }, []);

  const t = useCallback(
    (key: string): string => {
      const entry = translations[key];
      if (!entry) return key; // fallback to key if no translation found
      return entry[language] || entry['en'] || key;
    },
    [language]
  );

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
