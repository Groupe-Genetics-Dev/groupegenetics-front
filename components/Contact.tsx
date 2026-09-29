"use client"

import { Mail, MapPin, Phone } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { contact } from "@/lib/content"

export default function Contact() {
  const { t } = useI18n()
  const c = t.contact

  return (
    <section id="contact" className="section bg-white">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{c.eyebrow}</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{c.title}</h2>
          <p className="mt-4 text-lg text-slate-600">{c.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {contact.offices.map((office) => (
            <article key={office.key} className="rounded-3xl border border-slate-100 p-8 shadow-sm">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-navy-50 text-navy-800">
                <MapPin className="h-6 w-6" />
              </span>
              <h3 className="mt-5 text-lg font-bold">{c.offices[office.key]}</h3>
              <address className="mt-2 not-italic text-slate-600">
                {office.address.map((line) => (
                  <span key={line} className="block">
                    {line}
                  </span>
                ))}
              </address>
              <a
                href={`tel:${office.phone.tel}`}
                className="mt-5 inline-flex items-center gap-2 font-semibold text-navy-800 hover:text-gold-600"
              >
                <Phone className="h-4 w-4" />
                {office.phone.display}
              </a>
            </article>
          ))}

          <article className="flex flex-col rounded-3xl bg-gold-50 p-8 ring-1 ring-gold-100">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold-500 text-navy-950">
              <Mail className="h-6 w-6" />
            </span>
            <h3 className="mt-5 text-lg font-bold">{c.email}</h3>
            <p className="mt-2 break-all text-slate-600">{contact.email}</p>
            <a href={`mailto:${contact.email}`} className="btn-primary mt-auto self-start">
              {c.write}
            </a>
          </article>
        </div>
      </div>
    </section>
  )
}
