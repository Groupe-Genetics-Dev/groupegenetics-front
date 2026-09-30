"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { CheckCircle2, LogOut, Menu, X, XCircle, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

export type Flash = { id: number; message: string; tone: "success" | "error" }
export type NavItem = { href: string; label: string; icon: LucideIcon; badge?: number }

// Mise en page commune aux espaces admin et client : barre latérale bleu nuit + contenu à droite
export default function PortalShell({
  title,
  homeHref,
  nav,
  flashes,
  onSignOut,
  children,
}: {
  title: string
  homeHref: string
  nav: NavItem[]
  flashes: Flash[]
  onSignOut: () => void
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)

  // Referme le menu mobile à chaque changement de page
  useEffect(() => setMenuOpen(false), [pathname])

  const isActive = (href: string) => (href === homeHref ? pathname === href : pathname.startsWith(href))

  const sidebar = (
    <div className="flex h-full flex-col bg-gradient-to-b from-genetics-dark-blue-800 to-genetics-dark-blue-950 text-white">
      <div className="relative px-4 pb-6 pt-5">
        <Link href={homeHref} className="flex w-full items-center justify-center rounded-2xl bg-white px-4 py-2 shadow-lg">
          <Image src="/logo.png" alt="Genetics" width={541} height={271} priority className="h-16 w-auto" />
        </Link>
        <button
          onClick={() => setMenuOpen(false)}
          aria-label="Fermer le menu"
          className="absolute -right-1 top-1 rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="px-6 text-center text-[11px] font-semibold uppercase tracking-widest text-genetics-dark-blue-200/70">{title}</p>
      <nav className="mt-3 flex-1 space-y-1 px-3" aria-label={title}>
        {nav.map(({ href, label, icon: Icon, badge }) => {
          const active = isActive(href)
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group relative flex items-center gap-3 rounded-xl px-3 py-3 transition-colors",
                active ? "bg-white/10 text-white" : "text-genetics-dark-blue-100 hover:bg-white/5 hover:text-white",
              )}
            >
              {active && <span className="absolute inset-y-2 left-0 w-1 rounded-r-full bg-accent" />}
              <span
                className={cn(
                  "flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg transition-colors",
                  active ? "bg-accent text-white" : "bg-white/5 text-genetics-dark-blue-100 group-hover:bg-white/10",
                )}
              >
                <Icon className="h-[18px] w-[18px]" />
              </span>
              <span className="min-w-0 flex-1 text-[15px] font-semibold">{label}</span>
              {!!badge && <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{badge}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="border-t border-white/10 p-4">
        <button
          onClick={onSignOut}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-3 text-sm font-semibold transition-colors hover:bg-white/20"
        >
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </button>
      </div>
    </div>
  )

  const current = nav.find((n) => isActive(n.href))

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Barre latérale fixe (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">{sidebar}</aside>

      {/* Barre latérale mobile (tiroir) */}
      <div className={cn("fixed inset-0 z-50 lg:hidden", menuOpen ? "visible" : "invisible")}>
        <div
          onClick={() => setMenuOpen(false)}
          className={cn("absolute inset-0 bg-genetics-dark-blue-950/60 transition-opacity", menuOpen ? "opacity-100" : "opacity-0")}
        />
        <aside
          className={cn(
            "absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-2xl transition-transform duration-300",
            menuOpen ? "translate-x-0" : "-translate-x-full",
          )}
        >
          {sidebar}
        </aside>
      </div>

      {/* Contenu de la fonctionnalité sélectionnée */}
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
          <button onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100">
            <Menu className="h-6 w-6" />
          </button>
          <span className="font-semibold text-slate-900">{current?.label ?? title}</span>
        </header>
        <main className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-10 lg:py-10">{children}</main>
      </div>

      {/* Notifications */}
      <div className="fixed bottom-4 right-4 z-[60] flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
        {flashes.map((f) => (
          <div
            key={f.id}
            role="status"
            className={cn(
              "flex items-start gap-3 rounded-xl border bg-white px-4 py-3 text-sm shadow-lg",
              f.tone === "success" ? "border-emerald-200 text-emerald-800" : "border-red-200 text-red-700",
            )}
          >
            {f.tone === "success" ? <CheckCircle2 className="mt-0.5 h-4 w-4 flex-shrink-0" /> : <XCircle className="mt-0.5 h-4 w-4 flex-shrink-0" />}
            {f.message}
          </div>
        ))}
      </div>
    </div>
  )
}

// Messages temporaires (5 s) affichés en bas à droite
export function useFlashes() {
  const [flashes, setFlashes] = useState<Flash[]>([])
  const flash = useCallback((message: string, tone: Flash["tone"] = "success") => {
    const id = Date.now() + Math.random()
    setFlashes((list) => [...list, { id, message, tone }])
    setTimeout(() => setFlashes((list) => list.filter((f) => f.id !== id)), 5000)
  }, [])
  return { flashes, flash }
}
