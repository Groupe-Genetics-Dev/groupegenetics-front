"use client"

import { Building2, Mail, Phone, UserRound } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { useClient } from "@/components/support/client-context"

// Informations du compte client
export default function ClientAccount() {
  const { user } = useClient()

  const fields = [
    { icon: UserRound, label: "Nom", value: user.name },
    { icon: Mail, label: "E-mail", value: user.email },
    { icon: Building2, label: "Entreprise", value: user.company || "—" },
    { icon: Phone, label: "Téléphone", value: user.phone || "—" },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">Mon compte</h1>
        <p className="mt-1 text-slate-500">Les informations associées à votre espace client.</p>
      </div>

      <Card className="border-0 shadow-sm ring-1 ring-slate-200">
        <CardContent className="p-6 sm:p-8">
          <dl className="grid gap-4 sm:grid-cols-2">
            {fields.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl bg-slate-50 p-4">
                <dt className="flex items-center gap-2 text-sm text-slate-500">
                  <Icon className="h-4 w-4" />
                  {label}
                </dt>
                <dd className="mt-1 font-medium text-slate-900 break-all">{value}</dd>
              </div>
            ))}
          </dl>
          <p className="mt-6 text-sm text-slate-500">
            Pour modifier ces informations, contactez-nous à{" "}
            <a href="mailto:support@groupegenetics.com" className="font-medium text-primary hover:text-accent">
              support@groupegenetics.com
            </a>
            .
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
