"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  ArrowRight,
  Bell,
  CheckCircle2,
  Clock,
  Flame,
  Inbox,
  Loader2,
  RefreshCw,
  TriangleAlert,
  UserPlus,
  Users,
  Wrench,
  type LucideIcon,
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { AreaTrend, Donut, Gauge, HBars, type Slice } from "@/components/support/charts"
import { useAdmin } from "@/components/support/admin-context"
import { ApiError } from "@/lib/auth"
import { listAccounts, listAllIncidents, type Account, type AdminIncident } from "@/lib/admin"
import { CATEGORIES, PRIORITIES, STATUSES, type Category, type Priority, type Status } from "@/lib/incidents"

const REFRESH_MS = 30_000

// Couleurs : statuts = palette d'états (toujours accompagnés de leur libellé),
// priorités = rampe ordinale d'une seule teinte (clair = faible, foncé = critique)
const STATUS_COLORS: Record<Status, string> = { EN_ATTENTE: "#fab219", EN_TRAITEMENT: "#2a78d6", TERMINE: "#0ca30c" }
const PRIORITY_COLORS: Record<Priority, string> = { FAIBLE: "#86b6ef", MOYENNE: "#3987e5", HAUTE: "#1c5cab", CRITIQUE: "#0d366b" }

// Les dates de l'API sont en UTC sans suffixe "Z"
const parse = (iso: string) => new Date(/[zZ]|[+-]\d\d:?\d\d$/.test(iso) ? iso : `${iso}Z`)

function timeAgo(date: Date) {
  const s = Math.max(0, (Date.now() - date.getTime()) / 1000)
  if (s < 60) return "à l'instant"
  if (s < 3600) return `il y a ${Math.floor(s / 60)} min`
  if (s < 86400) return `il y a ${Math.floor(s / 3600)} h`
  if (s < 7 * 86400) return `il y a ${Math.floor(s / 86400)} j`
  return date.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })
}

type Notice = { id: string; at: Date; icon: LucideIcon; tone: string; title: string; detail: string; href: string }

function buildNotices(incidents: AdminIncident[], accounts: Record<string, Account>, pending: Account[]): Notice[] {
  const notices: Notice[] = []
  for (const i of incidents) {
    const client = accounts[i.userId]?.name ?? "Un client"
    notices.push({
      id: `new-${i.id}`,
      at: parse(i.createdAt),
      icon: i.priority === "CRITIQUE" ? Flame : TriangleAlert,
      tone: i.priority === "CRITIQUE" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600",
      title: `Nouvel incident : ${i.title}`,
      detail: `${client} · priorité ${PRIORITIES[i.priority].label.toLowerCase()}`,
      href: `/support/admin/incidents/${i.id}`,
    })
    const updated = parse(i.updatedAt)
    if (updated.getTime() - parse(i.createdAt).getTime() > 60_000) {
      notices.push({
        id: `upd-${i.id}`,
        at: updated,
        icon: i.status === "TERMINE" ? CheckCircle2 : Wrench,
        tone: i.status === "TERMINE" ? "bg-emerald-50 text-emerald-600" : "bg-blue-50 text-blue-600",
        title: `${i.title} : ${STATUSES[i.status].label.toLowerCase()}`,
        detail: `Statut mis à jour · ${client}`,
        href: `/support/admin/incidents/${i.id}`,
      })
    }
  }
  for (const a of pending) {
    notices.push({
      id: `acc-${a.id}`,
      at: parse(a.createdAt),
      icon: UserPlus,
      tone: "bg-primary/10 text-primary",
      title: `Nouvelle demande de compte : ${a.name}`,
      detail: `${a.company || a.email} · à valider`,
      href: "/support/admin/accounts",
    })
  }
  return notices.sort((a, b) => b.at.getTime() - a.at.getTime()).slice(0, 8)
}

export default function AdminDashboard() {
  const router = useRouter()
  const { token, user } = useAdmin()
  const [incidents, setIncidents] = useState<AdminIncident[] | null>(null)
  const [accounts, setAccounts] = useState<Account[]>([])
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<Date | null>(null)
  const [refreshing, setRefreshing] = useState(false)

  const load = useCallback(async () => {
    setRefreshing(true)
    try {
      const [list, accs] = await Promise.all([listAllIncidents(token), listAccounts(token)])
      setIncidents(list)
      setAccounts(accs.filter((a) => a.email !== user.email))
      setUpdatedAt(new Date())
      setError(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible de charger les statistiques.")
    } finally {
      setRefreshing(false)
    }
  }, [token, user.email])

  // Données en temps réel : rechargement automatique
  useEffect(() => {
    load()
    const timer = setInterval(load, REFRESH_MS)
    return () => clearInterval(timer)
  }, [load])

  const stats = useMemo(() => {
    const list = incidents ?? []
    const byStatus = (s: Status) => list.filter((i) => i.status === s).length
    const open = list.filter((i) => i.status !== "TERMINE")
    const weekAgo = Date.now() - 7 * 86400_000
    const days = Array.from({ length: 30 }, (_, k) => {
      const d = new Date()
      d.setHours(0, 0, 0, 0)
      d.setDate(d.getDate() - (29 - k))
      return d
    })
    const perDay = days.map((d) => ({
      date: d,
      value: list.filter((i) => {
        const c = parse(i.createdAt)
        return c.getFullYear() === d.getFullYear() && c.getMonth() === d.getMonth() && c.getDate() === d.getDate()
      }).length,
    }))
    return {
      total: list.length,
      open: open.length,
      critical: open.filter((i) => i.priority === "CRITIQUE").length,
      lastWeek: list.filter((i) => parse(i.createdAt).getTime() >= weekAgo).length,
      resolution: list.length ? Math.round((byStatus("TERMINE") / list.length) * 100) : 0,
      status: (Object.keys(STATUSES) as Status[]).map<Slice>((s) => ({ key: s, label: STATUSES[s].label, value: byStatus(s), color: STATUS_COLORS[s] })),
      priority: (Object.keys(PRIORITIES) as Priority[]).map<Slice>((p) => ({
        key: p,
        label: PRIORITIES[p].label,
        value: list.filter((i) => i.priority === p).length,
        color: PRIORITY_COLORS[p],
      })),
      categories: (Object.keys(CATEGORIES) as Category[])
        .map((c) => ({ key: c, label: CATEGORIES[c], value: list.filter((i) => i.category === c).length }))
        .sort((a, b) => b.value - a.value),
      perDay,
    }
  }, [incidents])

  const pending = useMemo(() => accounts.filter((a) => a.account_status === "PENDING"), [accounts])
  const byId = useMemo(() => Object.fromEntries(accounts.map((a) => [a.id, a])), [accounts])
  const notices = useMemo(() => buildNotices(incidents ?? [], byId, pending), [incidents, byId, pending])

  const goIncidents = (param: string, value: string) => router.push(`/support/admin/incidents?${param}=${value}`)

  if (error && !incidents) {
    return (
      <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-red-700">
        <AlertCircle className="h-5 w-5" /> {error}
      </p>
    )
  }

  if (!incidents) {
    return (
      <p className="flex items-center justify-center py-20 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement des statistiques...
      </p>
    )
  }

  const kpis = [
    { label: "Incidents ouverts", value: stats.open, icon: Inbox, color: "bg-primary", href: "/support/admin/incidents" },
    { label: "Critiques non résolus", value: stats.critical, icon: Flame, color: "bg-red-600", href: "/support/admin/incidents?priority=CRITIQUE" },
    { label: "Nouveaux (7 jours)", value: stats.lastWeek, icon: Clock, color: "bg-amber-500", href: "/support/admin/incidents" },
    { label: "Comptes à valider", value: pending.length, icon: Users, color: "bg-emerald-600", href: "/support/admin/accounts" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Tableau de bord</h1>
          <p className="mt-1 flex items-center gap-2 text-sm text-slate-500">
            <span className="relative flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
            Temps réel · mis à jour à {updatedAt?.toLocaleTimeString("fr-FR")}
          </p>
        </div>
        <button
          onClick={load}
          disabled={refreshing}
          className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 disabled:opacity-60"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </button>
      </div>

      {/* Indicateurs clés */}
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-4">
        {kpis.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5 text-white" />
              </span>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold tabular-nums text-slate-900">{value}</p>
            <p className="text-sm text-slate-600">{label}</p>
          </Link>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="min-w-0 space-y-6 xl:col-span-2">
          {/* Évolution */}
          <Card className="border-0 shadow-sm ring-1 ring-slate-200">
            <CardContent className="p-5 sm:p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h2 className="font-bold text-slate-900">Incidents déclarés · 30 derniers jours</h2>
                <span className="text-sm text-slate-500">{stats.perDay.reduce((s, p) => s + p.value, 0)} sur la période</span>
              </div>
              <div className="mt-4">
                <AreaTrend points={stats.perDay} />
              </div>
            </CardContent>
          </Card>

          {/* Répartitions */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="min-w-0 border-0 shadow-sm ring-1 ring-slate-200">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 font-bold text-slate-900">Par statut</h2>
                <Donut data={stats.status} centerLabel="incidents" onSelect={(s) => goIncidents("status", s)} />
              </CardContent>
            </Card>
            <Card className="min-w-0 border-0 shadow-sm ring-1 ring-slate-200">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 font-bold text-slate-900">Par priorité</h2>
                <Donut data={stats.priority} centerLabel="incidents" onSelect={(p) => goIncidents("priority", p)} />
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="min-w-0 border-0 shadow-sm ring-1 ring-slate-200">
              <CardContent className="p-5 sm:p-6">
                <h2 className="mb-5 font-bold text-slate-900">Par catégorie</h2>
                <HBars items={stats.categories} onSelect={(c) => goIncidents("category", c)} />
              </CardContent>
            </Card>
            <Card className="min-w-0 border-0 shadow-sm ring-1 ring-slate-200">
              <CardContent className="space-y-6 p-5 sm:p-6">
                <h2 className="font-bold text-slate-900">Performance</h2>
                <Gauge value={stats.resolution} label="Taux de résolution" sublabel={`${stats.status[2].value} incidents terminés sur ${stats.total}`} />
                <Gauge
                  value={accounts.length ? Math.round((accounts.filter((a) => a.account_status === "APPROVED").length / accounts.length) * 100) : 0}
                  label="Comptes clients validés"
                  sublabel={`${accounts.filter((a) => a.account_status === "APPROVED").length} validés sur ${accounts.length}`}
                  color="#2a78d6"
                />
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Dernières notifications */}
        <Card className="h-fit min-w-0 border-0 shadow-sm ring-1 ring-slate-200">
          <CardContent className="p-0">
            <div className="flex items-center gap-2 border-b border-slate-100 px-5 py-4">
              <Bell className="h-5 w-5 text-primary" />
              <h2 className="flex-1 font-bold text-slate-900">Dernières notifications</h2>
            </div>
            {notices.length === 0 ? (
              <p className="px-5 py-10 text-center text-sm text-slate-500">Aucune activité récente.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {notices.map((n) => (
                  <li key={n.id}>
                    <Link href={n.href} className="flex gap-3 px-5 py-4 transition-colors hover:bg-slate-50">
                      <span className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg ${n.tone}`}>
                        <n.icon className="h-4 w-4" />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="line-clamp-2 block text-sm font-semibold text-slate-900">{n.title}</span>
                        <span className="block truncate text-xs text-slate-500">{n.detail}</span>
                      </span>
                      <span className="whitespace-nowrap text-xs text-slate-400">{timeAgo(n.at)}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
            <div className="grid grid-cols-2 border-t border-slate-100 text-sm font-medium">
              <Link href="/support/admin/incidents" className="px-5 py-3 text-center text-primary hover:bg-slate-50">
                Tous les incidents
              </Link>
              <Link href="/support/admin/accounts" className="border-l border-slate-100 px-5 py-3 text-center text-primary hover:bg-slate-50">
                Comptes
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
