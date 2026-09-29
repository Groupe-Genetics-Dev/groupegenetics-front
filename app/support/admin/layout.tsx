"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CheckCircle2, ExternalLink, FileText, LayoutDashboard, Loader2, LogOut, Menu, Users, X, XCircle } from "lucide-react"
import { getMe, getToken, logout, type User } from "@/lib/auth"
import { listAccounts } from "@/lib/admin"
import { cn } from "@/lib/utils"
import { AdminCtx, type Flash } from "@/components/support/admin-context"

const NAV = [
  { href: "/support/admin", label: "Tableau de bord", hint: "Incidents des clients", icon: LayoutDashboard },
  { href: "/support/admin/accounts", label: "Gestion des comptes", hint: "Valider les inscriptions", icon: Users },
  { href: "/support/admin/reports", label: "Rapports", hint: "Rapports PDF", icon: FileText },
]

// Espace administrateur : accessible uniquement aux comptes de rôle "admin"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<{ token: string; user: User } | null>(null)
  const [flashes, setFlashes] = useState<Flash[]>([])
  const [pendingAccounts, setPendingAccounts] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)

  // Referme le menu mobile à chaque changement de page
  useEffect(() => setMenuOpen(false), [pathname])

  const signOut = useCallback(() => {
    logout()
    router.replace("/support/login")
  }, [router])

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace("/support/login")
      return
    }
    getMe(token)
      .then((user) => {
        if (user.role !== "admin") router.replace("/support")
        else setSession({ token, user })
      })
      .catch(signOut)
  }, [router, signOut])

  const refreshPending = useCallback(() => {
    if (!session) return
    listAccounts(session.token)
      .then((accounts) => setPendingAccounts(accounts.filter((a) => a.account_status === "PENDING").length))
      .catch(() => {})
  }, [session])

  useEffect(refreshPending, [refreshPending])

  const flash = useCallback((message: string, tone: Flash["tone"] = "success") => {
    const id = Date.now() + Math.random()
    setFlashes((list) => [...list, { id, message, tone }])
    setTimeout(() => setFlashes((list) => list.filter((f) => f.id !== id)), 5000)
  }, [])

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Chargement du tableau de bord...
      </div>
    )
  }

  const isActive = (href: string) => (href === "/support/admin" ? pathname === href || pathname.startsWith("/support/admin/incidents") : pathname.startsWith(href))

  const initials = session.user.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const sidebar = (
    <div className="flex h-full flex-col bg-gradient-to-b from-genetics-dark-blue-800 to-genetics-dark-blue-950 text-white">
      <div className="flex items-center justify-between px-6 pb-6 pt-7">
        <Link href="/support/admin" className="rounded-xl bg-white p-2 shadow-lg">
          <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-9 w-auto" />
        </Link>
        <button onClick={() => setMenuOpen(false)} aria-label="Fermer le menu" className="rounded-lg p-2 text-white/70 hover:bg-white/10 hover:text-white lg:hidden">
          <X className="h-5 w-5" />
        </button>
      </div>

      <p className="px-6 text-[11px] font-semibold uppercase tracking-widest text-genetics-dark-blue-200/70">Administration</p>
      <nav className="mt-3 flex-1 space-y-1 px-3" aria-label="Administration">
        {NAV.map(({ href, label, hint, icon: Icon }) => {
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
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold">{label}</span>
                <span className="block truncate text-xs text-genetics-dark-blue-200">{hint}</span>
              </span>
              {href.endsWith("accounts") && pendingAccounts > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{pendingAccounts}</span>
              )}
            </Link>
          )
        })}
      </nav>

      <div className="space-y-2 border-t border-white/10 p-4">
        <Link href="/" target="_blank" className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-genetics-dark-blue-100 hover:bg-white/5 hover:text-white">
          <ExternalLink className="h-4 w-4" />
          Voir le site
        </Link>
        <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
          <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-sm font-bold">{initials}</span>
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-semibold">{session.user.name}</span>
            <span className="block truncate text-xs text-genetics-dark-blue-200">{session.user.email}</span>
          </span>
          <button onClick={signOut} title="Se déconnecter" aria-label="Se déconnecter" className="rounded-lg p-2 text-genetics-dark-blue-100 hover:bg-white/10 hover:text-white">
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )

  const current = NAV.find((n) => isActive(n.href))

  return (
    <AdminCtx.Provider value={{ ...session, flash, pendingAccounts, refreshPending, signOut }}>
      <div className="min-h-screen bg-slate-50">
        {/* Barre latérale fixe (desktop) */}
        <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 lg:block">{sidebar}</aside>

        {/* Barre latérale mobile (tiroir) */}
        <div className={cn("fixed inset-0 z-50 lg:hidden", menuOpen ? "visible" : "invisible")}>
          <div
            onClick={() => setMenuOpen(false)}
            className={cn("absolute inset-0 bg-genetics-dark-blue-950/60 transition-opacity", menuOpen ? "opacity-100" : "opacity-0")}
          />
          <aside className={cn("absolute inset-y-0 left-0 w-72 max-w-[85%] shadow-2xl transition-transform duration-300", menuOpen ? "translate-x-0" : "-translate-x-full")}>
            {sidebar}
          </aside>
        </div>

        {/* Contenu de la fonctionnalité sélectionnée */}
        <div className="lg:pl-72">
          <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-slate-200 bg-white/90 px-4 py-3 backdrop-blur-md lg:hidden">
            <button onClick={() => setMenuOpen(true)} aria-label="Ouvrir le menu" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100">
              <Menu className="h-6 w-6" />
            </button>
            <span className="font-semibold text-slate-900">{current?.label ?? "Administration"}</span>
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
    </AdminCtx.Provider>
  )
}
