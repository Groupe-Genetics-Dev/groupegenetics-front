"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    if (!localStorage.getItem("cookie_consent")) setVisible(true)
  }, [])

  if (!visible) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[999] bg-genetics-dark-blue-950/95 backdrop-blur-md text-white p-4 shadow-lg">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-sm text-center md:text-left">
          Nous utilisons des cookies pour améliorer votre expérience sur notre site. En continuant à naviguer, vous
          acceptez notre utilisation des cookies.
          <a href="/politique-de-confidentialite" className="underline ml-1 hover:text-primary transition-colors">
            En savoir plus
          </a>
        </p>
        <Button
          onClick={() => {
            localStorage.setItem("cookie_consent", "true")
            setVisible(false)
          }}
          className="bg-primary hover:bg-genetics-dark-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium flex-shrink-0"
        >
          Accepter les cookies
        </Button>
      </div>
    </div>
  )
}
