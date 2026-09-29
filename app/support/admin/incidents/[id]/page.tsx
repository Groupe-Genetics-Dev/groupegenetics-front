"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useParams } from "next/navigation"
import { AlertCircle, ArrowLeft, Building2, CalendarClock, Loader2, Mail, Phone, RefreshCw, Tag, UserRound } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import StatusSelect from "@/components/support/StatusSelect"
import { useAdmin } from "@/components/support/admin-context"
import { ApiError } from "@/lib/auth"
import { listAccounts, listAllIncidents, updateIncidentStatus, type Account, type AdminIncident } from "@/lib/admin"
import { CATEGORIES, PRIORITIES, STATUSES, type Status } from "@/lib/incidents"

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("fr-FR", { dateStyle: "long", timeStyle: "short" })
}

export default function AdminIncidentPage() {
  const { id } = useParams<{ id: string }>()
  const { token, flash } = useAdmin()
  const [incident, setIncident] = useState<AdminIncident | null>(null)
  const [client, setClient] = useState<Account | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    Promise.all([listAllIncidents(token), listAccounts(token)])
      .then(([incidents, accounts]) => {
        const found = incidents.find((i) => i.id === id)
        if (!found) {
          setError("Incident introuvable.")
          return
        }
        setIncident(found)
        setClient(accounts.find((a) => a.id === found.userId) ?? null)
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "Impossible de charger l'incident."))
  }, [token, id])

  const changeStatus = async (next: Status) => {
    if (!incident || next === incident.status) return
    setBusy(true)
    try {
      setIncident(await updateIncidentStatus(token, incident.id, next))
      flash(next === "TERMINE" ? "Incident terminé : le client a été informé par e-mail." : `Statut mis à jour : ${STATUSES[next].label}.`)
    } catch (err) {
      flash(err instanceof ApiError ? err.message : "Le statut n'a pas pu être modifié.", "error")
    } finally {
      setBusy(false)
    }
  }

  const back = (
    <Link href="/support/admin" className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary">
      <ArrowLeft className="h-4 w-4" /> Retour au tableau de bord
    </Link>
  )

  if (error) {
    return (
      <div className="space-y-6">
        {back}
        <p className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-red-700">
          <AlertCircle className="h-5 w-5" /> {error}
        </p>
      </div>
    )
  }

  if (!incident) {
    return (
      <p className="flex items-center justify-center py-16 text-slate-500">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement de l&apos;incident...
      </p>
    )
  }

  const priority = PRIORITIES[incident.priority]

  return (
    <div className="space-y-6">
      {back}

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardContent className="space-y-6 p-6 sm:p-8">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <h1 className="text-2xl font-bold text-slate-900">{incident.title}</h1>
              <StatusSelect incident={incident} busy={busy} onChange={changeStatus} />
            </div>
            <div className="flex flex-wrap gap-2 text-xs">
              <span className={`rounded-full px-2.5 py-1 font-medium ${priority.className}`}>Priorité {priority.label.toLowerCase()}</span>
              <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                <Tag className="h-3 w-3" /> {CATEGORIES[incident.category]}
              </span>
            </div>
            <div>
              <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-400">Description</h2>
              <p className="mt-2 whitespace-pre-line break-words leading-relaxed text-slate-700">{incident.description}</p>
            </div>
            <dl className="grid gap-4 border-t border-slate-100 pt-6 sm:grid-cols-2">
              <div className="flex gap-3">
                <CalendarClock className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <dt className="text-sm text-slate-500">Déclaré le</dt>
                  <dd className="font-medium text-slate-900">{formatDate(incident.createdAt)}</dd>
                </div>
              </div>
              <div className="flex gap-3">
                <RefreshCw className="mt-0.5 h-5 w-5 text-slate-400" />
                <div>
                  <dt className="text-sm text-slate-500">Dernière mise à jour</dt>
                  <dd className="font-medium text-slate-900">{formatDate(incident.updatedAt)}</dd>
                </div>
              </div>
            </dl>
            {incident.status !== "TERMINE" && (
              <p className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-600">
                Passer l&apos;incident à <strong>Terminé</strong> envoie automatiquement un e-mail au client.
              </p>
            )}
          </CardContent>
        </Card>

        <Card className="h-fit border-0 shadow-lg">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <UserRound className="h-4 w-4 text-white" />
              </span>
              Client
            </h2>
            {client ? (
              <ul className="mt-5 space-y-4 text-sm">
                <li>
                  <p className="text-slate-500">Nom</p>
                  <p className="font-medium text-slate-900">{client.name}</p>
                </li>
                <li className="flex gap-2">
                  <Mail className="mt-0.5 h-4 w-4 text-slate-400" />
                  <a href={`mailto:${client.email}`} className="break-all font-medium text-primary hover:text-accent">
                    {client.email}
                  </a>
                </li>
                <li className="flex gap-2">
                  <Building2 className="mt-0.5 h-4 w-4 text-slate-400" />
                  <span className="text-slate-700">{client.company || "—"}</span>
                </li>
                <li className="flex gap-2">
                  <Phone className="mt-0.5 h-4 w-4 text-slate-400" />
                  {client.phone ? (
                    <a href={`tel:${client.phone.replace(/\s/g, "")}`} className="font-medium text-primary hover:text-accent">
                      {client.phone}
                    </a>
                  ) : (
                    <span className="text-slate-700">—</span>
                  )}
                </li>
              </ul>
            ) : (
              <p className="mt-4 text-sm text-slate-500">Informations client indisponibles.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
