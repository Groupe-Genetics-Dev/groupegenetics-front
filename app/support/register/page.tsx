"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Eye, EyeOff, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AuthLayout from "@/components/support/AuthLayout"
import { ApiError, login, register } from "@/lib/auth"

const MIN_PASSWORD = 8

export default function RegisterPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (key: string) => String(data.get(key) || "").trim()
    const password = String(data.get("password") || "")

    if (password.length < MIN_PASSWORD) {
      setError(`Le mot de passe doit contenir au moins ${MIN_PASSWORD} caractères.`)
      return
    }
    if (password !== String(data.get("confirm") || "")) {
      setError("Les deux mots de passe ne correspondent pas.")
      return
    }

    setError(null)
    setLoading(true)
    try {
      await register({
        name: get("name"),
        email: get("email"),
        company: get("company"),
        phone: get("phone"),
        password,
      })
      // Compte créé : connexion automatique puis accès à l'espace support
      await login(get("email"), password)
      router.push("/support")
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "La création du compte a échoué. Réessayez.")
      setLoading(false)
    }
  }

  return (
    <AuthLayout title="Créer un compte" subtitle="Rejoignez l'espace support Genetics en moins d'une minute.">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="name" className="text-slate-900 font-medium">
            Nom complet
          </Label>
          <Input id="name" name="name" autoComplete="name" required placeholder="Votre nom" className="mt-1 h-11 bg-white" />
        </div>
        <div>
          <Label htmlFor="email" className="text-slate-900 font-medium">
            Adresse e-mail
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="votre@email.com"
            className="mt-1 h-11 bg-white"
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <Label htmlFor="company" className="text-slate-900 font-medium">
              Entreprise <span className="font-normal text-slate-500">(facultatif)</span>
            </Label>
            <Input id="company" name="company" autoComplete="organization" placeholder="Votre entreprise" className="mt-1 h-11 bg-white" />
          </div>
          <div>
            <Label htmlFor="phone" className="text-slate-900 font-medium">
              Téléphone <span className="font-normal text-slate-500">(facultatif)</span>
            </Label>
            <Input id="phone" name="phone" type="tel" autoComplete="tel" placeholder="+221 XX XXX XX XX" className="mt-1 h-11 bg-white" />
          </div>
        </div>
        <div>
          <Label htmlFor="password" className="text-slate-900 font-medium">
            Mot de passe
          </Label>
          <div className="relative mt-1">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={MIN_PASSWORD}
              placeholder={`${MIN_PASSWORD} caractères minimum`}
              className="h-11 bg-white pr-11"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-slate-500 hover:text-primary"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <Label htmlFor="confirm" className="text-slate-900 font-medium">
            Confirmer le mot de passe
          </Label>
          <Input
            id="confirm"
            name="confirm"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            required
            placeholder="Retapez le mot de passe"
            className="mt-1 h-11 bg-white"
          />
        </div>

        {error && (
          <p role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </p>
        )}

        <Button
          type="submit"
          disabled={loading}
          className="w-full h-11 bg-primary hover:bg-genetics-dark-blue-700 text-base"
        >
          {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Créer mon compte
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-600">
        Déjà un compte ?{" "}
        <Link href="/support/login" className="font-semibold text-primary hover:text-accent transition-colors">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  )
}
