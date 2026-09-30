"use client"

import { useCallback, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { LayoutDashboard, ListChecks, Loader2, UserRound } from "lucide-react"
import { ApiError, getMe, getToken, logout, type User } from "@/lib/auth"
import { listIncidents, type Incident } from "@/lib/incidents"
import { ClientCtx } from "@/components/support/client-context"
import IncidentForm from "@/components/support/IncidentForm"
import PortalShell, { useFlashes } from "@/components/support/PortalShell"

// Espace client : accessible uniquement après connexion (les admins sont renvoyés vers leur tableau de bord)
export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [session, setSession] = useState<{ token: string; user: User } | null>(null)
  const [incidents, setIncidents] = useState<Incident[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
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
        if (user.role === "admin") router.replace("/support/admin")
        else setSession({ token, user })
      })
      .catch(signOut)
  }, [router, signOut])

  const reload = useCallback(async () => {
    if (!session) return
    setRefreshing(true)
    try {
      setIncidents(await listIncidents(session.token))
      setLoadError(null)
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Impossible de charger vos incidents.")
    } finally {
      setRefreshing(false)
    }
  }, [session])

  useEffect(() => {
    reload()
  }, [reload])

  if (!session) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Chargement de votre espace...
      </div>
    )
  }

  const inProgress = (incidents ?? []).filter((i) => i.status !== "TERMINE").length
  const nav = [
    { href: "/support", label: "Tableau de bord", icon: LayoutDashboard },
    { href: "/support/incidents", label: "Mes incidents", icon: ListChecks, badge: inProgress },
    { href: "/support/account", label: "Mon compte", icon: UserRound },
  ]

  return (
    <ClientCtx.Provider value={{ ...session, incidents, loadError, refreshing, reload, openCreate: () => setFormOpen(true), flash }}>
      <PortalShell title="Espace client" homeHref="/support" nav={nav} flashes={flashes} onSignOut={signOut}>
        {children}
      </PortalShell>
      <IncidentForm
        token={session.token}
        open={formOpen}
        onOpenChange={setFormOpen}
        onCreated={(created) => {
          setIncidents((list) => [created, ...(list ?? [])])
          setFormOpen(false)
          flash("Votre incident a bien été enregistré. Notre équipe support a été prévenue.")
        }}
      />
    </ClientCtx.Provider>
  )
}
