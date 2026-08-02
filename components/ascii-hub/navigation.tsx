"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { navLinks } from "@/lib/sections-data"
import { Menu, X, Sun, Moon } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

export function Navigation() {
  const [activeSection, setActiveSection] = useState("")
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 50)

      const sections = navLinks.map((link) => document.getElementById(link.id))
      const scrollPos = window.scrollY + 120

      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i]
        if (section && section.offsetTop <= scrollPos) {
          setActiveSection(navLinks[i].id)
          return
        }
      }
      setActiveSection("")
    }

    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    const nextTheme = theme === "dark" ? "light" : "dark"
    if (typeof document === "undefined" || !document.startViewTransition) {
      setTheme(nextTheme)
      return
    }

    document.startViewTransition(() => {
      flushSync(() => {
        setTheme(nextTheme)
      })
    })
  }

  const handleLogoClick = (e: React.MouseEvent) => {
    e.preventDefault()
    if (typeof window !== "undefined" && window.location.pathname !== "/") {
      window.location.href = "/#hero"
    } else {
      const heroEl = document.getElementById("hero")
      if (heroEl) {
        const offset = 80
        const top = heroEl.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: "smooth" })
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" })
      }
    }
  }

  const scrollToSection = (id: string) => {
    setIsMobileMenuOpen(false)
    setTimeout(() => {
      if (typeof window !== "undefined" && window.location.pathname !== "/") {
        window.location.href = `/#${id}`
        return
      }
      const el = document.getElementById(id)
      if (el) {
        const offset = 80
        const top = el.getBoundingClientRect().top + window.scrollY - offset
        window.scrollTo({ top, behavior: "smooth" })
      } else {
        window.location.href = `/#${id}`
      }
    }, 300)
  }

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full max-w-full overflow-x-hidden ${
        scrolled
          ? "bg-background/80 backdrop-blur-md border-b border-border"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 lg:px-8 w-full max-w-full">
        <button
          onClick={handleLogoClick}
          className="flex items-center transition-all duration-200 hover:opacity-70 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
          aria-label="Navigate to hero section"
        >
          <img
            src={!mounted || theme === "dark" ? "/T_Light.png" : "/T_Dark.png"}
            alt="Thayanithi S Logo"
            className="h-10 sm:h-12 mr-4 lg:mr-10 w-auto object-contain"
          />
        </button>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <button
              key={link.id}
              onClick={() => scrollToSection(link.id)}
              className={`px-3 py-1.5 font-mono text-xs transition-all duration-200 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none ${
                activeSection === link.id
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:bg-foreground hover:text-background"
              }`}
            >
              <span className="opacity-50">{link.number}</span>{" "}
              {link.title.toUpperCase()}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="ml-2 p-1.5 cursor-pointer font-mono text-foreground transition-all duration-200 hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none border border-border"
            aria-label="Toggle Theme"
          >
            {!mounted ? (
              <div className="h-4 w-4" />
            ) : theme === "dark" ? (
              <Moon size={16} />
            ) : (
              <Sun size={16} />
            )}
          </button>
        </div>

        {/* Mobile Menu Toggle & Theme Changer */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            onClick={toggleTheme}
            className="p-2 font-mono cursor-pointer text-foreground transition-all duration-200 hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none border border-border"
            aria-label="Toggle Theme"
          >
            {!mounted ? (
              <div className="h-5 w-5" />
            ) : theme === "dark" ? (
              <Moon size={20} />
            ) : (
              <Sun size={20} />
            )}
          </button>
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 font-mono text-foreground transition-all duration-200 hover:bg-foreground hover:text-background focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
            aria-label={isMobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden border-b border-border bg-background/95 backdrop-blur-md lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4">
              {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className={`px-3 py-2 text-left font-mono text-sm transition-all duration-200 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none ${
                    activeSection === link.id
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-foreground hover:text-background"
                  }`}
                >
                  <span className="opacity-50">{link.number}</span>{" "}
                  {link.title.toUpperCase()}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
