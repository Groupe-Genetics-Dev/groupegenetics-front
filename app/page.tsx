import Header from "@/components/Header"
import Hero from "@/components/Hero"
import About from "@/components/About"
import Solutions from "@/components/Solutions"
import Contact from "@/components/Contact"
import Footer from "@/components/Footer"

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Solutions />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
