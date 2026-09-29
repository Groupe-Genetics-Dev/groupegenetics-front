"use client"

import { Eye, Target, Phone, Award, Zap, TrendingUp, ShieldCheck } from "lucide-react"
import { useI18n } from "@/lib/i18n"
import { contact } from "@/lib/content"

const valueIcons = [Award, Zap, TrendingUp, ShieldCheck]

export default function About() {
  const { t } = useI18n()
  const a = t.about

  return (
    <section id="apropos" className="section bg-white">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{a.eyebrow}</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{a.title}</h2>
          <p className="mt-3 italic text-slate-500">{a.tagline}</p>
        </div>

        <div className="mt-14 grid gap-10 lg:grid-cols-5 lg:gap-12">
          {/* Text column */}
          <div className="space-y-6 lg:col-span-3">
            <p className="text-lg leading-relaxed">
              <strong className="font-bold text-navy-800">GENETICS</strong> {a.p1.replace(/^GENETICS\s*/, "")}
            </p>
            <p className="leading-relaxed text-slate-600">{a.p2}</p>

            <div className="grid gap-4 sm:grid-cols-2">
              <article className="rounded-2xl bg-navy-50 p-6 ring-1 ring-navy-100">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-navy-800 text-white">
                    <Eye className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{a.vision.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{a.vision.text}</p>
              </article>

              <article className="rounded-2xl bg-gold-50 p-6 ring-1 ring-gold-100">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold-500 text-navy-950">
                    <Target className="h-5 w-5" />
                  </span>
                  <h3 className="text-lg font-semibold">{a.mission.title}</h3>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">{a.mission.text}</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-700">
                  {a.mission.items.map((item) => (
                    <li key={item} className="flex gap-2">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            </div>
          </div>

          {/* Highlights column */}
          <aside className="flex flex-col gap-4 lg:col-span-2">
            <div className="relative overflow-hidden rounded-3xl bg-navy-800 p-8 text-white">
              <div aria-hidden className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-gold-500/25 blur-2xl" />
              <p className="text-7xl font-extrabold tracking-tight">
                10<span className="text-gold-400">+</span>
              </p>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-white/70">{a.years}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {a.values.map((v, i) => {
                const Icon = valueIcons[i]
                return (
                  <div key={v.title} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <Icon className={`h-6 w-6 ${i % 2 ? "text-gold-500" : "text-navy-800"}`} />
                    <p className="mt-3 font-semibold uppercase tracking-wide text-navy-950">{v.title}</p>
                    <p className="text-xs text-slate-500">{v.text}</p>
                  </div>
                )
              })}
            </div>

            <div className="flex flex-col gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:flex-row sm:items-center sm:justify-between lg:flex-col lg:items-start xl:flex-row xl:items-center">
              <div>
                <p className="font-semibold uppercase text-navy-950">{a.ceo.title}</p>
                <p className="text-sm text-slate-500">{a.ceo.role}</p>
              </div>
              <a href={`tel:${contact.ceoPhone.tel}`} className="group flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-navy-800 text-white transition group-hover:bg-gold-500 group-hover:text-navy-950">
                  <Phone className="h-5 w-5" />
                </span>
                <span>
                  <span className="block text-xs text-slate-500">{a.ceo.call}</span>
                  <span className="block whitespace-nowrap font-bold text-navy-800">{contact.ceoPhone.display}</span>
                </span>
              </a>
            </div>
          </aside>
        </div>
      </div>
    </section>
  )
}
