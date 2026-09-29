"use client"

import Image from "next/image"
import { Mail, MapPin, Phone } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { contact } from "@/lib/content"

export default function Footer() {
  const { t } = useI18n()
  const year = new Date().getFullYear()

  return (
    <footer className="bg-navy-950 text-white/70">
      <div className="container grid gap-10 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="inline-block rounded-lg bg-white p-1.5">
            <Image src="/logo.png" alt="Genetics" width={108} height={54} className="h-10 w-auto" />
          </span>
          <p className="mt-5 text-sm leading-relaxed">{t.footer.about}</p>
          <p className="mt-4 text-sm italic text-gold-400">{t.about.tagline}</p>
        </div>

        <div>
          <h4 className="font-semibold text-white">{t.footer.navigation}</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {[
              ["#accueil", t.nav.home],
              ["#apropos", t.nav.about],
              ["#solutions", t.nav.solutions],
              ["#contact", t.nav.cta],
            ].map(([href, label]) => (
              <li key={href}>
                <a href={href} className="transition hover:text-gold-400">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">{t.footer.services}</h4>
          <ul className="mt-5 space-y-3 text-sm">
            {t.solutions.poles.map((p) => (
              <li key={p.title}>
                <a href="#solutions" className="transition hover:text-gold-400">
                  {p.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-white">{t.footer.contact}</h4>
          <ul className="mt-5 space-y-5 text-sm">
            {contact.offices.map((o) => (
              <li key={o.key}>
                <p className="font-semibold text-gold-400">{t.contact.offices[o.key]}</p>
                <p className="mt-1 flex gap-2">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <span>{o.address.join(", ")}</span>
                </p>
                <a href={`tel:${o.phone.tel}`} className="mt-1 flex gap-2 hover:text-gold-400">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  {o.phone.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${contact.email}`} className="flex gap-2 break-all hover:text-gold-400">
                <Mail className="mt-0.5 h-4 w-4 shrink-0" />
                {contact.email}
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <p className="container py-6 text-center text-xs sm:text-left">
          © {year} Genetics. {t.footer.rights}
        </p>
      </div>
    </footer>
  )
}
