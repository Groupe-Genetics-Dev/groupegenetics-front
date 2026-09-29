"use client"

import { ArrowRight, Check, Cloud, GraduationCap, Shield } from "lucide-react"
import { useI18n } from "@/lib/i18n"

const icons = [Shield, Cloud, GraduationCap]

export default function Solutions() {
  const { t } = useI18n()
  const s = t.solutions

  return (
    <section id="solutions" className="section bg-slate-50">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center">
          <span className="eyebrow">{s.eyebrow}</span>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">{s.title}</h2>
          <p className="mt-4 text-lg text-slate-600">{s.subtitle}</p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {s.poles.map((pole, i) => {
            const Icon = icons[i]
            const gold = i === 1
            return (
              <article
                key={pole.title}
                className="group flex flex-col rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-100 transition hover:-translate-y-1 hover:shadow-xl hover:shadow-navy-900/5"
              >
                <span
                  className={`grid h-14 w-14 place-items-center rounded-2xl transition group-hover:scale-110 ${
                    gold ? "bg-gold-500 text-navy-950" : "bg-navy-800 text-white"
                  }`}
                >
                  <Icon className="h-7 w-7" />
                </span>
                <h3 className="mt-6 text-xl font-bold">{pole.title}</h3>
                <p className="mt-1 text-sm text-slate-500">{pole.subtitle}</p>
                <ul className="mt-6 space-y-3 border-t border-slate-100 pt-6">
                  {pole.items.map((item) => (
                    <li key={item} className="flex items-start gap-3 text-sm text-slate-700">
                      <Check className={`mt-0.5 h-4 w-4 shrink-0 ${gold ? "text-gold-500" : "text-navy-500"}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </article>
            )
          })}
        </div>

        {/* CTA banner */}
        <div className="relative mt-16 overflow-hidden rounded-3xl bg-gradient-to-br from-navy-800 to-navy-950 px-6 py-12 text-center sm:px-12">
          <div aria-hidden className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-gold-500/20 blur-3xl" />
          <div aria-hidden className="absolute -bottom-20 -right-10 h-56 w-56 rounded-full bg-navy-500/40 blur-3xl" />
          <h3 className="relative text-2xl font-bold text-white sm:text-3xl">{s.cta.title}</h3>
          <p className="relative mx-auto mt-4 max-w-2xl text-white/75">{s.cta.text}</p>
          <a href="#contact" className="btn-gold relative mt-8">
            {s.cta.button}
            <ArrowRight className="h-4 w-4" />
          </a>
        </div>
      </div>
    </section>
  )
}
