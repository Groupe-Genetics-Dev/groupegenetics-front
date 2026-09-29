"use client"

import { useI18n } from "@/lib/i18n"
import type { Lang } from "@/lib/content"

export default function LangSwitch({ dark = false }: { dark?: boolean }) {
  const { lang, setLang } = useI18n()

  return (
    <div
      role="group"
      aria-label="Language"
      className={`inline-flex w-fit rounded-full p-1 text-xs font-semibold ring-1 ${
        dark ? "ring-white/25" : "ring-slate-200"
      }`}
    >
      {(["fr", "en"] as Lang[]).map((l) => (
        <button
          key={l}
          type="button"
          onClick={() => setLang(l)}
          aria-pressed={lang === l}
          className={`rounded-full px-3 py-1.5 uppercase transition ${
            lang === l
              ? "bg-navy-800 text-white"
              : dark
                ? "text-white/80 hover:text-white"
                : "text-slate-500 hover:text-navy-800"
          }`}
        >
          {l}
        </button>
      ))}
    </div>
  )
}
