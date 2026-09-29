"use client"

import { useCallback, useEffect, useMemo, useRef, useState } from "react"
import Link from "next/link"
import { AlertCircle, CheckCircle2, ChevronRight, Clock, Inbox, Loader2, RefreshCw, Search, Wrench } from "lucide-react"
import StatusSelect from "@/components/support/StatusSelect"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAdmin } from "@/components/support/admin-context"
import { ApiError } from "@/lib/auth"
import { listAccounts, listAllIncidents, updateIncidentStatus, type Account, type AdminIncident } from "@/lib/admin"
import { CATEGORIES, PRIORITIES, STATUSES, type Category, type Priority, type Status } from "@/lib/incidents"

const REFRESH_MS = 30_000
const selectClass =
  "h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

export default function AdminDashboard() {
  const { token, flash, signOut } = useAdmin()
  const [incidents, setIncidents] = useState<AdminIncident[] | null>(null)
  const [clients, setClients] = useState<Record<string, Account>>({})
  const [error, setError] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [busyId, setBusyId] = useState<string | null>(null)
  const [search, setSearch] = useState("")
  const [status, setStatus] = useState<"ALL" | Status>("ALL")
  const [priority, setPriority] = useState<"ALL" | Priority>("ALL")
  const [category, setCategory] = useState<"ALL" | Category>("ALL")
  const known = useRef<Set<string> | null>(null)

  const handleError = useCallback(
    (err: unknown, fallback: string) => {
      const message = err instanceof ApiError ? err.message : fallback
      if (/credentials|réservée|validation|refusée/i.test(message)) signOut()
      return message
    },
    [signOut],
  )

  const load = useCallback(
    async (silent = false) => {
      if (!silent) setRefreshing(true)
      try {
        const [list, accounts] = await Promise.all([listAllIncidents(token), listAccounts(token)])
        // Signale les incidents arrivés depuis le dernier chargement
        if (known.current) {
          const fresh = list.filter((i) => !known.current!.has(i.id))
          if (fresh.length) flash(fresh.length === 1 ? `Nouvel incident : ${fresh[0].title}` : `${fresh.length} nouveaux incidents`)
        }
        known.current = new Set(list.map((i) => i.id))
        setIncidents(list)
        setClients(Object.fromEntries(accounts.map((a) => [a.id, a])))
        setError(null)
      } catch (err) {
        setError(handleError(err, "Impossible de charger les incidents."))
      } finally {
        setRefreshing(false)
      }
    },
    [token, flash, handleError],
  )

  useEffect(() => {
    load()
    const timer = setInterval(() => load(true), REFRESH_MS)
    return () => clearInterval(timer)
  }, [load])

  const changeStatus = async (incident: AdminIncident, next: Status) => {
    if (next === incident.status) return
    setBusyId(incident.id)
    try {
      const updated = await updateIncidentStatus(token, incident.id, next)
      setIncidents((list) => (list ?? []).map((i) => (i.id === updated.id ? updated : i)))
      flash(next === "TERMINE" ? `« ${incident.title} » terminé : le client a été informé par e-mail.` : `Statut mis à jour : ${STATUSES[next].label}.`)
    } catch (err) {
      flash(handleError(err, "Le statut n'a pas pu être modifié."), "error")
    } finally {
      setBusyId(null)
    }
  }

  const counts = useMemo(() => {
    const list = incidents ?? []
    return {
      ALL: list.length,
      EN_ATTENTE: list.filter((i) => i.status === "EN_ATTENTE").length,
      EN_TRAITEMENT: list.filter((i) => i.status === "EN_TRAITEMENT").length,
      TERMINE: list.filter((i) => i.status === "TERMINE").length,
    }
  }, [incidents])

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return (incidents ?? []).filter((i) => {
      const client = clients[i.userId]
      return (
        (status === "ALL" || i.status === status) &&
        (priority === "ALL" || i.priority === priority) &&
        (category === "ALL" || i.category === category) &&
        (!q || [i.title, i.description, client?.name ?? "", client?.email ?? "", client?.company ?? ""].some((v) => v.toLowerCase().includes(q)))
      )
    })
  }, [incidents, clients, search, status, priority, category])

  const stats = [
    { key: "ALL" as const, label: "Total des incidents", value: counts.ALL, icon: Inbox, color: "bg-primary" },
    { key: "EN_ATTENTE" as const, label: "En attente", value: counts.EN_ATTENTE, icon: Clock, color: "bg-amber-500" },
    { key: "EN_TRAITEMENT" as const, label: "En traitement", value: counts.EN_TRAITEMENT, icon: Wrench, color: "bg-blue-600" },
    { key: "TERMINE" as const, label: "Terminés", value: counts.TERMINE, icon: CheckCircle2, color: "bg-emerald-600" },
  ]

  const clientCell = (incident: AdminIncident) => {
    const client = clients[incident.userId]
    return client ? (
      <>
        <p className="font-medium text-slate-900">{client.name}</p>
        <p className="text-xs text-slate-500">{client.company || client.email}</p>
      </>
    ) : (
      <p className="text-slate-400">—</p>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tableau de bord des incidents</h1>
          <p className="mt-1 text-slate-500">Suivez et traitez les incidents déclarés par vos clients.</p>
        </div>
        <Button variant="outline" onClick={() => load()} disabled={refreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ key, label, value, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setStatus(key)}
            className={`rounded-2xl bg-white p-5 text-left shadow-sm ring-1 transition hover:shadow-md ${status === key ? "ring-2 ring-primary" : "ring-slate-200"}`}
          >
            <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
              <Icon className="h-5 w-5 text-white" />
            </span>
            <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
            <p className="text-sm text-slate-600">{label}</p>
          </button>
        ))}
      </div>

      <Card className="border-0 shadow-lg">
        <CardContent className="p-0">
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un incident ou un client..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 lg:flex">
              <select aria-label="Filtrer par statut" value={status} onChange={(e) => setStatus(e.target.value as typeof status)} className={selectClass}>
                <option value="ALL">Tous les statuts</option>
                {Object.entries(STATUSES).map(([v, { label }]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <select aria-label="Filtrer par priorité" value={priority} onChange={(e) => setPriority(e.target.value as typeof priority)} className={selectClass}>
                <option value="ALL">Toutes les priorités</option>
                {Object.entries(PRIORITIES).map(([v, { label }]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
              <select aria-label="Filtrer par catégorie" value={category} onChange={(e) => setCategory(e.target.value as typeof category)} className={selectClass}>
                <option value="ALL">Toutes les catégories</option>
                {Object.entries(CATEGORIES).map(([v, label]) => (
                  <option key={v} value={v}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {error ? (
            <p className="flex items-center gap-2 px-6 py-10 text-red-700">
              <AlertCircle className="h-5 w-5" /> {error}
            </p>
          ) : incidents === null ? (
            <p className="flex items-center justify-center px-6 py-12 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement des incidents...
            </p>
          ) : visible.length === 0 ? (
            <p className="px-6 py-12 text-center text-slate-500">
              {incidents.length === 0 ? "Aucun incident déclaré pour le moment." : "Aucun incident ne correspond à ces critères."}
            </p>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden overflow-x-auto lg:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Incident</th>
                      <th className="px-5 py-3 font-semibold">Client</th>
                      <th className="px-5 py-3 font-semibold">Priorité</th>
                      <th className="px-5 py-3 font-semibold">Déclaré le</th>
                      <th className="px-5 py-3 font-semibold">Statut</th>
                      <th className="px-5 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.map((i) => (
                      <tr key={i.id} className="align-top hover:bg-slate-50/60">
                        <td className="max-w-md px-5 py-4">
                          <Link href={`/support/admin/incidents/${i.id}`} className="font-semibold text-slate-900 hover:text-primary">
                            {i.title}
                          </Link>
                          <p className="mt-0.5 line-clamp-1 text-slate-500">{i.description}</p>
                          <span className="mt-1.5 inline-block rounded-full bg-slate-100 px-2 py-0.5 text-xs text-slate-600">{CATEGORIES[i.category]}</span>
                        </td>
                        <td className="px-5 py-4">{clientCell(i)}</td>
                        <td className="px-5 py-4">
                          <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITIES[i.priority].className}`}>
                            {PRIORITIES[i.priority].label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-600">{formatDate(i.createdAt)}</td>
                        <td className="px-5 py-4">
                          <StatusSelect incident={i} busy={busyId === i.id} onChange={(s) => changeStatus(i, s)} />
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link href={`/support/admin/incidents/${i.id}`} className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:text-accent">
                            Détails <ChevronRight className="h-4 w-4" />
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {/* Mobile / tablette */}
              <ul className="divide-y divide-slate-100 lg:hidden">
                {visible.map((i) => (
                  <li key={i.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <Link href={`/support/admin/incidents/${i.id}`} className="font-semibold text-slate-900">
                        {i.title}
                      </Link>
                      <span className={`whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ${PRIORITIES[i.priority].className}`}>
                        {PRIORITIES[i.priority].label}
                      </span>
                    </div>
                    <div className="text-sm">{clientCell(i)}</div>
                    <p className="text-xs text-slate-500">
                      {CATEGORIES[i.category]} · {formatDate(i.createdAt)}
                    </p>
                    <div className="flex items-center justify-between gap-3">
                      <StatusSelect incident={i} busy={busyId === i.id} onChange={(s) => changeStatus(i, s)} />
                      <Link href={`/support/admin/incidents/${i.id}`} className="text-sm font-medium text-primary">
                        Détails
                      </Link>
                    </div>
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
