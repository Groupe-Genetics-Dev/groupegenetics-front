"use client"

import { useCallback, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { CheckCircle2, FileText, LayoutDashboard, Loader2, LogOut, Users, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { getMe, getToken, logout, type User } from "@/lib/auth"
import { listAccounts } from "@/lib/admin"
import { cn } from "@/lib/utils"
import { AdminCtx, type Flash } from "@/components/support/admin-context"

const NAV = [
  { href: "/support/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/support/admin/accounts", label: "Comptes", icon: Users },
  { href: "/support/admin/reports", label: "Rapports", icon: FileText },
]

// Espace administrateur : accessible uniquement aux comptes de rôle "admin"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [session, setSession] = useState<{ token: string; user: User } | null>(null)
  const [flashes, setFlashes] = useState<Flash[]>([])
  const [pendingAccounts, setPendingAccounts] = useState(0)

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

  return (
    <AdminCtx.Provider value={{ ...session, flash, pendingAccounts, refreshPending, signOut }}>
      <div className="min-h-screen bg-slate-50">
        <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-3 sm:px-6">
            <div className="flex items-center gap-3">
              <Link href="/support/admin" className="flex-shrink-0">
                <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-10 w-auto" />
              </Link>
              <span className="hidden rounded-full bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary sm:inline">
                Administration
              </span>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden text-sm text-slate-600 md:block">
                Connecté : <strong className="text-slate-900">{session.user.name}</strong>
              </span>
              <Button variant="outline" onClick={signOut} className="gap-2">
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">Se déconnecter</span>
              </Button>
            </div>
          </div>
          <nav className="container mx-auto flex gap-1 overflow-x-auto px-4 sm:px-6" aria-label="Administration">
            {NAV.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(href) ? "page" : undefined}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border-b-2 px-3 py-3 text-sm font-medium transition-colors",
                  isActive(href) ? "border-primary text-primary" : "border-transparent text-slate-500 hover:text-slate-900",
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
                {href.endsWith("accounts") && pendingAccounts > 0 && (
                  <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-bold text-white">{pendingAccounts}</span>
                )}
              </Link>
            ))}
          </nav>
        </header>

        <main className="container mx-auto px-4 py-8 sm:px-6">{children}</main>

        {/* Notifications */}
        <div className="fixed bottom-4 right-4 z-50 flex w-[calc(100%-2rem)] max-w-sm flex-col gap-2" aria-live="polite">
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
