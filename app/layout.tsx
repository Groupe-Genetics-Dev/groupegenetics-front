import type { Metadata, Viewport } from "next"
import { Inter } from "next/font/google"
import { I18nProvider } from "@/lib/i18n"
import { dictionaries } from "@/lib/content"
import "./globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

const { meta } = dictionaries.fr

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://www.groupegenetics.com"),
  title: meta.title,
  description: meta.description,
  icons: { icon: "/logo.png" },
  openGraph: {
    title: meta.title,
    description: meta.description,
    images: ["/logo.png"],
    locale: "fr_FR",
    type: "website",
  },
}

export const viewport: Viewport = {
  themeColor: "#032454",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={inter.variable}>
      <body className="font-sans">
        <I18nProvider>{children}</I18nProvider>
      </body>
    </html>
  )
}
