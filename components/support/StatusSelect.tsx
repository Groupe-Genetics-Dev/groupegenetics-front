"use client"

import { ChevronRight, Loader2 } from "lucide-react"
import type { AdminIncident } from "@/lib/admin"
import { STATUSES, type Status } from "@/lib/incidents"

// Sélecteur de statut coloré utilisé par l'administrateur
export default function StatusSelect({ incident, busy, onChange }: { incident: AdminIncident; busy: boolean; onChange: (s: Status) => void }) {
  const status = STATUSES[incident.status]
  return (
    <div className="relative inline-flex items-center">
      <span className={`pointer-events-none absolute left-3 h-2 w-2 rounded-full ${status.dot}`} />
      <select
        aria-label={`Statut de ${incident.title}`}
        value={incident.status}
        disabled={busy}
        onChange={(e) => onChange(e.target.value as Status)}
        className={`h-9 cursor-pointer appearance-none rounded-full py-0 pl-7 pr-8 text-sm font-medium ring-1 focus:outline-none focus:ring-2 disabled:opacity-60 ${status.className}`}
      >
        {Object.entries(STATUSES).map(([value, { label }]) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
      {busy ? (
        <Loader2 className="pointer-events-none absolute right-2.5 h-4 w-4 animate-spin" />
      ) : (
        <ChevronRight className="pointer-events-none absolute right-2.5 h-4 w-4 rotate-90 opacity-60" />
      )}
    </div>
  )
}
