"use client"

import Link from "next/link"
import { AlertCircle, ArrowRight, CheckCircle2, Clock, Inbox, Loader2, Plus, Wrench } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import IncidentList from "@/components/support/IncidentList"
import { useClient } from "@/components/support/client-context"

// Tableau de bord du client : accueil, chiffres clés et derniers incidents
export default function ClientDashboard() {
  const { user, incidents, loadError, openCreate } = useClient()

  const list = incidents ?? []
  const stats = [
    { label: "Total", value: list.length, icon: Inbox, color: "bg-primary", href: "/support/incidents" },
    { label: "En attente", value: list.filter((i) => i.status === "EN_ATTENTE").length, icon: Clock, color: "bg-amber-500", href: "/support/incidents?status=EN_ATTENTE" },
    { label: "En traitement", value: list.filter((i) => i.status === "EN_TRAITEMENT").length, icon: Wrench, color: "bg-blue-600", href: "/support/incidents?status=EN_TRAITEMENT" },
    { label: "Résolus", value: list.filter((i) => i.status === "TERMINE").length, icon: CheckCircle2, color: "bg-emerald-600", href: "/support/incidents?status=TERMINE" },
  ]

  return (
    <div className="space-y-6">
      {/* Bandeau d'accueil */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-genetics-dark-blue-700 to-genetics-dark-blue-950 p-6 sm:p-10 text-white">
        <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-[18px] border-accent/30" />
        <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-accent">Espace client</p>
            <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Bonjour {user.name} 👋</h1>
            <p className="mt-3 max-w-2xl text-genetics-dark-blue-100">Déclarez vos incidents techniques et suivez leur traitement par notre équipe support.</p>
          </div>
          <Button size="lg" onClick={openCreate} className="bg-accent hover:bg-genetics-gold-600 text-white gap-2 self-start lg:self-auto">
            <Plus className="h-5 w-5" />
            Déclarer un incident
          </Button>
        </div>
      </div>

      {/* Chiffres clés */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color, href }) => (
          <Link key={label} href={href} className="group rounded-2xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:shadow-md">
            <div className="flex items-center justify-between">
              <span className={`flex h-10 w-10 items-center justify-center rounded-xl ${color}`}>
                <Icon className="h-5 w-5 text-white" />
              </span>
              <ArrowRight className="h-4 w-4 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-primary" />
            </div>
            <p className="mt-4 text-3xl font-bold tabular-nums text-slate-900">{incidents ? value : "–"}</p>
            <p className="text-sm text-slate-600">{label}</p>
          </Link>
        ))}
      </div>

      {/* Derniers incidents */}
      <Card className="border-0 shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-0">
          <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-5 sm:px-6 py-4">
            <h2 className="text-lg font-bold text-slate-900">Derniers incidents</h2>
            <Link href="/support/incidents" className="text-sm font-medium text-primary hover:text-accent">
              Voir tout
            </Link>
          </div>
          {loadError ? (
            <p className="flex items-center gap-3 px-6 py-10 text-red-700">
              <AlertCircle className="h-5 w-5" /> {loadError}
            </p>
          ) : incidents === null ? (
            <p className="flex items-center justify-center px-6 py-12 text-slate-500">
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement...
            </p>
          ) : incidents.length === 0 ? (
            <div className="px-6 py-14 text-center">
              <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                <Inbox className="h-7 w-7 text-slate-400" />
              </div>
              <p className="mt-4 font-semibold text-slate-900">Aucun incident déclaré pour le moment</p>
              <p className="mt-1 text-sm text-slate-500">Un problème ? Déclarez-le, notre équipe s&apos;en occupe.</p>
            </div>
          ) : (
            <IncidentList incidents={incidents.slice(0, 5)} />
          )}
        </CardContent>
      </Card>
    </div>
  )
}
