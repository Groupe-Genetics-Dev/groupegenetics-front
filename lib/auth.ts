// Connexion au backend groupegenetics-api pour l'espace support

import { ADMIN_URL, API_URL } from "./config"

const TOKEN_KEY = "genetics_token"

export type Role = "admin" | "client"

export type User = {
  id: string
  name: string
  email: string
  company?: string | null
  phone?: string | null
  createdAt: string
  account_status: "PENDING" | "APPROVED" | "REJECTED"
  role: Role
}

export type RegisterData = {
  name: string
  email: string
  password: string
  company?: string
  phone?: string
}

export class ApiError extends Error {}

// Traduit les erreurs FastAPI ({ detail: "..." } ou liste de validation) en message lisible
export async function errorMessage(res: Response, fallback: string) {
  try {
    const body = await res.json()
    if (typeof body.detail === "string") return body.detail
    if (Array.isArray(body.detail) && body.detail.some((d: { loc?: string[] }) => d.loc?.includes("email"))) {
      return "Adresse e-mail invalide."
    }
  } catch {}
  return fallback
}

export async function request(path: string, init: RequestInit) {
  try {
    return await fetch(`${API_URL}${path}`, init)
  } catch {
    throw new ApiError("Impossible de joindre le serveur. Vérifiez votre connexion et réessayez.")
  }
}

export async function login(email: string, password: string) {
  // L'API attend un formulaire OAuth2 (username = e-mail)
  const res = await request("/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ username: email, password }),
  })
  if (!res.ok) {
    const message = await errorMessage(res, "La connexion a échoué. Réessayez.")
    // 403 "Invalid Credentials" = mauvais identifiants ; sinon compte en attente de validation ou refusé
    throw new ApiError(message === "Invalid Credentials" ? "E-mail ou mot de passe incorrect." : message)
  }
  const data: { access_token: string; user_name: string; role: Role } = await res.json()
  saveToken(data.access_token)
  return data
}

export async function register(data: RegisterData) {
  const res = await request("/users/create-user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...data,
      company: data.company || null,
      phone: data.phone || null,
    }),
  })
  if (!res.ok) throw new ApiError(await errorMessage(res, "La création du compte a échoué. Réessayez."))
  return (await res.json()) as Omit<User, "role">
}

export async function getMe(token: string) {
  const res = await request("/users/me", { headers: { Authorization: `Bearer ${token}` } })
  if (res.status === 401) throw new ApiError("Session expirée. Reconnectez-vous.")
  if (!res.ok) throw new ApiError(await errorMessage(res, "Impossible de charger votre compte."))
  return (await res.json()) as User
}

// Les administrateurs passent sur le tableau de bord (autre application) avec leur session
export function adminDashboardUrl(token: string, name: string) {
  return `${ADMIN_URL}/auth/callback#${new URLSearchParams({ token, name })}`
}

export function saveToken(token: string) {
  try {
    localStorage.setItem(TOKEN_KEY, token)
  } catch {}
}

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function logout() {
  try {
    localStorage.removeItem(TOKEN_KEY)
  } catch {}
}
