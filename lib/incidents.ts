// Incidents du client connecté (API groupegenetics-api, routes /incidents)

import { ApiError, errorMessage, request } from "./auth"

export type Priority = "FAIBLE" | "MOYENNE" | "HAUTE" | "CRITIQUE"
export type Category = "RESEAU" | "SECURITE" | "LOGICIEL" | "MATERIEL" | "ACCES" | "SURVEILLANCE" | "AUTRE"
export type Status = "EN_ATTENTE" | "EN_TRAITEMENT" | "TERMINE"

export type Incident = {
  id: string
  title: string
  description: string
  priority: Priority
  category: Category
  status: Status
  createdAt: string
  updatedAt: string
}

export type NewIncident = Pick<Incident, "title" | "description" | "priority" | "category">

export const PRIORITIES: Record<Priority, { label: string; className: string }> = {
  FAIBLE: { label: "Faible", className: "bg-slate-100 text-slate-700" },
  MOYENNE: { label: "Moyenne", className: "bg-sky-100 text-sky-800" },
  HAUTE: { label: "Haute", className: "bg-orange-100 text-orange-800" },
  CRITIQUE: { label: "Critique", className: "bg-red-100 text-red-700" },
}

export const CATEGORIES: Record<Category, string> = {
  RESEAU: "Réseau",
  SECURITE: "Sécurité",
  LOGICIEL: "Logiciel",
  MATERIEL: "Matériel",
  ACCES: "Accès",
  SURVEILLANCE: "Surveillance",
  AUTRE: "Autre",
}

export const STATUSES: Record<Status, { label: string; className: string; dot: string }> = {
  EN_ATTENTE: { label: "En attente", className: "bg-amber-50 text-amber-800 ring-amber-200", dot: "bg-amber-500" },
  EN_TRAITEMENT: { label: "En traitement", className: "bg-blue-50 text-blue-800 ring-blue-200", dot: "bg-blue-500" },
  TERMINE: { label: "Terminé", className: "bg-emerald-50 text-emerald-800 ring-emerald-200", dot: "bg-emerald-500" },
}

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

export async function listIncidents(token: string) {
  const res = await request("/incidents/list-incidents", { headers: auth(token) })
  if (!res.ok) throw new ApiError(await errorMessage(res, "Impossible de charger vos incidents."))
  const incidents = (await res.json()) as Incident[]
  return incidents.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function createIncident(token: string, incident: NewIncident) {
  const res = await request("/incidents/create-incident", {
    method: "POST",
    headers: { ...auth(token), "Content-Type": "application/json" },
    body: JSON.stringify(incident),
  })
  if (!res.ok) throw new ApiError(await errorMessage(res, "L'incident n'a pas pu être enregistré. Réessayez."))
  return (await res.json()) as Incident
}
