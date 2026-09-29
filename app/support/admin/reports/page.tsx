"use client"

import { useCallback, useEffect, useState, type FormEvent } from "react"
import { CalendarRange, Download, FileText, Loader2, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { useAdmin } from "@/components/support/admin-context"
import { ApiError } from "@/lib/auth"
import { downloadReport, generateReport, listReports, saveBlob } from "@/lib/admin"

const inputClass =
  "mt-1 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"

const iso = (d: Date) => d.toISOString().slice(0, 10)

const PRESETS = [
  {
    label: "Ce mois-ci",
    range: () => {
      const now = new Date()
      return [iso(new Date(now.getFullYear(), now.getMonth(), 1)), iso(now)]
    },
  },
  {
    label: "Mois dernier",
    range: () => {
      const now = new Date()
      return [iso(new Date(now.getFullYear(), now.getMonth() - 1, 1)), iso(new Date(now.getFullYear(), now.getMonth(), 0))]
    },
  },
  { label: "30 derniers jours", range: () => [iso(new Date(Date.now() - 29 * 86400000)), iso(new Date())] },
  { label: "Cette année", range: () => [`${new Date().getFullYear()}-01-01`, iso(new Date())] },
]

// "rapport_ceo_incidents_2025-07-11_to_2025-07-25.pdf" -> "11/07/2025 → 25/07/2025"
function reportLabel(filename: string) {
  const m = filename.match(/(\d{4}-\d{2}-\d{2})_to_(\d{4}-\d{2}-\d{2})/)
  const fr = (d: string) => d.split("-").reverse().join("/")
  return m ? `Du ${fr(m[1])} au ${fr(m[2])}` : filename
}

export default function ReportsPage() {
  const { token, flash } = useAdmin()
  const [[start, end], setRange] = useState<string[]>(PRESETS[0].range())
  const [generating, setGenerating] = useState(false)
  const [reports, setReports] = useState<string[] | null>(null)
  const [downloading, setDownloading] = useState<string | null>(null)

  const load = useCallback(async () => {
    try {
      setReports(await listReports(token))
    } catch (err) {
      flash(err instanceof ApiError ? err.message : "Impossible de charger les rapports.", "error")
      setReports([])
    }
  }, [token, flash])

  useEffect(() => {
    load()
  }, [load])

  const generate = async (e: FormEvent) => {
    e.preventDefault()
    if (start > end) {
      flash("La date de début doit précéder la date de fin.", "error")
      return
    }
    setGenerating(true)
    try {
      saveBlob(await generateReport(token, start, end), `rapport_ceo_incidents_${start}_to_${end}.pdf`)
      flash("Rapport généré et téléchargé.")
      load()
    } catch (err) {
      flash(err instanceof ApiError ? err.message : "Le rapport n'a pas pu être généré.", "error")
    } finally {
      setGenerating(false)
    }
  }

  const download = async (filename: string) => {
    setDownloading(filename)
    try {
      saveBlob(await downloadReport(token, filename), filename)
    } catch (err) {
      flash(err instanceof ApiError ? err.message : "Le rapport n'a pas pu être téléchargé.", "error")
    } finally {
      setDownloading(null)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Rapports</h1>
        <p className="mt-1 text-slate-500">Générez un rapport PDF des incidents (statistiques, graphiques, clients les plus actifs).</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="border-0 shadow-lg lg:col-span-2">
          <CardContent className="p-6">
            <h2 className="flex items-center gap-2 font-bold text-slate-900">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <CalendarRange className="h-4 w-4 text-white" />
              </span>
              Nouveau rapport
            </h2>
            <div className="mt-5 flex flex-wrap gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.label}
                  type="button"
                  onClick={() => setRange(p.range())}
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-700 transition hover:bg-primary/10 hover:text-primary"
                >
                  {p.label}
                </button>
              ))}
            </div>
            <form onSubmit={generate} className="mt-5 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-medium text-slate-800">
                  Du
                  <input type="date" required value={start} max={end} onChange={(e) => setRange([e.target.value, end])} className={inputClass} />
                </label>
                <label className="text-sm font-medium text-slate-800">
                  Au
                  <input type="date" required value={end} min={start} onChange={(e) => setRange([start, e.target.value])} className={inputClass} />
                </label>
              </div>
              <Button type="submit" disabled={generating} className="h-11 w-full gap-2 bg-primary hover:bg-genetics-dark-blue-700">
                {generating ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                Générer et télécharger le PDF
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg lg:col-span-3">
          <CardContent className="p-0">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <h2 className="font-bold text-slate-900">Rapports déjà générés</h2>
              <Button variant="ghost" size="sm" onClick={load} className="gap-2 hover:bg-slate-100 hover:text-slate-900">
                <RefreshCw className="h-4 w-4" /> Actualiser
              </Button>
            </div>
            {reports === null ? (
              <p className="flex items-center justify-center py-12 text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Chargement...
              </p>
            ) : reports.length === 0 ? (
              <p className="py-12 text-center text-slate-500">Aucun rapport généré pour le moment.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {reports.map((r) => (
                  <li key={r} className="flex items-center justify-between gap-3 px-6 py-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-red-50 text-red-600">
                        <FileText className="h-5 w-5" />
                      </span>
                      <div className="min-w-0">
                        <p className="font-medium text-slate-900">{reportLabel(r)}</p>
                        <p className="truncate text-xs text-slate-500">{r}</p>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => download(r)} disabled={downloading === r} className="gap-2">
                      {downloading === r ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
                      <span className="hidden sm:inline">Télécharger</span>
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
