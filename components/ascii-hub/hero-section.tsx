"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion } from "framer-motion"

const ASCII_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*+=-~^"

function useAsciiFrame(rows: number, cols: number, enabled: boolean) {
  const [frame, setFrame] = useState("")
  const rafRef = useRef<number>(0)
  const lastTimeRef = useRef<number>(0)

  const generateFrame = useCallback(() => {
    let result = ""
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const distFromCenter = Math.abs(c - cols / 2) / (cols / 2)
        const vertDist = Math.abs(r - rows / 2) / (rows / 2)
        const dist = Math.sqrt(distFromCenter ** 2 + vertDist ** 2)
        if (Math.random() > dist * 0.7) {
          result += ASCII_CHARS[Math.floor(Math.random() * ASCII_CHARS.length)]
        } else {
          result += " "
        }
      }
      if (r < rows - 1) result += "\n"
    }
    return result
  }, [rows, cols])

  useEffect(() => {
    if (!enabled) {
      setFrame(generateFrame())
      return
    }

    const animate = (time: number) => {
      if (time - lastTimeRef.current > 120) {
        lastTimeRef.current = time
        setFrame(generateFrame())
      }
      rafRef.current = requestAnimationFrame(animate)
    }

    rafRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafRef.current)
  }, [enabled, generateFrame])

  return frame
}

function DecryptedText({ text, speed = 30, delay = 0 }: { text: string; speed?: number; delay?: number }) {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*"
  
  // Initialize with fully scrambled characters immediately to avoid initial flash of resolved text
  const [displayText, setDisplayText] = useState(() => 
    text.split("").map(c => c === " " ? " " : chars[Math.floor(Math.random() * chars.length)]).join("")
  )

  useEffect(() => {
    let currentIteration = -Math.floor(delay / speed) // Start negative to act as the scramble delay

    const interval = setInterval(() => {
      setDisplayText(() => {
        return text
          .split("")
          .map((char, index) => {
            if (char === " ") return " "
            // If still in delay phase (currentIteration < 0), keep scrambling
            if (index < currentIteration) {
              return text[index]
            }
            return chars[Math.floor(Math.random() * chars.length)]
          })
          .join("")
      })

      if (currentIteration >= text.length) {
        clearInterval(interval)
      }
      currentIteration += 1
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, delay])

  return <span>{displayText}</span>
}

function TerminalShowcase() {
  const [lines, setLines] = useState<string[]>([])
  const [lineIdx, setLineIdx] = useState(0)
  const [charIdx, setCharIdx] = useState(0)
  const [isDone, setIsDone] = useState(false)
  const [telemetryTicks, setTelemetryTicks] = useState(0)

  const setupScript = [
    "initializing portfolio_env...",
    "systems_engineer: Thayanithi S",
    "domain: Fullstack / Mobile / Backend Architect",
    "status: OPERATIONAL",
  ]

  // Typing effect
  useEffect(() => {
    if (lineIdx >= setupScript.length) {
      setIsDone(true)
      return
    }

    const currentLineText = setupScript[lineIdx]
    const timeout = setTimeout(() => {
      setLines(prev => {
        const next = [...prev]
        if (!next[lineIdx]) {
          next[lineIdx] = ""
        }
        next[lineIdx] = "> " + currentLineText.slice(0, charIdx + 1)
        return next
      })

      if (charIdx < currentLineText.length - 1) {
        setCharIdx(prev => prev + 1)
      } else {
        setLineIdx(prev => prev + 1)
        setCharIdx(0)
      }
    }, 20)

    return () => clearTimeout(timeout)
  }, [lineIdx, charIdx])

  // Post-typing telemetry loop
  useEffect(() => {
    if (!isDone) return

    const interval = setInterval(() => {
      setTelemetryTicks(t => t + 1)
    }, 1500)

    return () => clearInterval(interval)
  }, [isDone])

  const getTelemetryLog = () => {
    const ticks = telemetryTicks
    const cpuBar = "=".repeat(1 + (ticks % 8)) + " ".repeat(8 - (ticks % 8))
    const ramBar = "=".repeat(3 + ((ticks * 2) % 6)) + " ".repeat(8 - ((ticks * 2) % 6))
    return `
> CPU_CORE_LOAD: [${cpuBar}] ${(30 + (ticks * 7) % 65)}%
> MEMORY_ALLOC:  [${ramBar}] ${(20 + (ticks * 5) % 45)}%
> STATE:         STABLE_FLOW`
  }

  return (
    <pre className="overflow-hidden whitespace-pre-wrap break-all font-mono text-[10px] leading-relaxed text-foreground/80 md:text-xs min-h-[120px]">
      {lines.map((line, idx) => (
        <div key={idx}>{line}</div>
      ))}
      {isDone && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-emerald-500/90"
        >
          {getTelemetryLog()}
        </motion.div>
      )}
      {!isDone && (
        <span>
          &gt; _<span className="animate-blink">{"█"}</span>
        </span>
      )}
      {isDone && (
        <div className="mt-1">
          <span>&gt; _</span>
          <span className="animate-blink">{"█"}</span>
        </div>
      )}
    </pre>
  )
}

export function HeroSection() {
  const [motionEnabled, setMotionEnabled] = useState(true)

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    setMotionEnabled(!mq.matches)
    const handler = (e: MediaQueryListEvent) => setMotionEnabled(!e.matches)
    mq.addEventListener("change", handler)
    return () => mq.removeEventListener("change", handler)
  }, [])

  const asciiFrame = useAsciiFrame(30, 80, motionEnabled)

  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault()
    const el = document.getElementById(id)
    if (el) {
      const offset = 80
      const top = el.getBoundingClientRect().top + window.scrollY - offset
      window.scrollTo({ top, behavior: "smooth" })
    }
  }

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 sm:px-8 lg:px-12">
      {/* Scanline overlay */}
      {motionEnabled && (
        <div
          className="animate-scanline pointer-events-none absolute inset-0 z-10 h-[2px] w-full bg-foreground/5"
          aria-hidden="true"
        />
      )}

      {/* ASCII Background */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden opacity-[0.10]"
        aria-hidden="true"
      >
        <pre className="font-mono text-sm leading-[18px] text-foreground lg:text-base lg:leading-[22px]">
          {asciiFrame}
        </pre>
      </div>

      {/* Main Content */}
      <div className="relative z-20 flex w-full max-w-5xl flex-col items-start gap-8 text-left">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col items-start gap-6"
        >
          <div className="inline-flex items-center gap-2 border mt-4 border-border px-3 py-1 font-mono text-xs text-muted-foreground">
            <span className="inline-block h-1.5 w-1.5 bg-foreground" />
            <span>PORTFOLIO & CORE SYSTEMS</span>
          </div>

          <h1 className="font-pixel-line text-5xl font-bold leading-none tracking-tight text-foreground text-balance md:text-7xl lg:text-8xl">
            <DecryptedText text="Thayanithi S" delay={600} speed={40} />
            <br />
            <span className="text-muted-foreground text-3xl text-wrap md:text-nowrap sm:text-5xl md:text-6xl lg:text-7xl block mt-2 leading-[1.1] font-semibold">
              <DecryptedText text="SDE & Infra Engineer" delay={1200} speed={25} />
            </span>
          </h1>

          <p className="max-w-prose font-mono text-sm leading-relaxed text-muted-foreground md:text-base">
            Architecting raw logic into refined, high-performance systems.
            <br className="hidden md:block" />
            Specializing in distributed backend architectures, cross-platform mobile apps, and robust fullstack engineering.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="flex flex-col items-stretch gap-4 sm:flex-row w-full sm:w-auto"
        >
          <a
            href="#kernel-systems"
            onClick={(e) => handleScrollTo(e, "kernel-systems")}
            className="group flex items-center justify-center gap-2 border border-foreground bg-foreground px-6 py-3 font-mono text-sm text-background transition-all duration-200 hover:bg-transparent hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none w-full sm:w-auto"
          >
            Explore the Systems
            <span className="transition-transform duration-200 group-hover:translate-x-1">
              {"->"}
            </span>
          </a>
          <a
            href="#hardware-abstraction"
            onClick={(e) => handleScrollTo(e, "hardware-abstraction")}
            className="flex items-center justify-center gap-2 border border-border px-6 py-3 font-mono text-sm text-muted-foreground transition-all duration-200 hover:border-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none w-full sm:w-auto"
          >
            View Projects
          </a>
        </motion.div>

        {/* Animated ASCII art display */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="mt-8 mb-4 w-full max-w-lg border border-border bg-secondary/50 p-4"
          role="img"
          aria-label="ASCII art animation representing a terminal interface"
        >
          <div className="mb-2 flex items-center gap-2">
            <div className="h-2 w-2 bg-muted-foreground" />
            <div className="h-2 w-2 bg-muted-foreground/50" />
            <div className="h-2 w-2 bg-muted-foreground/30" />
            <span className="ml-2 font-mono text-[10px] text-muted-foreground">
              thayanithi-s ~ terminal-showcase
            </span>
          </div>
          <TerminalShowcase />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="absolute bottom-8 flex flex-col items-center gap-2 z-30"
      >
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Scroll to Explore
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="h-4 w-[1px] bg-muted-foreground"
        />
      </motion.div>
    </section>
  )
}
