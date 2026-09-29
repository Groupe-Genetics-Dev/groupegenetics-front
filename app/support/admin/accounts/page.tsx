"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { AlertCircle, Check, Clock, Loader2, RefreshCw, Search, UserCheck, UserX, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useAdmin } from "@/components/support/admin-context"
import { ApiError } from "@/lib/auth"
import { approveAccount, listAccounts, rejectAccount, type Account, type AccountStatus } from "@/lib/admin"
import { cn } from "@/lib/utils"

type Filter = "ALL" | AccountStatus

const STATUS: Record<AccountStatus, { label: string; className: string }> = {
  PENDING: { label: "En attente", className: "bg-amber-50 text-amber-800 ring-amber-200" },
  APPROVED: { label: "Validé", className: "bg-emerald-50 text-emerald-800 ring-emerald-200" },
  REJECTED: { label: "Refusé", className: "bg-red-50 text-red-700 ring-red-200" },
}

const TABS: { key: Filter; label: string }[] = [
  { key: "PENDING", label: "En attente" },
  { key: "APPROVED", label: "Validés" },
  { key: "REJECTED", label: "Refusés" },
  { key: "ALL", label: "Tous" },
]

function formatDate(iso?: string | null) {
  return iso ? new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric" }) : "—"
}

export default function AccountsPage() {
  const { token, user, flash, refreshPending } = useAdmin()
  const [accounts, setAccounts] = useState<Account[] | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("PENDING")
  const [search, setSearch] = useState("")
  const [busyId, setBusyId] = useState<string | null>(null)
  const [refreshing, setRefreshing] = useState(false)
  const [rejecting, setRejecting] = useState<Account | null>(null)
  const [reason, setReason] = useState("")

  const load = useCallback(async () => {
    setRefreshing(true)
    try {
      setAccounts(await listAccounts(token))
      setError(null)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible de charger les comptes.")
    } finally {
      setRefreshing(false)
    }
  }, [token])

  useEffect(() => {
    load()
  }, [load])

  // Le compte administrateur connecté n'a pas à être validé ou refusé
  const clients = useMemo(() => (accounts ?? []).filter((a) => a.email !== user.email), [accounts, user.email])

  const counts = useMemo(
    () => ({
      ALL: clients.length,
      PENDING: clients.filter((a) => a.account_status === "PENDING").length,
      APPROVED: clients.filter((a) => a.account_status === "APPROVED").length,
      REJECTED: clients.filter((a) => a.account_status === "REJECTED").length,
    }),
    [clients],
  )

  const visible = useMemo(() => {
    const q = search.trim().toLowerCase()
    return clients.filter(
      (a) =>
        (filter === "ALL" || a.account_status === filter) &&
        (!q || [a.name, a.email, a.company ?? "", a.phone ?? ""].some((v) => v.toLowerCase().includes(q))),
    )
  }, [clients, filter, search])

  const replace = (updated: Account) => setAccounts((list) => (list ?? []).map((a) => (a.id === updated.id ? updated : a)))

  const approve = async (account: Account) => {
    setBusyId(account.id)
    try {
      replace(await approveAccount(token, account.id))
      refreshPending()
      flash(`Compte de ${account.name} validé : il a été informé par e-mail qu'il peut se connecter.`)
    } catch (err) {
      flash(err instanceof ApiError ? err.message : "La validation a échoué.", "error")
    } finally {
      setBusyId(null)
    }
  }

  const confirmReject = async () => {
    if (!rejecting) return
    const account = rejecting
    setBusyId(account.id)
    try {
      replace(await rejectAccount(token, account.id, reason.trim()))
      refreshPending()
      setRejecting(null)
      setReason("")
      flash(`Compte de ${account.name} refusé : il a été informé par e-mail.`)
    } catch (err) {
      flash(err instanceof ApiError ? err.message : "Le refus a échoué.", "error")
    } finally {
      setBusyId(null)
    }
  }

  const actions = (account: Account) => {
    const busy = busyId === account.id
    return (
      <div className="flex flex-wrap justify-end gap-2">
        {account.account_status !== "APPROVED" && (
          <Button size="sm" disabled={busy} onClick={() => approve(account)} className="gap-1 bg-emerald-600 text-white hover:bg-emerald-700">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
            Valider
          </Button>
        )}
        {account.account_status !== "REJECTED" && (
          <Button
            size="sm"
            variant="outline"
            disabled={busy}
            onClick={() => {
              setReason("")
              setRejecting(account)
            }}
            className="gap-1 border-red-200 text-red-700 hover:bg-red-50 hover:text-red-800"
          >
            <X className="h-4 w-4" />
            Refuser
          </Button>
        )}
      </div>
    )
  }

  const badge = (status: AccountStatus) => (
    <span className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium ring-1 ${STATUS[status].className}`}>
      {STATUS[status].label}
    </span>
  )

  const stats = [
    { key: "PENDING" as Filter, label: "En attente de validation", value: counts.PENDING, icon: Clock, color: "bg-amber-500" },
    { key: "APPROVED" as Filter, label: "Comptes validés", value: counts.APPROVED, icon: UserCheck, color: "bg-emerald-600" },
    { key: "REJECTED" as Filter, label: "Comptes refusés", value: counts.REJECTED, icon: UserX, color: "bg-red-600" },
    { key: "ALL" as Filter, label: "Total des comptes", value: counts.ALL, icon: Users, color: "bg-primary" },
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Gestion des comptes</h1>
          <p className="mt-1 text-slate-500">Validez ou refusez les demandes d&apos;accès à l&apos;espace support.</p>
        </div>
        <Button variant="outline" onClick={load} disabled={refreshing} className="gap-2">
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Actualiser
        </Button>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ key, label, value, icon: Icon, color }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-2xl bg-white p-5 text-left shadow-sm ring-1 transition hover:shadow-md ${filter === key ? "ring-2 ring-primary" : "ring-slate-200"}`}
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
          <div className="flex flex-col gap-3 border-b border-slate-100 p-4 sm:p-5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap gap-1 rounded-xl bg-slate-100 p-1">
              {TABS.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setFilter(tab.key)}
                  className={cn(
                    "rounded-lg px-3 py-1.5 text-sm font-medium transition",
                    filter === tab.key ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800",
                  )}
                >
                  {tab.label} <span className="ml-1 text-xs opacity-70">{counts[tab.key]}</span>
                </button>
              ))}
            </div>
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un client..."
                className="h-10 w-full rounded-lg border border-slate-200 pl-9 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
          </div>

          {error ? (
            <p className="flex items-center gap-2 px-6 py-10 text-red-700">
              <AlertCircle className="h-5 w-5" /> {error}
            </p>
          ) : accounts === null ? (
            <p className="flex items-center justify-center py-12 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement des comptes...
            </p>
          ) : visible.length === 0 ? (
            <p className="py-12 text-center text-slate-500">
              {filter === "PENDING" && !search ? "Aucune demande en attente de validation." : "Aucun compte ne correspond."}
            </p>
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                    <tr>
                      <th className="px-5 py-3 font-semibold">Client</th>
                      <th className="px-5 py-3 font-semibold">Entreprise</th>
                      <th className="px-5 py-3 font-semibold">Téléphone</th>
                      <th className="px-5 py-3 font-semibold">Inscription</th>
                      <th className="px-5 py-3 font-semibold">Statut</th>
                      <th className="px-5 py-3 text-right font-semibold">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {visible.map((a) => (
                      <tr key={a.id} className="hover:bg-slate-50/60">
                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-900">{a.name}</p>
                          <p className="text-slate-500">{a.email}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-700">{a.company || "—"}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">{a.phone || "—"}</td>
                        <td className="whitespace-nowrap px-5 py-4 text-slate-700">{formatDate(a.createdAt)}</td>
                        <td className="px-5 py-4">{badge(a.account_status)}</td>
                        <td className="px-5 py-4">{actions(a)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <ul className="divide-y divide-slate-100 md:hidden">
                {visible.map((a) => (
                  <li key={a.id} className="space-y-3 p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{a.name}</p>
                        <p className="break-all text-sm text-slate-500">{a.email}</p>
                      </div>
                      {badge(a.account_status)}
                    </div>
                    <p className="text-sm text-slate-500">
                      {a.company || "—"} · {a.phone || "—"} · inscrit le {formatDate(a.createdAt)}
                    </p>
                    {actions(a)}
                  </li>
                ))}
              </ul>
            </>
          )}
        </CardContent>
      </Card>

      <Dialog open={!!rejecting} onOpenChange={(open) => !open && setRejecting(null)}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-left">Refuser le compte de {rejecting?.name} ?</DialogTitle>
            <DialogDescription className="text-left">Le client sera informé par e-mail que sa demande n&apos;a pas été validée.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="reason">Motif (facultatif, inclus dans l&apos;e-mail)</Label>
            <Textarea id="reason" value={reason} onChange={(e) => setReason(e.target.value)} rows={3} placeholder="Entrer le motif du refus" />
          </div>
          <DialogFooter className="gap-2">
            <Button variant="outline" onClick={() => setRejecting(null)}>
              Annuler
            </Button>
            <Button onClick={confirmReject} disabled={busyId === rejecting?.id} className="bg-red-600 text-white hover:bg-red-700">
              {busyId === rejecting?.id && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Refuser le compte
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
