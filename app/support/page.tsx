"use client"

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import {
  AlertCircle,
  Building2,
  CheckCircle2,
  Clock,
  Inbox,
  Loader2,
  LogOut,
  Mail,
  Phone,
  Plus,
  RefreshCw,
  UserRound,
  Wrench,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ApiError, adminDashboardUrl, getMe, getToken, logout, type User } from "@/lib/auth"
import {
  CATEGORIES,
  PRIORITIES,
  STATUSES,
  createIncident,
  listIncidents,
  type Category,
  type Incident,
  type Priority,
  type Status,
} from "@/lib/incidents"

type Filter = "ALL" | Status

const selectClass =
  "mt-1 flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("fr-FR", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
}

// Espace client : accessible uniquement après connexion (les admins sont renvoyés vers leur tableau de bord)
export default function SupportHome() {
  const router = useRouter()
  const [token, setToken] = useState<string | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [incidents, setIncidents] = useState<Incident[] | null>(null)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [filter, setFilter] = useState<Filter>("ALL")
  const [refreshing, setRefreshing] = useState(false)
  const [formOpen, setFormOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [notice, setNotice] = useState<string | null>(null)

  const loadIncidents = useCallback(async (t: string) => {
    setRefreshing(true)
    try {
      setIncidents(await listIncidents(t))
      setLoadError(null)
    } catch (err) {
      setLoadError(err instanceof ApiError ? err.message : "Impossible de charger vos incidents.")
    } finally {
      setRefreshing(false)
    }
  }, [])

  useEffect(() => {
    const t = getToken()
    if (!t) {
      router.replace("/support/login")
      return
    }
    getMe(t)
      .then((me) => {
        if (me.role === "admin") {
          window.location.href = adminDashboardUrl(t, me.name)
          return
        }
        setToken(t)
        setUser(me)
        loadIncidents(t)
      })
      .catch(() => {
        logout()
        router.replace("/support/login")
      })
  }, [router, loadIncidents])

  const counts = useMemo(() => {
    const list = incidents ?? []
    return {
      ALL: list.length,
      EN_ATTENTE: list.filter((i) => i.status === "EN_ATTENTE").length,
      EN_TRAITEMENT: list.filter((i) => i.status === "EN_TRAITEMENT").length,
      TERMINE: list.filter((i) => i.status === "TERMINE").length,
    }
  }, [incidents])

  const visible = (incidents ?? []).filter((i) => filter === "ALL" || i.status === filter)

  const handleLogout = () => {
    logout()
    router.push("/support/login")
  }

  const handleCreate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!token) return
    const form = e.currentTarget
    const data = new FormData(form)
    setFormError(null)
    setSubmitting(true)
    try {
      const created = await createIncident(token, {
        title: String(data.get("title")).trim(),
        description: String(data.get("description")).trim(),
        priority: data.get("priority") as Priority,
        category: data.get("category") as Category,
      })
      setIncidents((list) => [created, ...(list ?? [])])
      setFilter("ALL")
      setFormOpen(false)
      form.reset()
      setNotice("Votre incident a bien été enregistré. Notre équipe support a été prévenue.")
    } catch (err) {
      setFormError(err instanceof ApiError ? err.message : "L'incident n'a pas pu être enregistré. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        Chargement de votre espace...
      </div>
    )
  }

  const stats = [
    { key: "ALL" as Filter, label: "Total", value: counts.ALL, icon: Inbox, color: "bg-primary" },
    { key: "EN_ATTENTE" as Filter, label: "En attente", value: counts.EN_ATTENTE, icon: Clock, color: "bg-amber-500" },
    { key: "EN_TRAITEMENT" as Filter, label: "En traitement", value: counts.EN_TRAITEMENT, icon: Wrench, color: "bg-blue-600" },
    { key: "TERMINE" as Filter, label: "Résolus", value: counts.TERMINE, icon: CheckCircle2, color: "bg-emerald-600" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <Link href="/" className="flex-shrink-0">
            <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <div className="flex items-center gap-3">
            <span className="hidden sm:block text-sm text-slate-600">
              Connecté en tant que <strong className="text-slate-900">{user.name}</strong>
            </span>
            <Button variant="outline" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Se déconnecter</span>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Bandeau d'accueil */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-genetics-dark-blue-700 to-genetics-dark-blue-950 p-6 sm:p-10 text-white">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-[18px] border-accent/30" />
          <div className="relative flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wider text-accent">Espace client</p>
              <h1 className="mt-2 text-3xl sm:text-4xl font-bold">Bonjour {user.name} 👋</h1>
              <p className="mt-3 max-w-2xl text-genetics-dark-blue-100">
                Déclarez vos incidents techniques et suivez leur traitement par notre équipe support.
              </p>
            </div>
            <Button
              size="lg"
              onClick={() => {
                setFormError(null)
                setFormOpen(true)
              }}
              className="bg-accent hover:bg-genetics-gold-600 text-white gap-2 self-start lg:self-auto"
            >
              <Plus className="h-5 w-5" />
              Déclarer un incident
            </Button>
          </div>
        </div>

        {notice && (
          <div role="status" className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-800">
            <CheckCircle2 className="h-5 w-5 mt-0.5 flex-shrink-0" />
            <p className="flex-1 text-sm">{notice}</p>
            <button onClick={() => setNotice(null)} className="text-sm font-medium hover:underline">
              Fermer
            </button>
          </div>
        )}

        {/* Statistiques (cliquables = filtres) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map(({ key, label, value, icon: Icon, color }) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-left rounded-2xl bg-white p-5 shadow-sm ring-1 transition hover:shadow-md ${
                filter === key ? "ring-2 ring-primary" : "ring-slate-200"
              }`}
            >
              <div className={`w-10 h-10 ${color} rounded-xl flex items-center justify-center`}>
                <Icon className="h-5 w-5 text-white" />
              </div>
              <p className="mt-4 text-3xl font-bold text-slate-900">{value}</p>
              <p className="text-sm text-slate-600">{label}</p>
            </button>
          ))}
        </div>

        {/* Liste des incidents */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-0">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-5 sm:px-6 py-4">
              <h2 className="text-lg font-bold text-slate-900">
                Mes incidents
                {filter !== "ALL" && <span className="ml-2 text-sm font-normal text-slate-500">· {STATUSES[filter].label}</span>}
              </h2>
              <div className="flex items-center gap-2">
                {filter !== "ALL" && (
                  <Button variant="ghost" size="sm" onClick={() => setFilter("ALL")} className="hover:bg-slate-100 hover:text-slate-900">
                    Tout afficher
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => token && loadIncidents(token)}
                  disabled={refreshing}
                  className="gap-2"
                >
                  <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                  Actualiser
                </Button>
              </div>
            </div>

            {loadError ? (
              <div className="flex items-center gap-3 px-6 py-10 text-red-700">
                <AlertCircle className="h-5 w-5" />
                {loadError}
              </div>
            ) : incidents === null ? (
              <div className="flex items-center justify-center px-6 py-12 text-slate-500">
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Chargement...
              </div>
            ) : visible.length === 0 ? (
              <div className="px-6 py-14 text-center">
                <div className="mx-auto w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center">
                  <Inbox className="h-7 w-7 text-slate-400" />
                </div>
                <p className="mt-4 font-semibold text-slate-900">
                  {incidents.length === 0 ? "Aucun incident déclaré pour le moment" : "Aucun incident dans cette catégorie"}
                </p>
                {incidents.length === 0 && (
                  <p className="mt-1 text-sm text-slate-500">Un problème ? Déclarez-le, notre équipe s&apos;en occupe.</p>
                )}
              </div>
            ) : (
              <ul className="divide-y divide-slate-100">
                {visible.map((incident) => {
                  const status = STATUSES[incident.status]
                  const priority = PRIORITIES[incident.priority]
                  return (
                    <li key={incident.id} className="px-5 sm:px-6 py-5 hover:bg-slate-50/60 transition-colors">
                      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                        <div className="min-w-0">
                          <h3 className="font-semibold text-slate-900 break-words">{incident.title}</h3>
                          <p className="mt-1 text-sm text-slate-600 line-clamp-2 break-words">{incident.description}</p>
                          <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                            <span className={`rounded-full px-2.5 py-1 font-medium ${priority.className}`}>
                              Priorité {priority.label.toLowerCase()}
                            </span>
                            <span className="rounded-full bg-slate-100 px-2.5 py-1 font-medium text-slate-700">
                              {CATEGORIES[incident.category]}
                            </span>
                            <span className="text-slate-500">Déclaré le {formatDate(incident.createdAt)}</span>
                          </div>
                        </div>
                        <span
                          className={`inline-flex items-center gap-2 self-start whitespace-nowrap rounded-full px-3 py-1 text-sm font-medium ring-1 ${status.className}`}
                        >
                          <span className={`h-2 w-2 rounded-full ${status.dot}`} />
                          {status.label}
                        </span>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </CardContent>
        </Card>

        {/* Compte */}
        <Card className="border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <UserRound className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Mon compte</h2>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {[
                { icon: Mail, label: "E-mail", value: user.email },
                { icon: Building2, label: "Entreprise", value: user.company || "—" },
                { icon: Phone, label: "Téléphone", value: user.phone || "—" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="rounded-xl bg-slate-50 p-4">
                  <dt className="flex items-center gap-2 text-sm text-slate-500">
                    <Icon className="h-4 w-4" />
                    {label}
                  </dt>
                  <dd className="mt-1 font-medium text-slate-900 break-all">{value}</dd>
                </div>
              ))}
            </dl>
          </CardContent>
        </Card>
      </main>

      {/* Formulaire : déclarer un incident */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-slate-900 text-left">Déclarer un incident</DialogTitle>
            <DialogDescription className="text-left">
              Décrivez le problème : notre équipe support est prévenue immédiatement.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-2">
            <div>
              <Label htmlFor="title" className="text-slate-900 font-medium">
                Titre
              </Label>
              <Input id="title" name="title" required maxLength={150} placeholder="Ex. : Plus d'accès internet au bureau" className="mt-1 h-10 bg-white" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="category" className="text-slate-900 font-medium">
                  Catégorie
                </Label>
                <select id="category" name="category" required defaultValue="RESEAU" className={selectClass}>
                  {Object.entries(CATEGORIES).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="priority" className="text-slate-900 font-medium">
                  Priorité
                </Label>
                <select id="priority" name="priority" required defaultValue="MOYENNE" className={selectClass}>
                  {Object.entries(PRIORITIES).map(([value, { label }]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <Label htmlFor="description" className="text-slate-900 font-medium">
                Description
              </Label>
              <Textarea
                id="description"
                name="description"
                required
                rows={5}
                placeholder="Que se passe-t-il ? Depuis quand ? Quels équipements sont concernés ?"
                className="mt-1 bg-white"
              />
            </div>
            {formError && (
              <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {formError}
              </p>
            )}
            <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
              <Button type="button" variant="outline" onClick={() => setFormOpen(false)}>
                Annuler
              </Button>
              <Button type="submit" disabled={submitting} className="bg-primary hover:bg-genetics-dark-blue-700">
                {submitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Envoyer l&apos;incident
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
