"use client"

import { forwardRef, useState, type InputHTMLAttributes } from "react"
import { AlertCircle, Check, Eye, EyeOff, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string
  icon: LucideIcon
  error?: string | null
  hint?: string
  optional?: boolean
}

const inputClass =
  "peer h-12 w-full rounded-xl border bg-white pl-11 pr-4 text-[15px] text-slate-900 shadow-sm transition placeholder:text-slate-400 focus:outline-none focus:ring-4 disabled:opacity-60"

// Champ de formulaire avec icône, libellé, aide et message d'erreur
export const TextField = forwardRef<HTMLInputElement, FieldProps>(function TextField(
  { label, icon: Icon, error, hint, optional, id, className, ...props },
  ref,
) {
  const describedBy = error ? `${id}-error` : hint ? `${id}-hint` : undefined
  return (
    <div className={className}>
      <label htmlFor={id} className="mb-1.5 flex items-baseline justify-between text-sm font-medium text-slate-800">
        {label}
        {optional && <span className="text-xs font-normal text-slate-400">Facultatif</span>}
      </label>
      <div className="relative">
        <input
          ref={ref}
          id={id}
          aria-invalid={!!error}
          aria-describedby={describedBy}
          className={cn(
            inputClass,
            error
              ? "border-red-300 focus:border-red-400 focus:ring-red-100"
              : "border-slate-200 hover:border-slate-300 focus:border-primary focus:ring-primary/10",
          )}
          {...props}
        />
        <Icon
          className={cn(
            "pointer-events-none absolute left-4 top-1/2 h-[18px] w-[18px] -translate-y-1/2 transition-colors",
            error ? "text-red-500" : "text-slate-400 peer-focus:text-primary",
          )}
        />
      </div>
      {error ? (
        <p id={`${id}-error`} className="mt-1.5 flex items-center gap-1.5 text-sm text-red-600">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          {error}
        </p>
      ) : (
        hint && (
          <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate-500">
            {hint}
          </p>
        )
      )}
    </div>
  )
})

// Champ mot de passe avec bouton afficher / masquer
export function PasswordField(props: Omit<FieldProps, "type">) {
  const [visible, setVisible] = useState(false)
  return (
    <div className="relative">
      <TextField {...props} type={visible ? "text" : "password"} className={cn(props.className, "[&_input]:pr-12")} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
        className="absolute right-1.5 top-[30px] flex h-10 w-10 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-primary"
      >
        {visible ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
      </button>
    </div>
  )
}

export const PASSWORD_RULES = [
  { label: "8 caractères minimum", test: (p: string) => p.length >= 8 },
  { label: "Une majuscule et une minuscule", test: (p: string) => /[a-z]/.test(p) && /[A-Z]/.test(p) },
  { label: "Un chiffre", test: (p: string) => /\d/.test(p) },
  { label: "Un caractère spécial", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
]

const LEVELS = [
  { label: "Trop faible", color: "bg-red-500", text: "text-red-600" },
  { label: "Faible", color: "bg-orange-500", text: "text-orange-600" },
  { label: "Moyen", color: "bg-amber-500", text: "text-amber-600" },
  { label: "Bon", color: "bg-lime-500", text: "text-lime-700" },
  { label: "Excellent", color: "bg-emerald-500", text: "text-emerald-600" },
]

// Jauge de robustesse du mot de passe + règles cochées en direct
export function PasswordStrength({ password }: { password: string }) {
  const passed = PASSWORD_RULES.filter((r) => r.test(password)).length
  const score = password.length === 0 ? 0 : Math.max(1, passed + (password.length >= 12 ? 1 : 0) - 1)
  const level = LEVELS[Math.min(score, 4)]
  return (
    <div className="mt-3 rounded-xl bg-slate-50 p-3" aria-live="polite">
      <div className="flex items-center gap-3">
        <div className="flex flex-1 gap-1">
          {[1, 2, 3, 4].map((i) => (
            <span
              key={i}
              className={cn("h-1.5 flex-1 rounded-full transition-colors", password && i <= score ? level.color : "bg-slate-200")}
            />
          ))}
        </div>
        <span className={cn("w-20 text-right text-xs font-semibold", password ? level.text : "text-slate-400")}>
          {password ? level.label : "Robustesse"}
        </span>
      </div>
      <ul className="mt-2.5 grid grid-cols-1 gap-1 sm:grid-cols-2">
        {PASSWORD_RULES.map((rule) => {
          const ok = rule.test(password)
          return (
            <li key={rule.label} className={cn("flex items-center gap-1.5 text-xs", ok ? "text-emerald-700" : "text-slate-500")}>
              <span
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full",
                  ok ? "bg-emerald-500 text-white" : "bg-slate-200 text-transparent",
                )}
              >
                <Check className="h-3 w-3" strokeWidth={3} />
              </span>
              {rule.label}
            </li>
          )
        })}
      </ul>
    </div>
  )
}

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" />
      <p>{children}</p>
    </div>
  )
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
