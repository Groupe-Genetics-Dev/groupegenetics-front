"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { dictionaries, type Dictionary, type Lang } from "./content"

type I18n = { lang: Lang; t: Dictionary; setLang: (lang: Lang) => void }

const I18nContext = createContext<I18n | null>(null)

const STORAGE_KEY = "genetics-lang"

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr")

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      if (saved === "fr" || saved === "en") setLangState(saved)
    } catch {}
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
    document.title = dictionaries[lang].meta.title
  }, [lang])

  const setLang = (next: Lang) => {
    setLangState(next)
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {}
  }

  return (
    <I18nContext.Provider value={{ lang, t: dictionaries[lang], setLang }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  const ctx = useContext(I18nContext)
  if (!ctx) throw new Error("useI18n must be used inside I18nProvider")
  return ctx
}
