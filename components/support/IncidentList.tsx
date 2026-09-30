import { CATEGORIES, PRIORITIES, STATUSES, type Incident } from "@/lib/incidents"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

// Liste des incidents d'un client (titre, description, priorité, catégorie, statut)
export default function IncidentList({ incidents }: { incidents: Incident[] }) {
  return (
    <ul className="divide-y divide-slate-100">
      {incidents.map((incident) => {
        const status = STATUSES[incident.status]
        const priority = PRIORITIES[incident.priority]
        return (
          <li key={incident.id} className="px-5 sm:px-6 py-5 hover:bg-slate-50/60 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="min-w-0">
                <h3 className="font-semibold text-slate-900 break-words">{incident.title}</h3>
                <p className="mt-1 text-sm text-slate-600 line-clamp-2 break-words">{incident.description}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className={`rounded-full px-2.5 py-1 font-medium ${priority.className}`}>Priorité {priority.label.toLowerCase()}</span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">{CATEGORIES[incident.category]}</span>
                  <span className="text-slate-500">Déclaré le {formatDate(incident.createdAt)}</span>
                </div>
              </div>
              <span className={`inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ring-1 ${status.className}`}>
                <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                {status.label}
              </span>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
