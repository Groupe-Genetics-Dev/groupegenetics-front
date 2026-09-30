"use client"

import { createContext, useContext } from "react"
import type { User } from "@/lib/auth"
import type { Incident } from "@/lib/incidents"
import type { Flash } from "@/components/support/PortalShell"

type ClientContext = {
  token: string
  user: User
  // Incidents du client, partagés entre le tableau de bord et la liste (null = chargement)
  incidents: Incident[] | null
  loadError: string | null
  refreshing: boolean
  reload: () => void
  // Ouvre le formulaire "Déclarer un incident"
  openCreate: () => void
  flash: (message: string, tone?: Flash["tone"]) => void
}

export const ClientCtx = createContext<ClientContext | null>(null)

export function useClient() {
  const ctx = useContext(ClientCtx)
  if (!ctx) throw new Error("useClient doit être utilisé dans l'espace client")
  return ctx
}
