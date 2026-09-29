// Appels API réservés aux administrateurs (incidents de tous les clients, comptes, rapports)

import { ApiError, errorMessage, request, type User } from "./auth"
import type { Incident, Status } from "./incidents"

export type AccountStatus = User["account_status"]
export type Account = Omit<User, "role"> & { updatedAt: string; reviewedAt?: string | null }
export type AdminIncident = Incident & { userId: string }

const auth = (token: string) => ({ Authorization: `Bearer ${token}` })

async function json<T>(res: Response, fallback: string): Promise<T> {
  if (!res.ok) throw new ApiError(await errorMessage(res, fallback))
  return (await res.json()) as T
}

// ----- Incidents -----

export async function listAllIncidents(token: string) {
  const res = await request("/incidents/all-incidents", { headers: auth(token) })
  const incidents = await json<AdminIncident[]>(res, "Impossible de charger les incidents.")
  return incidents.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
}

export async function updateIncidentStatus(token: string, id: string, status: Status) {
  const res = await request(`/incidents/update-status/${id}`, {
    method: "PATCH",
    headers: { ...auth(token), "Content-Type": "application/json" },
    body: JSON.stringify({ status }),
  })
  return json<AdminIncident>(res, "Le statut n'a pas pu être modifié.")
}

// ----- Comptes clients -----

export async function listAccounts(token: string) {
  const res = await request("/users/accounts", { headers: auth(token) })
  return json<Account[]>(res, "Impossible de charger les comptes.")
}

export async function approveAccount(token: string, id: string) {
  const res = await request(`/users/accounts/${id}/approve`, { method: "PATCH", headers: auth(token) })
  return json<Account>(res, "La validation a échoué.")
}

export async function rejectAccount(token: string, id: string, reason?: string) {
  const res = await request(`/users/accounts/${id}/reject`, {
    method: "PATCH",
    headers: { ...auth(token), "Content-Type": "application/json" },
    body: JSON.stringify({ reason: reason || null }),
  })
  return json<Account>(res, "Le refus a échoué.")
}

// ----- Rapports PDF -----

async function blob(res: Response, fallback: string) {
  if (!res.ok) throw new ApiError(await errorMessage(res, fallback))
  return res.blob()
}

export async function generateReport(token: string, startDate: string, endDate: string) {
  const res = await request("/incidents/report-ceo", {
    method: "POST",
    headers: { ...auth(token), "Content-Type": "application/json" },
    body: JSON.stringify({ start_date: startDate, end_date: endDate }),
  })
  return blob(res, "Le rapport n'a pas pu être généré.")
}

export async function listReports(token: string) {
  const res = await request("/incidents/list-reports", { headers: auth(token) })
  const data = await json<{ reports: string[] }>(res, "Impossible de charger les rapports.")
  return data.reports.sort().reverse()
}

export async function downloadReport(token: string, filename: string) {
  const res = await request(`/incidents/download-report/${encodeURIComponent(filename)}`, { headers: auth(token) })
  return blob(res, "Le rapport n'a pas pu être téléchargé.")
}

export function saveBlob(data: Blob, filename: string) {
  const url = URL.createObjectURL(data)
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}
