"use client"

import { useEffect, useState, type FormEvent, type MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Camera,
  ChevronDown,
  Cloud,
  Code,
  ExternalLink,
  Eye,
  FileText,
  Fingerprint,
  Globe,
  GraduationCap,
  HardDrive,
  Languages,
  Mail,
  MapPin,
  Monitor,
  Network,
  Phone,
  QrCode,
  Server,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Target,
  UserCheck,
  Wifi,
  type LucideIcon,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { translations, type Lang } from "@/lib/translations"
import { API_URL, SUPPORT_URL, WELQO_URL } from "@/lib/config"
import CookieBanner from "./CookieBanner"

type Service = {
  icon: LucideIcon
  title: string
  description: string
  color: "primary" | "accent"
  subServices: { icon: LucideIcon; name: string }[]
}

type SendStatus = "idle" | "sending" | "sent" | "error"

// Motif décoratif du hero : couleurs tirées une seule fois côté client
function DecoGrid() {
  const [colors, setColors] = useState<boolean[]>(() => Array(9).fill(false))
  useEffect(() => {
    setColors(Array.from({ length: 9 }, () => Math.random() > 0.5))
  }, [])
  return (
    <div className="absolute top-1/4 left-1/4 grid grid-cols-3 gap-2 opacity-30">
      {colors.map((gold, i) => (
        <div key={i} className={`w-4 h-4 ${gold ? "bg-accent" : "bg-primary"}`} />
      ))}
    </div>
  )
}

export default function HomePage() {
  const [openServices, setOpenServices] = useState<Set<number>>(new Set())
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<Lang>("fr")
  const [welqoOpen, setWelqoOpen] = useState(false)
  const [contactOpen, setContactOpen] = useState(false)
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle")
  const t = translations[lang]

  useEffect(() => {
    if (!sessionStorage.getItem("hasVisitedWelqo")) {
      const timer = setTimeout(() => setWelqoOpen(true), 2000)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const openContact = (e?: MouseEvent) => {
    e?.preventDefault()
    setSendStatus("idle")
    setContactOpen(true)
  }

  const toggleService = (index: number) => {
    const next = new Set(openServices)
    if (next.has(index)) next.delete(index)
    else next.add(index)
    setOpenServices(next)
  }

  const handleContactSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const form = e.currentTarget
    const data = new FormData(form)
    const phone = String(data.get("phone") || "").trim()
    const message = String(data.get("message") || "").trim()
    setSendStatus("sending")
    try {
      const res = await fetch(`${API_URL}/contact/send-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: String(data.get("name") || "").trim(),
          email: String(data.get("email") || "").trim(),
          subject: `Demande de contact - site web${phone ? ` (${phone})` : ""}`,
          message: phone ? `${message}\n\nTéléphone : ${phone}` : message,
        }),
      })
      if (!res.ok) throw new Error(String(res.status))
      setSendStatus("sent")
      form.reset()
    } catch {
      setSendStatus("error")
    }
  }

  const services: Service[] = [
    {
      icon: Shield,
      title: t.solutions.pole1,
      description: t.solutions.pole1Desc,
      color: "primary",
      subServices: [
        { icon: Monitor, name: "Monitoring et Supervision" },
        { icon: Wifi, name: "WiFi Professionnel" },
        { icon: Phone, name: "Téléphonie sur IP (VoIP)" },
        { icon: ShieldAlert, name: "Firewall et sécurité réseau" },
        { icon: Server, name: "Datacenter et Infrastructure" },
        { icon: Camera, name: "Vidéosurveillance CCTV" },
        { icon: Fingerprint, name: "Access Control" },
      ],
    },
    {
      icon: Cloud,
      title: t.solutions.pole2,
      description: t.solutions.pole2Desc,
      color: "accent",
      subServices: [
        { icon: Cloud, name: "Microsoft Office 365" },
        { icon: HardDrive, name: "Data Backup et Replication" },
        { icon: Code, name: "Développement d'applications" },
      ],
    },
    {
      icon: GraduationCap,
      title: t.solutions.pole3,
      description: t.solutions.pole3Desc,
      color: "primary",
      subServices: [
        { icon: FileText, name: "Audit IT" },
        { icon: Network, name: "Schema directeur IT" },
        { icon: Globe, name: "Accompagnement à la digitalisation" },
      ],
    },
  ]

  const langButton = (value: Lang, size: "sm" | "xs") => (
    <button
      key={value}
      onClick={() => setLang(value)}
      className={`${size === "sm" ? "px-3 py-1 text-sm" : "px-2 py-1 text-xs"} rounded font-medium transition-colors ${
        lang === value ? "bg-primary text-white" : "text-slate-700 hover:bg-slate-100"
      }`}
    >
      {value.toUpperCase()}
    </button>
  )

  const navLinks = [
    { href: "#accueil", label: t.nav.home },
    { href: "#apropos", label: t.nav.about },
    { href: "#solutions", label: t.nav.solutions },
    { href: "#realisations", label: t.nav.projects },
    { href: SUPPORT_URL, label: t.nav.support },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-genetics-dark-blue-50">
      {/* ---------- Popup Welqo ---------- */}
      <Dialog open={welqoOpen} onOpenChange={setWelqoOpen}>
        <DialogContent className="w-[calc(100%-2rem)] max-w-[600px] mx-auto bg-gradient-to-br from-white via-genetics-dark-blue-50/30 to-genetics-gold-50/30 p-4 sm:p-6 max-h-[90vh] overflow-y-auto">
          <DialogHeader className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <DialogTitle className="text-xl sm:text-3xl font-bold text-slate-900">{t.welqoModal.title}</DialogTitle>
              <div className="flex items-center gap-1 border border-slate-300 rounded-lg p-1 flex-shrink-0 mr-6">
                {langButton("fr", "xs")}
                {langButton("en", "xs")}
              </div>
            </div>
            <DialogDescription className="text-sm sm:text-lg text-slate-700 text-left">
              {t.welqoModal.subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 sm:space-y-6 py-2 sm:py-4">
            <p className="text-slate-600 leading-relaxed text-sm sm:text-base">{t.welqoModal.description}</p>
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {[
                { icon: UserCheck, title: t.welqoModal.feature1, desc: t.welqoModal.feature1Desc, gold: false },
                { icon: ShieldCheck, title: t.welqoModal.feature2, desc: t.welqoModal.feature2Desc, gold: true },
                { icon: QrCode, title: t.welqoModal.feature3, desc: t.welqoModal.feature3Desc, gold: false },
              ].map(({ icon: Icon, title, desc, gold }) => (
                <div
                  key={title}
                  className={`text-center p-2 sm:p-4 bg-white/60 rounded-xl border ${
                    gold ? "border-genetics-gold-100" : "border-genetics-dark-blue-100"
                  }`}
                >
                  <div
                    className={`w-8 h-8 sm:w-12 sm:h-12 ${
                      gold ? "bg-accent" : "bg-primary"
                    } rounded-lg flex items-center justify-center mx-auto mb-2 sm:mb-3`}
                  >
                    <Icon className="h-4 w-4 sm:h-6 sm:w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-slate-900 text-xs sm:text-sm mb-1 line-clamp-2">{title}</h4>
                  <p className="text-slate-600 text-[10px] sm:text-xs hidden sm:block">{desc}</p>
                </div>
              ))}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
              <a
                href={WELQO_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1"
                onClick={() => {
                  sessionStorage.setItem("hasVisitedWelqo", "true")
                  setWelqoOpen(false)
                }}
              >
                <Button className="w-full bg-primary hover:bg-genetics-dark-blue-700 text-white text-sm sm:text-base py-2 sm:py-3">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  {t.welqoModal.visitWebsite}
                </Button>
              </a>
              <Button
                variant="outline"
                className="flex-1 bg-transparent text-sm sm:text-base py-2 sm:py-3"
                onClick={() => setWelqoOpen(false)}
              >
                {t.welqoModal.remindLater}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- Formulaire de contact ---------- */}
      <Dialog open={contactOpen} onOpenChange={setContactOpen}>
        <DialogContent className="w-[calc(100%-2rem)] sm:max-w-[700px] max-h-[90vh] overflow-y-auto bg-gradient-to-br from-white via-genetics-dark-blue-50/30 to-genetics-gold-50/30">
          <DialogHeader>
            <DialogTitle className="text-2xl sm:text-3xl font-bold text-slate-900 mb-2 text-left">
              {t.contactModal.title}
            </DialogTitle>
            <DialogDescription className="text-base sm:text-lg text-slate-700 text-left">
              {t.contactModal.subtitle}
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
            <form className="space-y-4" onSubmit={handleContactSubmit}>
              <div>
                <Label htmlFor="name" className="text-slate-900 font-medium">
                  {t.contactModal.name}
                </Label>
                <Input id="name" name="name" required placeholder={t.contactModal.namePlaceholder} className="mt-1 bg-white/80" />
              </div>
              <div>
                <Label htmlFor="email" className="text-slate-900 font-medium">
                  {t.contactModal.email}
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder={t.contactModal.emailPlaceholder}
                  className="mt-1 bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-slate-900 font-medium">
                  {t.contactModal.phone}
                </Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder={t.contactModal.phonePlaceholder}
                  className="mt-1 bg-white/80"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-slate-900 font-medium">
                  {t.contactModal.message}
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  required
                  placeholder={t.contactModal.messagePlaceholder}
                  rows={4}
                  className="mt-1 bg-white/80"
                />
              </div>
              <Button
                type="submit"
                disabled={sendStatus === "sending"}
                className="w-full bg-primary hover:bg-genetics-dark-blue-700 text-white"
              >
                <Mail className="mr-2 h-4 w-4" />
                {sendStatus === "sending" ? (lang === "fr" ? "Envoi en cours..." : "Sending...") : t.contactModal.send}
              </Button>
              {sendStatus === "sent" && (
                <p role="status" className="text-sm text-green-700">
                  {lang === "fr"
                    ? "Votre message a été envoyé avec succès. Nous vous contacterons bientôt."
                    : "Your message has been sent successfully. We will contact you soon."}
                </p>
              )}
              {sendStatus === "error" && (
                <p role="alert" className="text-sm text-red-600">
                  {lang === "fr"
                    ? "L'envoi a échoué. Écrivez-nous directement à contact@groupegenetics.com."
                    : "Sending failed. Please email us directly at contact@groupegenetics.com."}
                </p>
              )}
            </form>
            <div className="space-y-4">
              <h4 className="text-xl font-bold text-slate-900 mb-4">{t.contactModal.contactInfo}</h4>
              <div className="bg-white/60 rounded-xl p-4 border border-genetics-dark-blue-100">
                <h5 className="font-semibold text-primary mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t.contactModal.senegalOffice}
                </h5>
                <div className="space-y-2 text-sm text-slate-700">
                  <a href="tel:+221778796146" className="flex items-center hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    +221 77 879 61 46
                  </a>
                  <a href="tel:+2202717816" className="flex items-center hover:text-primary transition-colors">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    +220 271 7816
                  </a>
                  <a
                    href="mailto:contact@groupegenetics.com"
                    className="flex items-center hover:text-primary transition-colors break-all"
                  >
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    contact@groupegenetics.com
                  </a>
                </div>
              </div>
              <div className="bg-white/60 rounded-xl p-4 border border-genetics-gold-100">
                <h5 className="font-semibold text-accent mb-3 flex items-center">
                  <MapPin className="h-4 w-4 mr-2" />
                  {t.contactModal.gambiaOffice}
                </h5>
                <div className="space-y-2 text-sm text-slate-700">
                  <p className="flex items-start">
                    <MapPin className="h-4 w-4 mr-2 flex-shrink-0 mt-0.5" />
                    Baraka Estate, Bakoteh
                  </p>
                  <a href="tel:+2202717816" className="flex items-center hover:text-accent transition-colors">
                    <Phone className="h-4 w-4 mr-2 flex-shrink-0" />
                    +220 271 7816
                  </a>
                  <a
                    href="mailto:contact@groupegenetics.com"
                    className="flex items-center hover:text-accent transition-colors break-all"
                  >
                    <Mail className="h-4 w-4 mr-2 flex-shrink-0" />
                    contact@groupegenetics.com
                  </a>
                </div>
              </div>
              <div className="bg-white/60 rounded-xl p-4 border border-genetics-dark-blue-100">
                <p className="text-sm text-slate-700 font-medium">
                  {lang === "fr" ? "Lundi - Vendredi: 8h00 - 18h00" : "Monday - Friday: 8:00 AM - 6:00 PM"}
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  {lang === "fr" ? "Samedi: 9h00 - 14h00" : "Saturday: 9:00 AM - 2:00 PM"}
                </p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* ---------- Navigation ---------- */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md z-50 border-b border-slate-200">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="#accueil">
                <Image src="/logo.png" alt="Genetics Logo" width={120} height={48} className="h-12 w-auto" priority />
              </Link>
            </div>

            <div className="hidden md:flex items-center justify-center flex-1 space-x-8">
              {navLinks.map((link) => (
                <Link key={link.href} href={link.href} className="text-slate-700 hover:text-primary transition-colors font-medium">
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="hidden md:flex items-center gap-3">
              <div className="flex items-center gap-2 border border-slate-300 rounded-lg p-1">
                {langButton("fr", "sm")}
                {langButton("en", "sm")}
              </div>
              <Button className="bg-primary hover:bg-genetics-dark-blue-700 font-medium" onClick={openContact}>
                {t.nav.contact}
              </Button>
            </div>

            <div className="md:hidden flex items-center gap-2">
              <button
                onClick={() => setLang(lang === "fr" ? "en" : "fr")}
                className="p-2 text-slate-700 hover:text-primary transition-colors"
                aria-label="Change language"
              >
                <Languages className="h-5 w-5" />
                <span className="text-xs font-medium ml-1">{lang.toUpperCase()}</span>
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2"
                aria-label="Menu"
                aria-expanded={menuOpen}
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </Button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-lg z-40">
            <div className="px-6 py-4 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-slate-700 hover:text-primary transition-colors font-medium"
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ))}
              <button
                className="block w-full bg-primary text-white px-4 py-2 rounded-lg text-center font-medium"
                onClick={() => {
                  setMenuOpen(false)
                  openContact()
                }}
              >
                {t.nav.contact}
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* ---------- Accueil ---------- */}
      <section
        id="accueil"
        className="relative min-h-screen flex items-center justify-center overflow-hidden bg-genetics-dark-blue-50"
      >
        <div className="absolute inset-0 opacity-10 pointer-events-none">
          <div className="absolute top-20 left-20 w-32 h-32 border-4 border-accent rotate-45" />
          <div className="absolute top-40 right-32 w-24 h-24 border-2 border-primary rotate-12" />
          <div className="absolute bottom-32 left-1/3 w-40 h-40 border-8 border-accent rotate-45" />
          <div className="absolute top-1/2 right-1/4 w-28 h-28 border-4 border-primary rotate-12" />
          <DecoGrid />
        </div>

        {/* Version desktop / tablette */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 hidden md:block">
          <h1 className="text-5xl lg:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            {t.hero.title}
            <span className="text-primary">{t.hero.business}</span>
            {t.hero.by}
            <span className="text-accent">{t.hero.technology}</span>
          </h1>
          <p className="text-xl text-slate-600 mb-8 max-w-3xl mx-auto leading-relaxed">{t.hero.subtitle}</p>
          <div className="flex flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-genetics-dark-blue-700 text-lg px-8 py-3">
              <Link href="#solutions">
                {t.hero.discoverServices}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" className="bg-accent hover:bg-genetics-gold-600 text-lg px-8 py-3" onClick={openContact}>
              {t.hero.freeConsultation}
            </Button>
          </div>
        </div>

        {/* Version mobile */}
        <div className="relative z-10 text-center max-w-4xl mx-auto px-4 sm:px-6 md:hidden">
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mb-4 leading-tight">
            {t.hero.titleMobile}
            <span className="text-primary">{t.hero.it}</span>
            {t.hero.trust}
          </h1>
          <p className="text-lg text-slate-600 mb-6 leading-relaxed">{t.hero.subtitleMobile}</p>
          <div className="flex flex-col gap-3 justify-center">
            <Button asChild size="lg" className="bg-primary hover:bg-genetics-dark-blue-700 px-6 py-3">
              <Link href="#solutions">
                {t.hero.ourServices}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" className="bg-accent hover:bg-genetics-gold-600 px-6 py-3" onClick={openContact}>
              {t.hero.contact}
            </Button>
          </div>
        </div>
      </section>

      {/* ---------- À propos ---------- */}
      <section id="apropos" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.about.title}</h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">{t.about.tagline}</p>
          </div>

          {/* Mobile / tablette */}
          <div className="lg:hidden space-y-6">
            <div className="bg-genetics-dark-blue-50 rounded-2xl p-5 border border-genetics-dark-blue-100">
              <p className="text-slate-700 leading-relaxed text-sm">
                <span className="text-lg font-bold text-primary">GENETICS</span>{" "}
                {lang === "fr"
                  ? "est une entreprise technologique spécialisée dans les solutions de sécurité électronique, les services IT et le développement digital."
                  : "is a technology company specialized in electronic security solutions, IT services and digital development."}
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl p-4 border border-genetics-dark-blue-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                    <Eye className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.about.vision}</h4>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {lang === "fr"
                    ? "Leader de la sécurité technologique intelligente en Afrique"
                    : "Leader in intelligent technological security in Africa"}
                </p>
              </div>
              <div className="bg-white rounded-xl p-4 border border-genetics-gold-100 shadow-sm">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
                    <Target className="h-4 w-4 text-white" />
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm">{t.about.mission}</h4>
                </div>
                <p className="text-slate-600 text-xs leading-relaxed">
                  {lang === "fr"
                    ? "Protection intelligente de vos environnements"
                    : "Intelligent protection of your environments"}
                </p>
              </div>
              <div className="bg-primary rounded-xl p-4 text-white text-center">
                <div className="text-3xl font-black">10+</div>
                <div className="text-xs font-medium opacity-90">{t.about.years}</div>
                <div className="text-xs opacity-75">{t.about.experience}</div>
              </div>
              <div className="bg-genetics-gold-50 rounded-xl p-4 border border-genetics-gold-100">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                    <Phone className="h-4 w-4 text-white" />
                  </div>
                </div>
                <a
                  href="tel:+221788790000"
                  className="text-sm font-bold text-primary hover:text-accent transition-colors block"
                >
                  +221 78 879 00 00
                </a>
                <p className="text-slate-600 text-xs">{t.about.callQuestion}</p>
              </div>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: t.about.expertise, gold: false },
                { label: t.about.agility, gold: true },
                { label: t.about.efficiency, gold: false },
                { label: t.about.discipline, gold: true },
              ].map(({ label, gold }) => (
                <div
                  key={label}
                  className={`bg-white rounded-lg px-1 py-2 text-center border ${
                    gold ? "border-accent/20" : "border-primary/20"
                  } shadow-sm`}
                >
                  <div className={`text-[10px] min-[400px]:text-xs font-bold ${gold ? "text-accent" : "text-primary"}`}>{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-12 items-center">
            <div className="lg:col-span-2">
              <Card className="border-0 shadow-2xl bg-white overflow-hidden">
                <CardContent className="p-8 lg:p-12">
                  <div className="relative">
                    <div className="absolute -top-4 -left-4 w-20 h-20 bg-primary/10 rounded-full" />
                    <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-accent/10 rounded-full" />
                    <p className="text-lg text-slate-700 leading-relaxed mb-8 relative z-10">
                      <span className="text-2xl font-bold text-primary">GENETICS</span> {t.about.description1}
                    </p>
                    <p className="text-lg text-slate-700 leading-relaxed mb-8 relative z-10">{t.about.description2}</p>

                    <div className="bg-genetics-dark-blue-50 rounded-2xl p-6 mb-8 border border-genetics-dark-blue-100">
                      <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mr-3">
                          <Eye className="h-4 w-4 text-white" />
                        </div>
                        {t.about.vision}
                      </h4>
                      <p className="text-slate-700 leading-relaxed">{t.about.visionText}</p>
                    </div>

                    <div className="bg-genetics-gold-50 rounded-2xl p-6 mb-8 border border-genetics-gold-100">
                      <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                        <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mr-3">
                          <Target className="h-4 w-4 text-white" />
                        </div>
                        {t.about.mission}
                      </h4>
                      <p className="text-slate-700 leading-relaxed mb-4">{t.about.missionText}</p>
                      <ul className="space-y-2 text-slate-700">
                        {[t.about.missionItem1, t.about.missionItem2, t.about.missionItem3, t.about.missionItem4].map(
                          (item, i) => (
                            <li key={item} className="flex items-center">
                              <div className={`w-2 h-2 ${i % 2 ? "bg-accent" : "bg-primary"} rounded-full mr-3 flex-shrink-0`} />
                              {item}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 border border-genetics-dark-blue-100">
                      <div className="flex items-center justify-between flex-wrap gap-4">
                        <div>
                          <h4 className="text-lg font-semibold text-slate-900 mb-1">{t.about.ceo}</h4>
                          <p className="text-slate-600">{t.about.ceoRole}</p>
                        </div>
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                            <Phone className="h-6 w-6 text-white" />
                          </div>
                          <div>
                            <p className="text-sm text-slate-600">{t.about.callQuestion}</p>
                            <a
                              href="tel:+221788790000"
                              className="text-lg font-bold text-primary hover:text-accent transition-colors"
                            >
                              +221 78 879 00 00
                            </a>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="relative flex flex-col items-center justify-center space-y-8">
              <div className="relative">
                <div className="w-80 h-80 bg-genetics-dark-blue-50 rounded-full border-4 border-primary/30 flex items-center justify-center relative overflow-hidden">
                  <div className="text-center z-10">
                    <div className="text-8xl font-black text-primary mb-2">10+</div>
                    <div className="text-slate-900 text-xl font-bold mb-2">{t.about.years}</div>
                    <div className="text-slate-600 text-lg">{t.about.experience}</div>
                  </div>
                  <div className="absolute top-8 right-8 w-4 h-4 bg-primary rounded-full" />
                  <div className="absolute bottom-12 left-12 w-3 h-3 bg-accent rounded-full" />
                  <div className="absolute top-20 left-8 w-2 h-2 bg-primary rounded-full" />
                </div>
                <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary/30 rounded-full" />
                <div className="absolute -bottom-6 -left-6 w-12 h-12 bg-accent/30 rounded-full" />
              </div>
              <div className="grid grid-cols-2 gap-4 w-full max-w-sm">
                {[
                  { label: t.about.expertise, desc: t.about.expertiseDesc, gold: false },
                  { label: t.about.agility, desc: t.about.agilityDesc, gold: true },
                  { label: t.about.efficiency, desc: t.about.efficiencyDesc, gold: false },
                  { label: t.about.discipline, desc: t.about.disciplineDesc, gold: true },
                ].map(({ label, desc, gold }) => (
                  <div
                    key={label}
                    className={`bg-white/90 backdrop-blur-sm border ${
                      gold ? "border-accent/30" : "border-primary/30"
                    } rounded-2xl p-4 text-center shadow-lg`}
                  >
                    <div className={`text-lg font-bold ${gold ? "text-accent" : "text-primary"}`}>{label}</div>
                    <div className="text-slate-700 text-xs mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Solutions ---------- */}
      <section id="solutions" className="py-20 bg-white scroll-mt-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-slate-900 mb-4">{t.solutions.title}</h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto hidden md:block">{t.solutions.subtitle}</p>
            <p className="text-lg text-slate-600 md:hidden">{t.solutions.subtitleMobile}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {services.map((service, index) => {
              const open = openServices.has(index)
              const isPrimary = service.color === "primary"
              return (
                <Card
                  key={service.title}
                  className={`border-0 shadow-lg transition-all duration-300 cursor-pointer group ${
                    open
                      ? "shadow-2xl border-2 border-genetics-dark-blue-200 lg:scale-105"
                      : "hover:shadow-xl hover:scale-[1.02]"
                  }`}
                >
                  <CardContent className="p-0">
                    <button
                      type="button"
                      className="w-full p-6 text-center"
                      onClick={() => toggleService(index)}
                      aria-expanded={open}
                    >
                      <div className="flex flex-col items-center space-y-4">
                        <div
                          className={`w-20 h-20 ${
                            isPrimary ? "bg-primary" : "bg-accent"
                          } rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform shadow-lg`}
                        >
                          <service.icon className="h-10 w-10 text-white" />
                        </div>
                        <div>
                          <h3
                            className={`text-xl font-bold mb-2 transition-colors ${
                              open ? (isPrimary ? "text-primary" : "text-accent") : "text-slate-900"
                            }`}
                          >
                            {service.title}
                          </h3>
                          <p className="text-slate-600 text-sm leading-relaxed">{service.description}</p>
                        </div>
                        <div
                          className={`transition-all duration-300 ${
                            open ? (isPrimary ? "text-primary rotate-180" : "text-accent rotate-180") : "text-slate-400"
                          }`}
                        >
                          <ChevronDown className="h-6 w-6" />
                        </div>
                      </div>
                    </button>
                    <div
                      className={`overflow-auto transition-all duration-500 ease-in-out ${
                        open ? "max-h-[400px] opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="px-6 pb-6">
                        <div
                          className={`border-t-2 ${
                            isPrimary ? "border-genetics-dark-blue-200" : "border-genetics-gold-200"
                          } pt-4`}
                        >
                          <div className="space-y-3">
                            {service.subServices.map((sub) => (
                              <div
                                key={sub.name}
                                className="flex items-center space-x-3 p-3 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors group/sub"
                              >
                                <div
                                  className={`w-10 h-10 ${
                                    isPrimary ? "bg-primary" : "bg-accent"
                                  } rounded-lg flex items-center justify-center flex-shrink-0`}
                                >
                                  <sub.icon className="h-5 w-5 text-white" />
                                </div>
                                <span className="text-slate-700 font-medium text-sm flex-1">{sub.name}</span>
                                <div
                                  className={`opacity-0 group-hover/sub:opacity-100 transition-opacity ${
                                    isPrimary ? "text-primary" : "text-accent"
                                  }`}
                                >
                                  <ArrowRight className="h-4 w-4" />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>

          <div className="text-center">
            <div className="bg-gradient-to-r from-genetics-dark-blue-50 to-genetics-gold-50 rounded-3xl p-6 sm:p-8 border border-genetics-dark-blue-100">
              <h3 className="text-2xl font-bold text-slate-900 mb-4">{t.solutions.customSolution}</h3>
              <p className="text-slate-600 mb-6 max-w-2xl mx-auto hidden md:block">{t.solutions.customSolutionDesc}</p>
              <p className="text-slate-600 mb-6 md:hidden">{t.solutions.customSolutionDescMobile}</p>
              <Button size="lg" className="bg-primary hover:bg-genetics-dark-blue-700" onClick={openContact}>
                {t.solutions.freeConsultation}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="bg-genetics-dark-blue-800 text-white">
        <div className="container mx-auto px-6 py-12">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 mb-8">
            <div className="col-span-2 lg:col-span-1">
              <h3 className="text-xl lg:text-2xl font-bold mb-3 lg:mb-4">Genetics</h3>
              <p className="text-genetics-dark-blue-100 mb-3 lg:mb-4 text-xs lg:text-sm leading-relaxed">
                {lang === "fr"
                  ? "Accélérer l'innovation avec des équipes techniques de classe mondiale. Nous vous mettrons en relation avec une équipe composée d'incroyables talents."
                  : "Accelerate innovation with world-class technical teams. We will connect you with a team of incredible talents."}
              </p>
              <p className="text-genetics-dark-blue-200 italic text-xs lg:text-sm">Transform your business by the digital</p>
            </div>

            <div>
              <h4 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">Navigation</h4>
              <ul className="space-y-1.5 lg:space-y-2">
                {[
                  { href: "#accueil", label: t.nav.home },
                  { href: "#apropos", label: t.nav.about },
                  { href: "#solutions", label: t.nav.solutions },
                ].map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      className="text-genetics-dark-blue-100 hover:text-genetics-gold-400 transition-colors text-xs lg:text-sm"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
                <li>
                  <button
                    onClick={openContact}
                    className="text-genetics-dark-blue-100 hover:text-genetics-gold-400 transition-colors text-xs lg:text-sm text-left"
                  >
                    {t.nav.contact}
                  </button>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">{t.solutions.title}</h4>
              <ul className="space-y-1.5 lg:space-y-2">
                {[t.solutions.pole1, t.solutions.pole2, t.solutions.pole3].map((pole) => (
                  <li key={pole} className="text-genetics-dark-blue-100 text-xs lg:text-sm">
                    {pole}
                  </li>
                ))}
              </ul>
            </div>

            <div className="col-span-2 lg:col-span-1">
              <h4 className="text-base lg:text-lg font-semibold mb-3 lg:mb-4">{t.nav.contact}</h4>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                <div>
                  <p className="font-semibold text-genetics-gold-400 text-xs lg:text-sm mb-1.5 lg:mb-2">
                    {lang === "fr" ? "Bureau Sénégal" : "Senegal Office"}
                  </p>
                  <div className="space-y-1 text-xs lg:text-sm">
                    <p className="text-genetics-dark-blue-100 flex items-start">
                      <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5 lg:mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Zac Mbao, Rond-Point SIPRES
                        <br />
                        Dakar, Sénégal
                      </span>
                    </p>
                    <p className="text-genetics-dark-blue-100 flex items-center">
                      <Phone className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5 lg:mr-2 flex-shrink-0" />
                      <a href="tel:+221778796146" className="hover:text-genetics-gold-400 transition-colors">
                        +221 77 879 61 46
                      </a>
                    </p>
                  </div>
                </div>
                <div>
                  <p className="font-semibold text-genetics-gold-400 text-xs lg:text-sm mb-1.5 lg:mb-2">
                    {lang === "fr" ? "Bureau Gambie" : "Gambia Office"}
                  </p>
                  <div className="space-y-1 text-xs lg:text-sm">
                    <p className="text-genetics-dark-blue-100 flex items-start">
                      <MapPin className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5 lg:mr-2 mt-0.5 flex-shrink-0" />
                      <span>
                        Baraka Estate, Bakoteh
                        <br />
                        Gambia
                      </span>
                    </p>
                    <p className="text-genetics-dark-blue-100 flex items-center">
                      <Phone className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5 lg:mr-2 flex-shrink-0" />
                      <a href="tel:+2202717816" className="hover:text-genetics-gold-400 transition-colors">
                        +220 271 7816
                      </a>
                    </p>
                  </div>
                </div>
                <div className="col-span-2 lg:col-span-1 space-y-1 text-xs lg:text-sm pt-2 lg:pt-2">
                  <p className="text-genetics-dark-blue-100 flex items-center">
                    <Mail className="h-3 w-3 lg:h-4 lg:w-4 mr-1.5 lg:mr-2 flex-shrink-0" />
                    <a href="mailto:contact@groupegenetics.com" className="hover:text-genetics-gold-400 transition-colors break-all">
                      contact@groupegenetics.com
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-genetics-dark-blue-700 pt-6 lg:pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-3 md:space-y-0">
              <p className="text-genetics-dark-blue-200 text-xs lg:text-sm text-center">
                © {new Date().getFullYear()} Genetics. {lang === "fr" ? "Tous droits réservés" : "All rights reserved"}.
              </p>
              <div className="flex space-x-4 lg:space-x-6">
                <a href="#" className="text-genetics-dark-blue-200 hover:text-genetics-gold-400 transition-colors text-xs lg:text-sm">
                  {lang === "fr" ? "Politique de confidentialité" : "Privacy Policy"}
                </a>
                <a href="#" className="text-genetics-dark-blue-200 hover:text-genetics-gold-400 transition-colors text-xs lg:text-sm">
                  {lang === "fr" ? "Conditions d'utilisation" : "Terms of Service"}
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>

      <CookieBanner />
    </div>
  )
}
