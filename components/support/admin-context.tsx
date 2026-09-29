"use client"

import { createContext, useContext } from "react"
import type { User } from "@/lib/auth"

export type Flash = { id: number; message: string; tone: "success" | "error" }

type AdminContext = {
  token: string
  user: User
  flash: (message: string, tone?: Flash["tone"]) => void
  // Nombre de comptes en attente (badge du menu), à rafraîchir après une validation
  pendingAccounts: number
  refreshPending: () => void
  // À appeler quand l'API répond 401/403 : session expirée ou droits retirés
  signOut: () => void
}

export const AdminCtx = createContext<AdminContext | null>(null)

export function useAdmin() {
  const ctx = useContext(AdminCtx)
  if (!ctx) throw new Error("useAdmin doit être utilisé dans l'espace administrateur")
  return ctx
}
