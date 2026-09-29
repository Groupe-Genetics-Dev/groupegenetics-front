import type { Metadata } from "next"
import "@fontsource-variable/inter"
import "./globals.css"

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.groupegenetics.com"),
  title: "GENETICS - Solutions IT & Transformation Digitale",
  description:
    "GENETICS - Votre partenaire pour les solutions IT, Cloud, Conseil et Transformation Digitale au Sénégal et en Gambie",
  icons: { icon: "/logo.png", shortcut: "/logo.png", apple: "/logo.png" },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <body className="font-sans">{children}</body>
    </html>
  )
}
