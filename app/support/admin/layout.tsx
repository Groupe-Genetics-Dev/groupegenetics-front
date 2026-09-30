"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { FileText, LayoutDashboard, Loader2, TriangleAlert, Users } from "lucide-react"
import { getMe, getToken, logout, type User } from "@/lib/auth"
import { listAccounts } from "@/lib/admin"
import { AdminCtx } from "@/components/support/admin-context"
import PortalShell, { useFlashes } from "@/components/support/PortalShell"

// Espace administrateur : accessible uniquement aux comptes de rôle "admin"
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [session, setSession] = useState<{ token: string; user: User } | null>(null)
  const [pendingAccounts, setPendingAccounts] = useState(0)
  const { flashes, flash } = useFlashes()

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

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Chargement du tableau de bord...
      </div>
    )
  }

  const nav = [
    { href: "/support/admin", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/support/admin/incidents", label: "Gestion des incidents", icon: TriangleAlert },
    { href: "/support/admin/accounts", label: "Gestion des comptes", icon: Users, badge: pendingAccounts },
    { href: "/support/admin/reports", label: "Rapports", icon: FileText },
  ]

  return (
    <AdminCtx.Provider value={{ ...session, flash, pendingAccounts, refreshPending, signOut }}>
      <PortalShell title="Administration" homeHref="/support/admin" nav={nav} flashes={flashes} onSignOut={signOut}>
        {children}
      </PortalShell>
    </AdminCtx.Provider>
  )
}
