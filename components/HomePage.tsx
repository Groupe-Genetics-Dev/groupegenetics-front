"use client"

import { useEffect, useState, type FormEvent, type MouseEvent } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ArrowRight,
  Camera,
  Cloud,
  Code,
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
  Server,
  Shield,
  ShieldAlert,
  Target,
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
import { API_URL, SUPPORT_URL } from "@/lib/config"
import CookieBanner from "./CookieBanner"

type Service = {
  icon: LucideIcon
  title: string
  description: string
  color: "primary" | "accent"
  subServices: { icon: LucideIcon; name: string }[]
}

type SendStatus = "idle" | "sending" | "sent" | "error"

export default function HomePage() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lang, setLang] = useState<Lang>("fr")
  const [contactOpen, setContactOpen] = useState(false)
  const [sendStatus, setSendStatus] = useState<SendStatus>("idle")
  const t = translations[lang]

  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const openContact = (e?: MouseEvent) => {
    e?.preventDefault()
    setSendStatus("idle")
    setContactOpen(true)
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
    { href: SUPPORT_URL, label: t.nav.support },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-genetics-dark-blue-50">
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
      <section id="accueil" className="relative min-h-screen flex items-center justify-center overflow-hidden bg-genetics-dark-blue-950">
        <Image
          src="/hero-bg.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Voile bleu pour garder le texte lisible sur la photo */}
        <div className="absolute inset-0 bg-gradient-to-b from-genetics-dark-blue-950/80 via-genetics-dark-blue-800/60 to-genetics-dark-blue-950/90" />

        {/* Version desktop / tablette */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 sm:px-6 hidden md:block">
          <h1 className="text-5xl lg:text-7xl font-bold text-white mb-6 leading-tight drop-shadow-lg">
            {t.hero.title}
            <span className="text-genetics-dark-blue-100">{t.hero.business}</span>
            {t.hero.by}
            <span className="text-accent">{t.hero.technology}</span>
          </h1>
          <p className="text-xl text-slate-200 mb-8 max-w-3xl mx-auto leading-relaxed">{t.hero.subtitle}</p>
          <div className="flex flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 text-lg px-8 py-3">
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
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4 leading-tight drop-shadow-lg">
            {t.hero.titleMobile}
            <span className="text-accent">{t.hero.it}</span>
            {t.hero.trust}
          </h1>
          <p className="text-lg text-slate-200 mb-6 leading-relaxed">{t.hero.subtitleMobile}</p>
          <div className="flex flex-col gap-3 justify-center">
            <Button asChild size="lg" className="bg-white text-primary hover:bg-slate-100 px-6 py-3">
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
        <div className="w-full px-6 lg:px-12 xl:px-16">
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

          {/* Desktop : pleine largeur */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-8">
            {/* Présentation + contact du CEO */}
            <Card className="lg:col-span-2 border-0 shadow-xl bg-white overflow-hidden">
              <CardContent className="p-10 xl:p-12 h-full flex flex-col">
                <p className="text-lg xl:text-xl text-slate-700 leading-relaxed mb-6">
                  <span className="text-2xl xl:text-3xl font-bold text-primary">GENETICS</span>{" "}
                  {t.about.description1.replace(/^GENETICS\s*/, "")}
                </p>
                <p className="text-lg text-slate-700 leading-relaxed mb-8">{t.about.description2}</p>
                <div className="mt-auto bg-slate-50 rounded-2xl p-6 border border-genetics-dark-blue-100 flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <h4 className="text-lg font-semibold text-slate-900 mb-1">{t.about.ceo}</h4>
                    <p className="text-slate-600">{t.about.ceoRole}</p>
                  </div>
                  <a href="tel:+221788790000" className="flex items-center space-x-3 group">
                    <div className="w-12 h-12 bg-primary group-hover:bg-accent transition-colors rounded-full flex items-center justify-center">
                      <Phone className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600">{t.about.callQuestion}</p>
                      <p className="text-lg font-bold text-primary group-hover:text-accent transition-colors">
                        +221 78 879 00 00
                      </p>
                    </div>
                  </a>
                </div>
              </CardContent>
            </Card>

            {/* Années d'expérience + valeurs */}
            <div className="relative overflow-hidden rounded-xl bg-primary text-white p-10 xl:p-12 flex flex-col justify-between shadow-xl">
              <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full border-[18px] border-accent/40" />
              <div className="absolute -bottom-20 -left-10 w-48 h-48 rounded-full bg-white/5" />
              <div className="relative">
                <div className="text-8xl font-black leading-none">
                  10<span className="text-accent">+</span>
                </div>
                <div className="mt-3 text-xl font-bold">{t.about.years}</div>
                <div className="text-genetics-dark-blue-100 text-lg">{t.about.experience}</div>
              </div>
              <div className="relative grid grid-cols-2 gap-3 mt-10">
                {[
                  { label: t.about.expertise, desc: t.about.expertiseDesc },
                  { label: t.about.agility, desc: t.about.agilityDesc },
                  { label: t.about.efficiency, desc: t.about.efficiencyDesc },
                  { label: t.about.discipline, desc: t.about.disciplineDesc },
                ].map(({ label, desc }) => (
                  <div key={label} className="rounded-xl bg-white/10 border border-white/15 p-4">
                    <div className="font-bold text-genetics-gold-400">{label}</div>
                    <div className="text-xs text-genetics-dark-blue-100 mt-1">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vision */}
            <div className="bg-genetics-dark-blue-50 rounded-2xl p-8 border border-genetics-dark-blue-100">
              <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3">
                  <Eye className="h-5 w-5 text-white" />
                </div>
                {t.about.vision}
              </h4>
              <p className="text-slate-700 leading-relaxed">{t.about.visionText}</p>
            </div>

            {/* Mission */}
            <div className="lg:col-span-2 bg-genetics-gold-50 rounded-2xl p-8 border border-genetics-gold-100">
              <h4 className="text-xl font-bold text-slate-900 mb-4 flex items-center">
                <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mr-3">
                  <Target className="h-5 w-5 text-white" />
                </div>
                {t.about.mission}
              </h4>
              <p className="text-slate-700 leading-relaxed mb-4">{t.about.missionText}</p>
              <ul className="grid grid-cols-2 gap-x-8 gap-y-3 text-slate-700">
                {[t.about.missionItem1, t.about.missionItem2, t.about.missionItem3, t.about.missionItem4].map(
                  (item, i) => (
                    <li key={item} className="flex items-start">
                      <div
                        className={`w-2 h-2 mt-2 ${i % 2 ? "bg-accent" : "bg-primary"} rounded-full mr-3 flex-shrink-0`}
                      />
                      {item}
                    </li>
                  ),
                )}
              </ul>
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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
            {services.map((service) => {
              const isPrimary = service.color === "primary"
              return (
                <Card
                  key={service.title}
                  className={`h-full border-0 border-t-4 ${
                    isPrimary ? "border-t-primary" : "border-t-accent"
                  } shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                  <CardContent className="p-6 lg:p-8">
                    <div className="flex items-center gap-4 mb-6">
                      <div
                        className={`w-14 h-14 ${
                          isPrimary ? "bg-primary" : "bg-accent"
                        } rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg`}
                      >
                        <service.icon className="h-7 w-7 text-white" />
                      </div>
                      <div>
                        <h3 className="text-lg xl:text-xl font-bold text-slate-900 leading-snug">{service.title}</h3>
                        <p className="text-slate-600 text-sm">{service.description}</p>
                      </div>
                    </div>
                    <ul className="space-y-2">
                      {service.subServices.map((sub) => (
                        <li
                          key={sub.name}
                          className="flex items-center gap-3 p-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors"
                        >
                          <div
                            className={`w-8 h-8 ${
                              isPrimary ? "bg-primary/10 text-primary" : "bg-accent/15 text-accent"
                            } rounded-lg flex items-center justify-center flex-shrink-0`}
                          >
                            <sub.icon className="h-4 w-4" />
                          </div>
                          <span className="text-slate-700 font-medium text-sm">{sub.name}</span>
                        </li>
                      ))}
                    </ul>
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
