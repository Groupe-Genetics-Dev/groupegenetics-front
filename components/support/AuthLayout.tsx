import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, BellRing, ClipboardList, Headset, ShieldCheck } from "lucide-react"
import { cn } from "@/lib/utils"

const benefits = [
  { icon: ClipboardList, title: "Déclarez vos incidents", text: "En quelques clics, depuis n'importe quel appareil." },
  { icon: Headset, title: "Suivi en temps réel", text: "Consultez l'avancement du traitement par nos équipes." },
  { icon: BellRing, title: "Notifications par e-mail", text: "Soyez prévenu dès que votre incident est résolu." },
]

// Mise en page commune aux pages de connexion et de création de compte
export default function AuthLayout({
  mode,
  title,
  subtitle,
  children,
}: {
  mode?: "login" | "register"
  title: string
  subtitle: string
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-slate-50 lg:grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
      {/* Panneau de présentation (desktop) */}
      <aside className="relative hidden overflow-hidden text-white lg:block">
        <Image src="/support-bg.jpg" alt="" fill priority sizes="45vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-br from-genetics-dark-blue-950/95 via-genetics-dark-blue-800/90 to-genetics-dark-blue-950/95" />
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border-[28px] border-accent/20" />
        <div className="absolute -bottom-32 -left-20 h-80 w-80 rounded-full bg-white/5" />

        <div className="relative flex h-full min-h-screen flex-col justify-between p-12 xl:p-16">
          <Link href="/" className="inline-flex w-fit rounded-xl bg-white p-2.5 shadow-lg">
            <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-10 w-auto" />
          </Link>

          <div className="max-w-md">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-accent ring-1 ring-white/15">
              <ShieldCheck className="h-4 w-4" />
              Espace support
            </span>
            <h2 className="mt-5 text-4xl font-bold leading-tight xl:text-5xl">
              Votre partenaire <span className="text-accent">IT</span> de confiance
            </h2>
            <p className="mt-4 text-lg text-genetics-dark-blue-100">
              Un seul espace pour signaler vos problèmes techniques et suivre leur résolution.
            </p>
            <ul className="mt-10 space-y-4">
              {benefits.map(({ icon: Icon, title, text }) => (
                <li key={title} className="flex gap-4 rounded-2xl bg-white/[0.06] p-4 ring-1 ring-white/10 backdrop-blur-sm">
                  <span className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl bg-accent/90">
                    <Icon className="h-5 w-5 text-white" />
                  </span>
                  <span>
                    <span className="block font-semibold">{title}</span>
                    <span className="block text-sm text-genetics-dark-blue-100">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <p className="text-sm text-genetics-dark-blue-200">
            Besoin d&apos;aide ? <a href="mailto:contact@groupegenetics.com" className="text-white hover:text-accent">contact@groupegenetics.com</a>{" "}
            · <a href="tel:+221778796146" className="text-white hover:text-accent">+221 77 879 61 46</a>
          </p>
        </div>
      </aside>

      {/* Formulaire */}
      <main className="flex min-h-screen flex-col px-4 py-6 sm:px-8 lg:px-12">
        <div className="flex items-center justify-between">
          <Link href="/" className="lg:invisible">
            <Image src="/logo.png" alt="Genetics" width={120} height={48} className="h-10 w-auto" />
          </Link>
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition hover:bg-white hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour au site
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-center py-8">
          <div className="w-full max-w-lg">
            <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/60 ring-1 ring-slate-100 sm:p-10">
              {mode && (
                <nav className="mb-8 grid grid-cols-2 rounded-xl bg-slate-100 p-1 text-sm font-semibold" aria-label="Espace support">
                  {[
                    { key: "login", href: "/support/login", label: "Connexion" },
                    { key: "register", href: "/support/register", label: "Créer un compte" },
                  ].map((tab) => (
                    <Link
                      key={tab.key}
                      href={tab.href}
                      aria-current={mode === tab.key ? "page" : undefined}
                      className={cn(
                        "rounded-lg px-3 py-2.5 text-center transition",
                        mode === tab.key ? "bg-white text-primary shadow-sm" : "text-slate-500 hover:text-slate-800",
                      )}
                    >
                      {tab.label}
                    </Link>
                  ))}
                </nav>
              )}
              <h1 className="text-2xl font-bold text-slate-900 sm:text-3xl">{title}</h1>
              <p className="mt-2 text-slate-500">{subtitle}</p>
              <div className="mt-8">{children}</div>
            </div>
            <p className="mt-6 text-center text-xs text-slate-400">
              © {new Date().getFullYear()} Genetics · Vos données sont utilisées uniquement pour le traitement de vos demandes.
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
