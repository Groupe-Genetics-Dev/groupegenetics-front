"use client"

import { useEffect, useState } from "react"
import { AlertCircle, Inbox, Loader2, Plus, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import IncidentList from "@/components/support/IncidentList"
import { useClient } from "@/components/support/client-context"
import { STATUSES, type Status } from "@/lib/incidents"
import { cn } from "@/lib/utils"

type Filter = "ALL" | Status

// Liste complète des incidents du client, filtrable par statut
export default function ClientIncidents() {
  const { incidents, loadError, refreshing, reload, openCreate } = useClient()
  const [filter, setFilter] = useState<Filter>("ALL")

  // Filtre transmis depuis le tableau de bord (?status=EN_ATTENTE)
  useEffect(() => {
    const status = new URLSearchParams(window.location.search).get("status")
    if (status && status in STATUSES) setFilter(status as Status)
  }, [])

  const list = incidents ?? []
  const count = (f: Filter) => (f === "ALL" ? list.length : list.filter((i) => i.status === f).length)
  const visible = list.filter((i) => filter === "ALL" || i.status === filter)
  const filters: { key: Filter; label: string }[] = [
    { key: "ALL", label: "Tous" },
    ...(Object.keys(STATUSES) as Status[]).map((s) => ({ key: s, label: STATUSES[s].label })),
  ]

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Mes incidents</h1>
          <p className="mt-1 text-slate-500">Suivez l&apos;avancement de vos demandes auprès de notre équipe support.</p>
        </div>
        <Button onClick={openCreate} className="gap-2 bg-primary hover:bg-genetics-dark-blue-700">
          <Plus className="h-4 w-4" />
          Déclarer un incident
        </Button>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-0">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 sm:px-6 py-4">
            <div className="flex flex-wrap gap-2">
              {filters.map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
                    filter === key ? "bg-primary text-white" : "bg-slate-100 text-slate-700 hover:bg-slate-200",
                  )}
                >
                  {label} <span className="tabular-nums opacity-70">{count(key)}</span>
                </button>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={reload} disabled={refreshing} className="gap-2">
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
              Actualiser
            </Button>
          </div>

          {loadError ? (
            <p className="flex items-center gap-3 px-6 py-10 text-red-700">
              <AlertCircle className="h-5 w-5" /> {loadError}
            </p>
          ) : incidents === null ? (
            <p className="flex items-center justify-center px-6 py-12 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement...
            </p>
          ) : visible.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Inbox className="h-7 w-7 text-slate-400" />
              </div>
              <p className="mt-4 font-semibold text-slate-900">
                {list.length === 0 ? "Aucun incident déclaré pour le moment" : "Aucun incident avec ce statut"}
              </p>
            </div>
          ) : (
            <IncidentList incidents={visible} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
