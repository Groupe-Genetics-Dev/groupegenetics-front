"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { Menu, X } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { SUPPORT_URL } from "@/lib/config"
import LangSwitch from "./LangSwitch"

export default function Header() {
  const { t } = useI18n()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : ""
  }, [open])

  const links = [
    { href: "#accueil", label: t.nav.home },
    { href: "#apropos", label: t.nav.about },
    { href: "#solutions", label: t.nav.solutions },
    { href: "#contact", label: t.nav.contact },
  ]

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all ${
          scrolled || open ? "bg-white/90 shadow-sm backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <nav className="container flex h-16 items-center justify-between sm:h-20">
          <a
            href="#accueil"
            className="flex shrink-0 items-center rounded-lg bg-white p-1"
            onClick={() => setOpen(false)}
          >
            <Image src="/logo.png" alt="Genetics" width={108} height={54} priority className="h-10 w-auto sm:h-12" />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                    scrolled
                      ? "text-slate-700 hover:bg-navy-50 hover:text-navy-800"
                      : "text-white/85 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href={SUPPORT_URL}
                className={`rounded-full px-4 py-2 text-sm font-medium transition ${
                  scrolled
                    ? "text-slate-700 hover:bg-navy-50 hover:text-navy-800"
                    : "text-white/85 hover:bg-white/10 hover:text-white"
                }`}
              >
                {t.nav.support}
              </a>
            </li>
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <LangSwitch dark={!scrolled} />
            <a href="#contact" className="btn-gold !py-2.5">
              {t.nav.cta}
            </a>
          </div>

          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={t.nav.menu}
            aria-expanded={open}
            className={`rounded-lg p-2 lg:hidden ${scrolled || open ? "text-navy-900" : "text-white"}`}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </nav>
      </header>

      {/* Mobile menu */}
      <div
        className={`fixed inset-x-0 bottom-0 top-16 z-40 overflow-y-auto bg-white transition-all duration-300 sm:top-20 lg:hidden ${
          open ? "visible opacity-100" : "invisible opacity-0"
        }`}
      >
        <ul className="container flex flex-col gap-1 py-6">
          {[...links, { href: SUPPORT_URL, label: t.nav.support }].map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                onClick={() => setOpen(false)}
                className="block rounded-xl px-4 py-3 text-lg font-medium text-navy-950 hover:bg-navy-50"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>
        <div className="container flex flex-col gap-4 border-t border-slate-100 pt-6">
          <LangSwitch />
          <a href="#contact" onClick={() => setOpen(false)} className="btn-gold w-full">
            {t.nav.cta}
          </a>
        </div>
      </div>
    </>
  )
}
