"use client"

// Graphiques SVG légers du tableau de bord admin (sans dépendance).
// Règles : traits fins, 2px d'espace entre segments, étiquettes toujours visibles
// (la couleur ne porte jamais l'information seule), survol = infobulle.

import { useMemo, useRef, useState } from "react"
import { cn } from "@/lib/utils"

const SURFACE = "#ffffff"
export const SERIES_BLUE = "#2a78d6"

// ----- Anneau (donut) -----

export type Slice = { key: string; label: string; value: number; color: string }

export function Donut({ data, centerLabel, onSelect }: { data: Slice[]; centerLabel: string; onSelect?: (key: string) => void }) {
  const [hover, setHover] = useState<string | null>(null)
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const r = 70
  const c = 2 * Math.PI * r
  const gap = total > 0 && data.filter((d) => d.value > 0).length > 1 ? 3 : 0
  let offset = 0
  const active = data.find((d) => d.key === hover)

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="relative h-44 w-44 flex-shrink-0">
        <svg viewBox="0 0 180 180" className="h-full w-full -rotate-90" role="img" aria-label={`${centerLabel} : ${total}`}>
          <circle cx="90" cy="90" r={r} fill="none" stroke="#eef2f7" strokeWidth="20" />
          {total > 0 &&
            data.map((d) => {
              const len = (d.value / total) * c
              const seg = Math.max(len - gap, 0)
              const el = (
                <circle
                  key={d.key}
                  cx="90"
                  cy="90"
                  r={r}
                  fill="none"
                  stroke={d.color}
                  strokeWidth={hover === d.key ? 26 : 20}
                  strokeDasharray={`${seg} ${c - seg}`}
                  strokeDashoffset={-offset}
                  className={cn("cursor-pointer transition-all duration-200", hover && hover !== d.key && "opacity-40")}
                  onMouseEnter={() => setHover(d.key)}
                  onMouseLeave={() => setHover(null)}
                  onClick={() => onSelect?.(d.key)}
                />
              )
              offset += len
              return d.value > 0 ? el : null
            })}
        </svg>
        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
          <span className="text-3xl font-bold text-slate-900">{active ? active.value : total}</span>
          <span className="max-w-[7rem] text-xs text-slate-500">{active ? active.label : centerLabel}</span>
          {active && total > 0 && <span className="text-xs font-semibold text-slate-700">{Math.round((active.value / total) * 100)} %</span>}
        </div>
      </div>
      <ul className="w-full space-y-2 text-sm">
        {data.map((d) => (
          <li key={d.key}>
            <button
              type="button"
              onMouseEnter={() => setHover(d.key)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onSelect?.(d.key)}
              className={cn("flex w-full items-center gap-2.5 rounded-lg px-2 py-1.5 text-left transition-colors hover:bg-slate-50", hover === d.key && "bg-slate-50")}
            >
              <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: d.color }} />
              <span className="flex-1 text-slate-700">{d.label}</span>
              <span className="font-semibold tabular-nums text-slate-900">{d.value}</span>
              <span className="w-10 text-right text-xs tabular-nums text-slate-500">{total ? Math.round((d.value / total) * 100) : 0} %</span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ----- Jauge circulaire (pourcentage) -----

export function Gauge({ value, label, sublabel, color = "#0ca30c" }: { value: number; label: string; sublabel?: string; color?: string }) {
  const pct = Math.max(0, Math.min(100, value))
  const r = 52
  const c = 2 * Math.PI * r
  return (
    <div className="flex items-center gap-4">
      <div className="relative h-28 w-28 flex-shrink-0">
        <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90" role="img" aria-label={`${label} : ${pct} %`}>
          <circle cx="60" cy="60" r={r} fill="none" stroke="#eef2f7" strokeWidth="12" />
          <circle
            cx="60"
            cy="60"
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={`${(pct / 100) * c} ${c}`}
            className="transition-[stroke-dasharray] duration-700"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-slate-900">{pct} %</span>
      </div>
      <div>
        <p className="font-semibold text-slate-900">{label}</p>
        {sublabel && <p className="text-sm text-slate-500">{sublabel}</p>}
      </div>
    </div>
  )
}

// ----- Courbe (aire) : une valeur par jour -----

export type Point = { date: Date; value: number }

export function AreaTrend({ points, unit = "incident" }: { points: Point[]; unit?: string }) {
  const ref = useRef<SVGSVGElement>(null)
  const [hover, setHover] = useState<number | null>(null)
  const W = 640
  const H = 220
  const pad = { top: 16, right: 12, bottom: 28, left: 32 }
  const max = Math.max(1, ...points.map((p) => p.value))
  const niceMax = max <= 4 ? max + 1 : Math.ceil(max / 5) * 5
  const x = (i: number) => pad.left + (i / Math.max(1, points.length - 1)) * (W - pad.left - pad.right)
  const y = (v: number) => pad.top + (1 - v / niceMax) * (H - pad.top - pad.bottom)

  const { line, area } = useMemo(() => {
    const coords = points.map((p, i) => `${x(i)},${y(p.value)}`)
    return {
      line: `M${coords.join(" L")}`,
      area: `M${x(0)},${y(0)} L${coords.join(" L")} L${x(points.length - 1)},${y(0)} Z`,
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [points, niceMax])

  const ticks = [0, niceMax / 2, niceMax].map((t) => Math.round(t))
  const fmt = (d: Date) => d.toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })

  const onMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const box = ref.current?.getBoundingClientRect()
    if (!box) return
    const px = ((e.clientX - box.left) / box.width) * W
    const i = Math.round(((px - pad.left) / (W - pad.left - pad.right)) * (points.length - 1))
    setHover(Math.max(0, Math.min(points.length - 1, i)))
  }

  const hp = hover !== null ? points[hover] : null

  return (
    <div className="relative">
      <svg
        ref={ref}
        viewBox={`0 0 ${W} ${H}`}
        className="h-56 w-full touch-none"
        preserveAspectRatio="none"
        onMouseMove={onMove}
        onMouseLeave={() => setHover(null)}
        role="img"
        aria-label={`Incidents déclarés par jour sur ${points.length} jours`}
      >
        <defs>
          <linearGradient id="trend-fill" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0%" stopColor={SERIES_BLUE} stopOpacity="0.25" />
            <stop offset="100%" stopColor={SERIES_BLUE} stopOpacity="0.02" />
          </linearGradient>
        </defs>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={pad.left} x2={W - pad.right} y1={y(t)} y2={y(t)} stroke="#e2e8f0" strokeDasharray={t === 0 ? "" : "3 4"} vectorEffect="non-scaling-stroke" />
            <text x={pad.left - 8} y={y(t) + 4} textAnchor="end" className="fill-slate-400 text-[11px]">
              {t}
            </text>
          </g>
        ))}
        {points.map((p, i) =>
          i % 7 === 0 || i === points.length - 1 ? (
            <text key={i} x={x(i)} y={H - 8} textAnchor={i === 0 ? "start" : i === points.length - 1 ? "end" : "middle"} className="fill-slate-400 text-[11px]">
              {fmt(p.date)}
            </text>
          ) : null,
        )}
        <path d={area} fill="url(#trend-fill)" />
        <path d={line} fill="none" stroke={SERIES_BLUE} strokeWidth="2" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
        {hp && hover !== null && (
          <g>
            <line x1={x(hover)} x2={x(hover)} y1={pad.top} y2={y(0)} stroke="#94a3b8" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
            <circle cx={x(hover)} cy={y(hp.value)} r="5" fill={SERIES_BLUE} stroke={SURFACE} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          </g>
        )}
      </svg>
      {hp && hover !== null && (
        <div
          className="pointer-events-none absolute top-2 z-10 -translate-x-1/2 whitespace-nowrap rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-lg"
          style={{ left: `${(x(hover) / W) * 100}%` }}
        >
          <p className="text-slate-300">{hp.date.toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long" })}</p>
          <p className="font-semibold">
            {hp.value} {unit}
            {hp.value > 1 ? "s" : ""}
          </p>
        </div>
      )}
    </div>
  )
}

// ----- Barres horizontales (une seule teinte) -----

export function HBars({ items, onSelect }: { items: { key: string; label: string; value: number }[]; onSelect?: (key: string) => void }) {
  const max = Math.max(1, ...items.map((i) => i.value))
  return (
    <ul className="space-y-3">
      {items.map((item) => (
        <li key={item.key}>
          <button type="button" onClick={() => onSelect?.(item.key)} className="group w-full text-left" title={`${item.label} : ${item.value}`}>
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="text-slate-700 group-hover:text-slate-900">{item.label}</span>
              <span className="font-semibold tabular-nums text-slate-900">{item.value}</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-100">
              <div
                className="h-full rounded-full transition-all duration-700 group-hover:opacity-80"
                style={{ width: `${(item.value / max) * 100}%`, backgroundColor: SERIES_BLUE, minWidth: item.value ? 6 : 0 }}
              />
            </div>
          </button>
        </li>
      ))}
    </ul>
  )
}
