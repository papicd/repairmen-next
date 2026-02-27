"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Dictionary = Record<string, string>;

interface LanguageContextType {
  locale: "en" | "sr";
  t: (key: string) => string;
  changeLanguage: (lang: "en" | "sr") => void;
}

const LanguageContext = createContext<LanguageContextType | null>(null);

export const LanguageProvider = ({
                                   children,
                                 }: {
  children: React.ReactNode;
}) => {
  const [locale, setLocale] = useState<"en" | "sr">("sr");
  const [dictionary, setDictionary] = useState<Dictionary>({});

  const loadDictionary = async (lang: "en" | "sr") => {
    const dict = await import(`../../dictionaries/${lang}.json`);
    setDictionary(dict.default);
  };

  useEffect(() => {
    const savedLang = localStorage.getItem("lang") as "en" | "sr" | null;
    const initialLang = savedLang || "en";

    setLocale(initialLang);
    loadDictionary(initialLang);
  }, []);

  const changeLanguage = (lang: "en" | "sr") => {
    localStorage.setItem("lang", lang);
    setLocale(lang);
    loadDictionary(lang);
  };

  const t = (key: string) => dictionary[key] || key;

  return (
    <LanguageContext.Provider value={{ locale, t, changeLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used inside LanguageProvider");
  }
  return context;
};
