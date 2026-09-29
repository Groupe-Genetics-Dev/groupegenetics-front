import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, CheckCircle2 } from "lucide-react"

const benefits = [
  "Déclarez vos incidents en quelques clics",
  "Suivez leur traitement en temps réel",
  "Soyez notifié par e-mail à chaque résolution",
]

// Mise en page commune aux pages de connexion et de création de compte
export default function AuthLayout({
  title,
  subtitle,
  children,
}: {
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50">
      {/* Panneau de gauche (desktop) */}
      <aside className="relative hidden lg:flex flex-col justify-between overflow-hidden p-12 text-white">
        <Image src="/hero-bg.jpg" alt="" fill priority sizes="50vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-genetics-dark-blue-950/90 via-genetics-dark-blue-800/85 to-genetics-dark-blue-950/95" />
        <Link href="/" className="relative inline-flex w-fit rounded-lg bg-white p-2">
          <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-10 w-auto" />
        </Link>
        <div className="relative">
          <p className="text-sm font-semibold uppercase tracking-wider text-accent">Espace support</p>
          <h2 className="mt-3 text-4xl font-bold leading-tight">
            Votre partenaire <span className="text-accent">IT</span> de confiance
          </h2>
          <ul className="mt-8 space-y-4">
            {benefits.map((b) => (
              <li key={b} className="flex items-center gap-3 text-genetics-dark-blue-100">
                <CheckCircle2 className="h-5 w-5 text-accent flex-shrink-0" />
                {b}
              </li>
            ))}
          </ul>
        </div>
        <p className="relative text-sm text-genetics-dark-blue-200">
          Besoin d&apos;aide ? contact@groupegenetics.com · +221 77 879 61 46
        </p>
      </aside>

      {/* Formulaire */}
      <main className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:hidden">
            <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <Link
            href="/"
            className="ml-auto inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-center py-10">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-bold text-slate-900">{title}</h1>
            <p className="mt-2 text-slate-600">{subtitle}</p>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </main>
    </div>
  )
}
