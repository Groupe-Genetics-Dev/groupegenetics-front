"use client"

import { useState, type FormEvent } from "react"
import { Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { ApiError } from "@/lib/auth"
import { CATEGORIES, PRIORITIES, createIncident, type Category, type Incident, type Priority } from "@/lib/incidents"

const selectClass =
  "mt-1 flex h-10 w-full rounded-md border border-input bg-white px-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"

// Formulaire "Déclarer un incident" (fenêtre modale)
export default function IncidentForm({
  token,
  open,
  onOpenChange,
  onCreated,
}: {
  token: string
  open: boolean
  onOpenChange: (open: boolean) => void
  onCreated: (incident: Incident) => void
}) {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    setError(null)
    setSubmitting(true)
    try {
      const created = await createIncident(token, {
        title: String(data.get("title")).trim(),
        description: String(data.get("description")).trim(),
        priority: data.get("priority") as Priority,
        category: data.get("category") as Category,
      })
      form.reset()
      onCreated(created)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "L'incident n'a pas pu être enregistré. Réessayez.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        if (next) setError(null)
        onOpenChange(next)
      }}
    >
      <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[560px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-slate-900 text-left">Déclarer un incident</DialogTitle>
          <DialogDescription className="text-left">Décrivez le problème : notre équipe support est prévenue immédiatement.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div>
            <Label htmlFor="title" className="text-slate-900 font-medium">
              Titre
            </Label>
            <Input id="title" name="title" required maxLength={150} placeholder="Entrer le titre de l'incident" className="mt-1 h-10 bg-white" />
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
              placeholder="Entrer la description du problème (depuis quand, équipements concernés...)"
              className="mt-1 bg-white"
            />
          </div>
          {error && (
            <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </p>
          )}
          <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
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
  )
}
