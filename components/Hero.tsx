"use client"

import { ArrowRight, ShieldCheck } from "lucide-react"
import { useI18n } from "@/lib/i18n"

export default function Hero() {
  const { t } = useI18n()
  const [l1, accent1, l2, accent2] = t.hero.title

  return (
    <section id="accueil" className="relative isolate overflow-hidden bg-navy-900 pb-20 pt-32 sm:pb-28 sm:pt-44">
      {/* Background decoration */}
      <div
        aria-hidden
        className="absolute inset-0 -z-10 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />
      <div aria-hidden className="absolute -right-32 -top-32 -z-10 h-96 w-96 rounded-full bg-gold-500/20 blur-3xl" />
      <div aria-hidden className="absolute -bottom-40 -left-24 -z-10 h-[28rem] w-[28rem] rounded-full bg-navy-500/40 blur-3xl" />

      <div className="container text-center">
        <span className="inline-flex animate-fade-up items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-medium text-white/90 ring-1 ring-white/15 sm:text-sm">
          <ShieldCheck className="h-4 w-4 text-gold-400" />
          {t.hero.badge}
        </span>

        <h1 className="mx-auto mt-6 max-w-5xl animate-fade-up text-4xl font-extrabold leading-[1.1] tracking-tight text-white [animation-delay:100ms] sm:text-6xl lg:text-7xl">
          {l1} <span className="text-navy-200">{accent1}</span>
          <br className="hidden sm:block" /> {l2}{" "}
          <span className="bg-gradient-to-r from-gold-400 to-gold-300 bg-clip-text text-transparent">{accent2}</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl animate-fade-up text-base leading-relaxed text-white/75 [animation-delay:200ms] sm:text-lg">
          {t.hero.subtitle}
        </p>

        <div className="mt-10 flex animate-fade-up flex-col items-center justify-center gap-3 [animation-delay:300ms] sm:flex-row">
          <a href="#solutions" className="btn-gold w-full sm:w-auto">
            {t.hero.primary}
            <ArrowRight className="h-4 w-4" />
          </a>
          <a href="#contact" className="btn-ghost w-full sm:w-auto">
            {t.hero.secondary}
          </a>
        </div>

        <dl className="mx-auto mt-16 grid max-w-3xl animate-fade-up grid-cols-3 divide-x divide-white/10 rounded-2xl bg-white/5 py-6 ring-1 ring-white/10 backdrop-blur [animation-delay:400ms]">
          {t.hero.stats.map((s) => (
            <div key={s.label} className="flex flex-col-reverse gap-1 px-2 sm:px-6">
              <dt className="text-[11px] leading-tight text-white/60 sm:text-sm">{s.label}</dt>
              <dd className="text-2xl font-bold text-gold-400 sm:text-4xl">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  )
}
