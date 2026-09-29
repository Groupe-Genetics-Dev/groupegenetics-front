"use client"

import { useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, Building2, CheckCircle2, Loader2, Lock, Mail, MailCheck, Phone, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import AuthLayout from "@/components/support/AuthLayout"
import { FormAlert, PASSWORD_RULES, PasswordField, PasswordStrength, TextField, isEmail } from "@/components/support/fields"
import { ApiError, register } from "@/lib/auth"

type Field = "name" | "email" | "phone" | "password" | "confirm" | "terms"
type Errors = Partial<Record<Field, string>>

function validate(values: Record<Field, string>, accepted: boolean): Errors {
  const errors: Errors = {}
  if (values.name.length < 2) errors.name = "Indiquez votre nom complet."
  if (!values.email) errors.email = "Saisissez votre adresse e-mail."
  else if (!isEmail(values.email)) errors.email = "Cette adresse e-mail n'est pas valide."
  if (values.phone && !/^\+?[\d\s().-]{8,}$/.test(values.phone)) errors.phone = "Numéro de téléphone invalide."
  if (!values.password) errors.password = "Choisissez un mot de passe."
  else if (!PASSWORD_RULES[0].test(values.password)) errors.password = "Le mot de passe doit contenir au moins 8 caractères."
  if (!values.confirm) errors.confirm = "Confirmez votre mot de passe."
  else if (values.confirm !== values.password) errors.confirm = "Les deux mots de passe ne correspondent pas."
  if (!accepted) errors.terms = "Vous devez accepter l'utilisation de vos données pour continuer."
  return errors
}

export default function RegisterPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [errors, setErrors] = useState<Errors>({})
  const [password, setPassword] = useState("")
  const [confirm, setConfirm] = useState("")
  const [accepted, setAccepted] = useState(false)
  const [pendingEmail, setPendingEmail] = useState<string | null>(null)

  const clear = (field: Field) => errors[field] && setErrors((e) => ({ ...e, [field]: undefined }))

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const get = (key: string) => String(data.get(key) || "").trim()
    const values = { name: get("name"), email: get("email"), phone: get("phone"), password, confirm, terms: "" }

    const fieldErrors = validate(values, accepted)
    setErrors(fieldErrors)
    if (Object.keys(fieldErrors).length) {
      document.getElementById(Object.keys(fieldErrors)[0])?.focus()
      return
    }

    setError(null)
    setLoading(true)
    try {
      const account = await register({
        name: values.name,
        email: values.email,
        company: get("company"),
        phone: values.phone,
        password,
      })
      setPendingEmail(account.email)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "La création du compte a échoué. Réessayez.")
    } finally {
      setLoading(false)
    }
  }

  if (pendingEmail) {
    return (
      <AuthLayout title="Demande envoyée !" subtitle="Votre compte a bien été créé.">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 ring-8 ring-emerald-50/50">
            <MailCheck className="h-8 w-8 text-emerald-600" />
          </div>
          <h2 className="mt-6 text-xl font-bold text-slate-900">Compte en cours de validation</h2>
          <p className="mt-3 text-slate-600">
            Notre équipe va vérifier votre demande. Vous recevrez un e-mail à{" "}
            <strong className="break-all text-slate-900">{pendingEmail}</strong> dès que votre compte sera activé.
          </p>
        </div>
        <ol className="mt-8 space-y-3 rounded-2xl bg-slate-50 p-5 text-sm">
          {[
            { done: true, text: "Compte créé et e-mail de confirmation envoyé" },
            { done: false, text: "Validation par l'équipe Genetics" },
            { done: false, text: "Connexion à votre espace support" },
          ].map((step, i) => (
            <li key={step.text} className="flex items-center gap-3">
              <span
                className={`flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                  step.done ? "bg-emerald-500 text-white" : "bg-white text-slate-500 ring-1 ring-slate-200"
                }`}
              >
                {step.done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </span>
              <span className={step.done ? "font-medium text-slate-900" : "text-slate-600"}>{step.text}</span>
            </li>
          ))}
        </ol>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button asChild variant="outline" className="h-12 flex-1 rounded-xl">
            <Link href="/">Retour au site</Link>
          </Button>
          <Button asChild className="h-12 flex-1 rounded-xl bg-primary hover:bg-genetics-dark-blue-700">
            <Link href="/support/login">Page de connexion</Link>
          </Button>
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout mode="register" title="Créer votre compte" subtitle="Rejoignez l'espace support Genetics en moins d'une minute.">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <fieldset className="space-y-4">
          <legend className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Vos informations</legend>
          <TextField
            id="name"
            name="name"
            label="Nom complet"
            icon={UserRound}
            autoComplete="name"
            placeholder="Prénom et nom"
            error={errors.name}
            onChange={() => clear("name")}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Adresse e-mail professionnelle"
            icon={Mail}
            autoComplete="email"
            placeholder="vous@entreprise.com"
            error={errors.email}
            onChange={() => clear("email")}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <TextField id="company" name="company" label="Entreprise" icon={Building2} autoComplete="organization" placeholder="Nom de l'entreprise" optional />
            <TextField
              id="phone"
              name="phone"
              type="tel"
              label="Téléphone"
              icon={Phone}
              autoComplete="tel"
              placeholder="+221 77 000 00 00"
              optional
              error={errors.phone}
              onChange={() => clear("phone")}
            />
          </div>
        </fieldset>

        <fieldset className="space-y-4">
          <legend className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">Sécurité</legend>
          <div>
            <PasswordField
              id="password"
              name="password"
              label="Mot de passe"
              icon={Lock}
              autoComplete="new-password"
              placeholder="Choisissez un mot de passe"
              value={password}
              error={errors.password}
              onChange={(e) => {
                setPassword(e.target.value)
                clear("password")
              }}
            />
            <PasswordStrength password={password} />
          </div>
          <PasswordField
            id="confirm"
            name="confirm"
            label="Confirmer le mot de passe"
            icon={Lock}
            autoComplete="new-password"
            placeholder="Retapez le mot de passe"
            value={confirm}
            error={errors.confirm}
            hint={confirm && confirm === password ? "✓ Les mots de passe correspondent" : undefined}
            onChange={(e) => {
              setConfirm(e.target.value)
              clear("confirm")
            }}
          />
        </fieldset>

        <div>
          <label className="flex cursor-pointer items-start gap-3 text-sm text-slate-600">
            <input
              id="terms"
              type="checkbox"
              checked={accepted}
              onChange={(e) => {
                setAccepted(e.target.checked)
                clear("terms")
              }}
              className="mt-0.5 h-5 w-5 flex-shrink-0 cursor-pointer rounded border-slate-300 accent-[#032454]"
            />
            <span>
              J&apos;accepte que mes informations soient utilisées par Genetics pour traiter mes demandes de support.
            </span>
          </label>
          {errors.terms && <p className="mt-1.5 text-sm text-red-600">{errors.terms}</p>}
        </div>

        {error && <FormAlert>{error}</FormAlert>}

        <Button
          type="submit"
          disabled={loading}
          className="group h-12 w-full rounded-xl bg-primary text-base font-semibold shadow-lg shadow-primary/20 hover:bg-genetics-dark-blue-700"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" />
              Création du compte...
            </>
          ) : (
            <>
              Créer mon compte
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </Button>
      </form>

      <p className="mt-8 text-center text-sm text-slate-500">
        Déjà un compte ?{" "}
        <Link href="/support/login" className="font-semibold text-primary hover:text-accent">
          Se connecter
        </Link>
      </p>
    </AuthLayout>
  )
}
