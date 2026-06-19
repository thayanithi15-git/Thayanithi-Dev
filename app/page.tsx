"use client"

import { useState } from "react"
import { AnimatePresence } from "framer-motion"
import { Navigation } from "@/components/ascii-hub/navigation"
import { HeroSection } from "@/components/ascii-hub/hero-section"
import { DomainSection } from "@/components/ascii-hub/domain-section"
import { TechTicker } from "@/components/ascii-hub/tech-ticker"
import { PseudoTerminal } from "@/components/ascii-hub/pseudo-terminal"
import { Footer } from "@/components/ascii-hub/footer"
import { ShutdownManager } from "@/components/ascii-hub/shutdown-manager"
import { Preloader } from "@/components/ascii-hub/preloader"
import { techSections } from "@/lib/sections-data"

export default function Home() {
  const [isLoading, setIsLoading] = useState(true)

  return (
    <div className="min-h-screen bg-background text-foreground">
      <AnimatePresence mode="wait">
        {isLoading && <Preloader onComplete={() => setIsLoading(false)} />}
      </AnimatePresence>

      <Navigation />

      <main>
        {!isLoading && <HeroSection />}

        <TechTicker />

        {techSections.map((section, index) => (
          <DomainSection
            key={section.id}
            section={section}
            index={index}
          />
        ))}

        <PseudoTerminal />
      </main>

      <Footer />
      <ShutdownManager />
    </div>
  )
}
