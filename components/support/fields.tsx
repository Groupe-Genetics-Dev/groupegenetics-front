"use client"

import { forwardRef, useState, type InputHTMLAttributes } from "react"
import { AlertCircle, Eye, EyeOff, type LucideIcon } from "lucide-react"
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

export function FormAlert({ children }: { children: React.ReactNode }) {
  return (
    <div role="alert" className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      <AlertCircle className="mt-0.5 h-[18px] w-[18px] flex-shrink-0" />
      <p>{children}</p>
    </div>
  )
}

export const isEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
