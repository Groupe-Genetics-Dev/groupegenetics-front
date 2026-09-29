"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { ArrowRight, Loader2, Lock, Mail } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/components/support/AuthLayout"
import { FormAlert, PasswordField, TextField, isEmail } from "@/components/support/fields"
import { ApiError, homeFor, login } from "@/lib/auth"

type Errors = { email?: string; password?: string }

export default function LoginPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const email = String(data.get("email") || "").trim()
    const password = String(data.get("password") || "")

    const fieldErrors: Errors = {}
    if (!email) fieldErrors.email = "Saisissez votre adresse e-mail."
    else if (!isEmail(email)) fieldErrors.email = "Cette adresse e-mail n'est pas valide."
    if (!password) fieldErrors.password = "Saisissez votre mot de passe."
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) return

    setError(null)
    setLoading(true)
    try {
      const session = await login(email, password)
      router.push(homeFor(session.role))
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "La connexion a échoué. Réessayez.")
      setLoading(false)
    }
  }

  return (
    <AuthLayout mode="login" title="Se connecter" subtitle="Connectez-vous pour accéder à votre espace support.">
      <form onSubmit={handleSubmit} noValidate className="space-y-5">
        <TextField
          id="email"
          name="email"
          type="email"
          label="Adresse e-mail"
          icon={Mail}
          autoComplete="email"
          placeholder="Entrer votre adresse e-mail"
          error={errors.email}
          onChange={() => errors.email && setErrors((e) => ({ ...e, email: undefined }))}
        />
        <PasswordField
          id="password"
          name="password"
          label="Mot de passe"
          icon={Lock}
          autoComplete="current-password"
          placeholder="Entrer votre mot de passe"
          error={errors.password}
          onChange={() => errors.password && setErrors((e) => ({ ...e, password: undefined }))}
        />

        {error && <FormAlert>{error}</FormAlert>}

        <Button
          type="submit"
          disabled={loading}
          className="group h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-lg shadow-primary/20 hover:bg-genetics-dark-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Connexion en cours...
            </>
          ) : (
            <>
              Se connecter
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Pas encore de compte ?{" "}
        <Link href="/support/register" className="font-semibold text-primary hover:text-accent">
          Créer un compte
        </Link>
      </p>
    </AuthLayout>
  )
}
