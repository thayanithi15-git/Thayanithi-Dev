"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Sun, Moon, Terminal } from "lucide-react"
import { useTheme } from "next-themes"
import { flushSync } from "react-dom"

export function ProjectHeader({ projectName }: { projectName?: string }) {
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const { theme, setTheme } = useTheme()

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      setScrolled(window.scrollY > 30)
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

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 w-full max-w-full overflow-x-hidden ${
        scrolled
          ? "bg-background/85 backdrop-blur-md border-b border-border shadow-sm"
          : "bg-background/40 backdrop-blur-sm border-b border-border/40"
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 lg:px-8 w-full max-w-full">
        {/* Left: Back Icon Link to Portfolio */}
        <div className="flex items-center gap-4">
          <Link
            href="/#hardware-abstraction"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold border border-border px-3 py-1.5 rounded-sm text-foreground bg-secondary/20 hover:bg-foreground hover:text-background transition-all duration-200"
            aria-label="Back to Portfolio"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Portfolio</span>
          </Link>

          <span className="hidden sm:inline-block text-border font-mono text-xs">|</span>

          {/* Project Title Badge */}
          {projectName && (
            <div className="hidden md:flex items-center gap-2 font-mono text-xs text-muted-foreground">
              <Terminal className="h-3.5 w-3.5 text-emerald-500" />
              <span className="font-pixel text-[11px] text-foreground uppercase tracking-wide">{projectName}</span>
            </div>
          )}
        </div>

        {/* Right: Home Link & Theme Toggle */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="font-pixel-line text-sm md:text-base font-bold text-foreground hover:text-muted-foreground transition-colors duration-200"
          >
            THAYANITHI S
          </Link>

          {mounted && (
            <button
              onClick={toggleTheme}
              className="p-1.5 border border-border text-foreground hover:bg-secondary transition-colors duration-200 rounded-sm"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
            </button>
          )}
        </div>
      </nav>
    </header>
  )
}
