"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Building2, Loader2, LogOut, Mail, Phone, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { ApiError, getMe, getToken, logout, type User } from "@/lib/auth"

// Espace client : accessible uniquement après connexion
export default function SupportHome() {
  const router = useRouter()
  const [user, setUser] = useState<User | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace("/support/login")
      return
    }
    getMe(token)
      .then(setUser)
      .catch((err) => {
        logout()
        setError(err instanceof ApiError ? err.message : "Impossible de charger votre compte.")
        router.replace("/support/login")
      })
  }, [router])

  const handleLogout = () => {
    logout()
    router.push("/support/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-600">
        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
        {error ?? "Chargement de votre espace..."}
      </div>
    )
  }

  const details = [
    { icon: Mail, label: "E-mail", value: user.email },
    { icon: Building2, label: "Entreprise", value: user.company || "—" },
    { icon: Phone, label: "Téléphone", value: user.phone || "—" },
  ]

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/">
            <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <Button variant="outline" onClick={handleLogout} className="gap-2">
            <LogOut className="h-4 w-4" />
            Se déconnecter
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-genetics-dark-blue-700 to-genetics-dark-blue-950 p-8 sm:p-10 text-white">
          <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-[18px] border-accent/30" />
          <p className="relative text-sm font-semibold uppercase tracking-wider text-accent">Espace support</p>
          <h1 className="relative mt-2 text-3xl sm:text-4xl font-bold">Bonjour {user.name} 👋</h1>
          <p className="relative mt-3 max-w-2xl text-genetics-dark-blue-100">
            Bienvenue dans votre espace support Genetics. Notre équipe est à votre disposition pour toute demande.
          </p>
        </div>

        <Card className="mt-8 border-0 shadow-lg">
          <CardContent className="p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <UserRound className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Mon compte</h2>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-3">
              {details.map(({ icon: Icon, label, value }) => (
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
    </div>
  )
}
