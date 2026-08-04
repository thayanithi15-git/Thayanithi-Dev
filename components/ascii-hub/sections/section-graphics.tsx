"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import type { TechSection } from "@/lib/sections-data"
import Image, { StaticImageData } from "next/image"

import crayonImg from "@/assets/cert/crayon.jpg"
import nptelJavaImg from "@/assets/cert/nptel_java.png"
import sakthiImg from "@/assets/cert/sakthi.jpg"
import nkImg from "@/assets/cert/naalaiyakalam.jpg"
import hackElevateImg from "@/assets/cert/hack_elevate.png"
import sihImg from "@/assets/cert/sih.png"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 05: GRAPHICS PIPELINES
  Style: Oscilloscope / scanline waveform animation.
*/

const POINTS = 120

const wavePoints = [
  { baseXPercent: 0.0, date: "MAR 2026", text: "Caterpillar Tech Challenge '26", type: "EVENT" },
  { baseXPercent: 0.11, date: "AUG 2025", text: "Sakthi Hackathon 1.0 Finalist", type: "HACKATHON" },
  { baseXPercent: 0.22, date: "DEC 2025", text: "Smart India Hackathon (SIH)", type: "HACKATHON" },
  { baseXPercent: 0.33, date: "SEP 24 - APR 25", text: "Software Intern @ Crayon'd", type: "EXP" },
  { baseXPercent: 0.44, date: "DEC 2025", text: "NPTEL Java Elite Cert (90%)", type: "CERT" },
  { baseXPercent: 0.55, date: "SEP 2025", text: "Code Cubicle 5.0", type: "HACKATHON" },
  { baseXPercent: 0.66, date: "NOV 2025", text: "TN Skills '25 Round 2", type: "EVENT" },
  { baseXPercent: 0.77, date: "APR 2026", text: "Hack Elevate'26", type: "HACKATHON" },
  { baseXPercent: 0.88, date: "NOV 2024", text: "Naalaiya Kalam'24", type: "EVENT" }
]

type WavePoint = (typeof wavePoints)[number]

function getWaveY(xPercent: number, t: number, H: number): number {
  const phase = xPercent * Math.PI * 2

  // Dynamic amplitude modulation envelope creating distinct high peaks ("too up"), medium waves, and low ripples
  const primarySurge = Math.pow(Math.sin(phase * 1.5 + t * 0.6) * 0.5 + 0.5, 2.2)
  const secondaryMod = Math.sin(phase * 3.5 - t * 0.9) * 0.35
  const envelope = Math.max(0.15, Math.min(1.0, 0.20 + primarySurge * 0.75 + secondaryMod))

  // Carrier waveform with multi-frequency GPU signal harmonics
  const wave =
    Math.sin(phase * 4 + t * 1.3) * 0.58 +
    Math.sin(phase * 10 - t * 2.0) * 0.26 +
    Math.sin(phase * 18 + t * 2.8) * 0.11 +
    Math.cos(phase * 2 - t * 0.4) * 0.15

  return H / 2 + (H * 0.36) * envelope * wave
}

function getSecondaryWaveY(xPercent: number, t: number, H: number): number {
  const phase = xPercent * Math.PI * 2
  const envelope = 0.2 + 0.5 * (Math.cos(phase * 2.5 - t * 0.7) * 0.5 + 0.5)
  const wave =
    Math.sin(phase * 6 + t * 1.6 + 1.2) * 0.65 +
    Math.sin(phase * 14 - t * 2.3) * 0.35
  return H / 2 + (H * 0.24) * envelope * wave
}

function Oscilloscope({ onHoverPoint }: { onHoverPoint?: (index: number | null) => void }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [hoveredPoint, setHoveredPoint] = useState<WavePoint | null>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const hoveredPointRef = useRef<WavePoint | null>(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let t = 0

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      ctx.clearRect(0, 0, W, H)

      // Detect light/dark theme dynamically
      const isDark = document.documentElement.classList.contains("dark")

      // Scanline glow background lines
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.03)" : "rgba(0,0,0,0.03)"
      ctx.lineWidth = 1
      for (let y = 0; y < H; y += 4) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(W, y)
        ctx.stroke()
      }

      // Grid
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"
      ctx.lineWidth = 0.5
      const cols = 8
      const rows = 4
      for (let i = 0; i <= cols; i++) {
        const x = (W / cols) * i
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke()
      }
      for (let i = 0; i <= rows; i++) {
        const y = (H / rows) * i
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke()
      }

      // Main waveform — dynamic amplitude composite
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)"
      ctx.lineWidth = 2
      ctx.shadowColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)"
      ctx.shadowBlur = isDark ? 8 : 2
      ctx.beginPath()
      for (let i = 0; i <= POINTS; i++) {
        const x = (W / POINTS) * i
        const xPercent = i / POINTS
        const y = getWaveY(xPercent, t, H)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      // Secondary dim waveform
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.15)"
      ctx.lineWidth = 1
      ctx.shadowBlur = 0
      ctx.beginPath()
      for (let i = 0; i <= POINTS; i++) {
        const x = (W / POINTS) * i
        const xPercent = i / POINTS
        const y = getSecondaryWaveY(xPercent, t, H)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      let hoveredAny: WavePoint | null = null
      let isPointer = false

      // Draw milestones pinned to active wave coordinates, moving right to left
      wavePoints.forEach((point) => {
        let xPercent = (point.baseXPercent - t * 0.05) % 1
        if (xPercent < 0) xPercent += 1

        const x = W * xPercent
        const y = getWaveY(xPercent, t, H)

        // Mouse collision check
        if (mouseRef.current) {
          const dx = mouseRef.current.x - x
          const dy = mouseRef.current.y - y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 25) {
            hoveredAny = point
            isPointer = true
          }
        }

        const isCurrentHovered = hoveredPointRef.current?.text === point.text

        // Wave Pinned Dot
        ctx.fillStyle = isDark ? "#ffffff" : "#000000"
        ctx.beginPath()
        ctx.arc(x, y, isCurrentHovered ? 6 : 4, 0, Math.PI * 2)
        ctx.fill()

        // Highlight ring on hovered
        if (isCurrentHovered) {
          ctx.strokeStyle = isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)"
          ctx.lineWidth = 1.5
          ctx.beginPath()
          ctx.arc(x, y, 10, 0, Math.PI * 2)
          ctx.stroke()
        }

        // Vertical Guide Line
        ctx.strokeStyle = isDark 
          ? (isCurrentHovered ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.15)") 
          : (isCurrentHovered ? "rgba(0,0,0,0.4)" : "rgba(0,0,0,0.15)")
        ctx.setLineDash([2, 4])
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, H)
        ctx.stroke()
        ctx.setLineDash([])

        // Info Text Label with dynamic vertical positioning to prevent top clipping on high peaks
        if (W > 768 || isCurrentHovered) {
          const isNearTop = y < 45
          const textYTitle = isNearTop ? y + 18 : y - 6
          const textYDate = isNearTop ? y + 30 : y + 8

          ctx.fillStyle = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.95)"
          ctx.font = isCurrentHovered ? "bold 12px monospace" : "bold 11px monospace"
          ctx.fillText(point.text, x + 8, textYTitle)
          
          ctx.fillStyle = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
          ctx.font = isCurrentHovered ? "bold 11px monospace" : "11px monospace"
          ctx.fillText(point.date, x + 8, textYDate)
        }
      })

      // Update canvas cursor style
      if (canvas) {
        canvas.style.cursor = isPointer ? "pointer" : "default"
      }

      // Update state if hovered point changes
      if (hoveredPointRef.current !== hoveredAny) {
        hoveredPointRef.current = hoveredAny
        setHoveredPoint(hoveredAny)
        if (onHoverPoint) {
          if (hoveredAny) {
            const activePoint = hoveredAny
            const idx = wavePoints.findIndex(p => p.text === activePoint.text)
            if (idx !== -1) onHoverPoint(idx)
          } else {
            onHoverPoint(null)
          }
        }
      }

      // If no point is hovered, continue wave time progression
      if (!hoveredAny) {
        t += 0.008
      }
      animRef.current = requestAnimationFrame(draw)
    }

    // Resize observer
    const observer = new ResizeObserver(() => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    })
    observer.observe(canvas)
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    animRef.current = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(animRef.current)
      observer.disconnect()
    }
  }, [])

  const onMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = ref.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    }
  }

  const onMouseLeave = () => {
    mouseRef.current = null
  }

  return (
    <div className="relative w-full">
      {/* Details HUD Bar on Top */}
      <div className="absolute top-2 left-2 right-2 z-20 flex items-center justify-between pointer-events-none font-mono text-[10px] bg-background/85 backdrop-blur-md px-3 py-2 border border-border/80 rounded-sm min-h-[38px] transition-all duration-300">
        {hoveredPoint ? (
          <div className="flex items-center justify-between w-full">
            <span className="text-foreground font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 bg-foreground rounded-full animate-pulse shrink-0" />
              [{hoveredPoint.type}] {hoveredPoint.text}
            </span>
            <span className="text-muted-foreground uppercase text-[10px]">
              DATE: {hoveredPoint.date}
            </span>
          </div>
        ) : (
          <div className="text-muted-foreground/60 w-full text-center">
            // HOVER ON ANY WAVE NODE TO PAUSE STREAM & VIEW DETAILS
          </div>
        )}
      </div>

      <canvas
        ref={ref}
        onMouseMove={onMouseMove}
        onMouseLeave={onMouseLeave}
        className="h-64 w-full border border-border bg-background md:h-80 cursor-default block"
        style={{ boxShadow: shadow }}
      />
    </div>
  )
}

interface CredentialItem {
  title: string
  issuer: string
  date: string
  duration: string
  badge: string
  desc: string
  type: string
  code: string
  image: StaticImageData | null
}

const credentials: CredentialItem[] = [
  {
    title: "Caterpillar Tech Challenge 2026",
    issuer: "Caterpillar Inc.",
    date: "March 2026",
    duration: "Problem Statement 4 - Optimal Dump Packing",
    badge: "Round 3 Finalist",
    desc: "Caterpillar is the world's leading manufacturer of construction and mining equipment. Competed in Problem Statement 4 - Optimal Dump Packing, advancing through to Round 3.",
    type: "EVENT",
    code: "CAT-TECH-26",
    image: null,
  },
  {
    title: "Sakthi Hackathon 1.0",
    issuer: "Dr. Mahalingam College of Eng & Tech",
    date: "August 13-14, 2025",
    duration: "24 Hours National Event",
    badge: "Finalist",
    desc: "Recognized for valuable participation and engineering a robust software prototype in 24 hours.",
    type: "HACKATHON",
    code: "SAKTHI-HACK-1.0",
    image: sakthiImg,
  },
  {
    title: "Smart India Hackathon (SIH)",
    issuer: "Ministry of Education & AICTE",
    date: "December 2025",
    duration: "Premier Nationwide Initiative",
    badge: "Waiting List",
    desc: "Smart India Hackathon (SIH) is a premier nationwide initiative designed to engage students in solving pressing challenges faced in everyday life. Selected for the Waiting List round.",
    type: "HACKATHON",
    code: "SIH-2025",
    image: sihImg,
  },
  {
    title: "Crayon'd Full-Stack Internship",
    issuer: "Crayon'd",
    date: "July 30, 2025",
    duration: "Sept 19, 2024 – Apr 5, 2025",
    badge: "Internship Complete",
    desc: "1000+ hours of fullstack web development engineering and client feature delivery.",
    type: "INTERNSHIP",
    code: "CRYND-FS-25",
    image: crayonImg,
  },
  {
    title: "Programming in Java",
    issuer: "NPTEL (IIT Kharagpur)",
    date: "December 2025",
    duration: "12 Weeks Online Course",
    badge: "90% Elite Badge",
    desc: "Successfully completed the advanced Programming in Java course with Elite status classification.",
    type: "COURSE",
    code: "NPTEL-JV-25",
    image: nptelJavaImg,
  },
  {
    title: "Code Cubicle 5.0",
    issuer: "Geek Room Team",
    date: "September 2025",
    duration: "Flagship Hybrid Hackathon",
    badge: "Participated",
    desc: "Code Cubicle is Geek Room's flagship hybrid hackathon series that brings together the brightest young innovators from across India to solve complex challenges.",
    type: "HACKATHON",
    code: "CC-5.0-2025",
    image: null,
  },
  {
    title: "TN Skills Competition 2025",
    issuer: "TNSDC (Naan Mudhalvan)",
    date: "November 2025",
    duration: "Naan Mudhalvan – TN Skills Team",
    badge: "Round 2 Qualifier",
    desc: "Featured Web Technologies as a core individual IT skill category, organized by Tamil Nadu Skill Development Corporation (TNSDC) under Naan Mudhalvan platform to select top talent for IndiaSkills and WorldSkills.",
    type: "EVENT",
    code: "TNSKILLS-2025",
    image: null,
  },
  {
    title: "Hack Elevate’26",
    issuer: "Novus Solutions",
    date: "April 2026",
    duration: "National-Level Innovation Hackathon",
    badge: "Certificate Awarded",
    desc: "Hack Elevate'26 is a national-level innovation hackathon organized by Novus Solutions to empower students, developers, and innovators to build impactful technical solutions.",
    type: "HACKATHON",
    code: "HACK-ELEVATE-26",
    image: hackElevateImg,
  },
  {
    title: "Naalaiya Kalam'24",
    issuer: "Bannari Amman Institute of Tech",
    date: "November 2024",
    duration: "Makkal Sinthanai Peravai",
    badge: "Completed",
    desc: "Participated in NAALAIYA KALAM'24 event focusing on educational and community-oriented tech projects.",
    type: "EVENT",
    code: "NK-24",
    image: nkImg,
  },
]

export function SectionGraphics({ section }: { section: TechSection }) {
  const [activeIdx, setActiveIdx] = useState(0) // Start with first certificate loaded
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % credentials.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [isPaused])

  const handleHoverPoint = (idx: number | null) => {
    if (idx !== null && idx >= 0 && idx < credentials.length) {
      setActiveIdx(idx)
      setIsPaused(true)
    } else {
      setIsPaused(false)
    }
  }

  const activeCred = credentials[activeIdx] || credentials[0]

  return (
    <div className="py-20 lg:py-32 font-mono">
      <div className="mx-auto max-w-7xl px-4 lg:px-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mb-10 flex items-end gap-6"
        >
          <span className="font-pixel-line text-7xl font-bold leading-none text-foreground/[0.08] md:text-9xl">
            {section.number}
          </span>
          <div className="pb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{section.subtitle}</span>
            <h2 className="font-pixel-line text-3xl font-bold text-foreground md:text-5xl">
              {section.title}
            </h2>
          </div>
        </motion.div>

        {/* Oscilloscope */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className="h-2 w-2 animate-pulse bg-emerald-400 rounded-full" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SIGNAL — GPU WAVEFORM</span>
          </div>
          <Oscilloscope onHoverPoint={handleHoverPoint} />
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-8 max-w-3xl font-mono text-sm leading-relaxed text-muted-foreground"
        >
          {section.description}
        </motion.p>

        {/* Interactive Telemetry Dashboard (Replaces standard Grid) */}
        <div 
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="mt-12 grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch font-mono"
        >
          {/* Left Panel: Compact Registry Rows (5 columns) */}
          <div className="lg:col-span-5 flex flex-col border border-border bg-secondary/5 rounded-sm overflow-hidden" style={{ boxShadow: shadow }}>
            <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-secondary/10">
              <span className="text-[10px] uppercase font-bold text-foreground tracking-wider flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Certifications & Events Log
              </span>
              <span className="text-[8px] text-muted-foreground/60">// SYS_REG_MATRIX</span>
            </div>
            
            <div className="flex flex-col divide-y divide-border/40 max-h-[520px] overflow-y-auto">
              {credentials.map((cred, idx) => {
                const isActive = activeIdx === idx
                return (
                  <button
                    key={cred.code}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    className={`flex flex-col gap-1 p-3.5 text-left transition-all duration-200 border-l-2 focus:outline-none ${
                      isActive 
                        ? "border-l-emerald-400 bg-secondary/15" 
                        : "border-l-transparent hover:bg-secondary/10"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[8px] uppercase tracking-wider text-emerald-400/90 font-bold">
                        [{cred.type}] {cred.code}
                      </span>
                      <span className="text-[9px] text-muted-foreground/80">{cred.date}</span>
                    </div>
                    <span className={`text-xs font-bold transition-colors duration-250 ${
                      isActive ? "text-foreground" : "text-foreground/70"
                    }`}>
                      {cred.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground/80 truncate">
                      {cred.issuer}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Right Panel: Telemetry Monitor Viewport (7 columns) */}
          <div className="lg:col-span-7 border border-border p-5 bg-[#0a0c0f] rounded-sm flex flex-col justify-between" style={{ boxShadow: shadow }}>
            <div className="flex flex-col gap-4 h-full">
              {/* Telemetry Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-2">
                <div className="flex items-center gap-2">
                  <div className="h-1.5 w-1.5 bg-emerald-400 rounded-full animate-pulse" />
                  <span className="text-[9px] uppercase tracking-wider text-foreground/80 font-bold">
                    VIEWPORT: {activeCred.type === "EVENT" || activeCred.type === "HACKATHON" ? "EVENT_RECORD" : "CERTIFICATE_STREAM"}
                  </span>
                </div>
                <span className="text-[8px] text-muted-foreground/50">REF_ID: {activeCred.code}</span>
              </div>

              {/* Monitor Screen Frame */}
              <div className="relative w-full aspect-[16/10] border border-border/80 overflow-hidden bg-black/40 rounded-[2px]" style={{ boxShadow: shadow }}>
                {activeCred.image ? (
                  <Image
                    src={activeCred.image}
                    alt={activeCred.title}
                    fill
                    sizes="(max-width: 1024px) 100vw, 550px"
                    className="object-contain grayscale hover:grayscale-0 transition-all duration-500 ease-in-out cursor-crosshair hover:scale-[1.02]"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col justify-center items-center p-6 text-center bg-secondary/10 font-mono relative overflow-hidden border border-border/40">
                    <div className="absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:16px_16px]" />
                    <span className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest px-2.5 py-1 border border-emerald-500/30 bg-emerald-500/10 rounded-xs mb-3 z-10">
                      // {activeCred.type} RECORD
                    </span>
                    <h4 className="font-pixel-line text-lg font-bold text-foreground mb-2 z-10">
                      {activeCred.title}
                    </h4>
                    <p className="text-xs text-muted-foreground max-w-md z-10 leading-relaxed">
                      {activeCred.desc}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-[10px] text-foreground/90 z-10 font-bold">
                      <span className="px-2 py-0.5 border border-border bg-background rounded-xs">
                        {activeCred.issuer}
                      </span>
                      <span>•</span>
                      <span className="px-2 py-0.5 border border-border bg-background rounded-xs text-emerald-400">
                        {activeCred.date}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Selected Credentials Metadata */}
              <div className="flex flex-col gap-2 text-xs text-neutral-300">
                <div>
                  <h4 className="font-bold text-sm text-foreground flex items-center gap-2">
                    {activeCred.title}
                    <span className="text-[10px] font-normal px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 rounded-xs">
                      {activeCred.badge}
                    </span>
                  </h4>
                  <p className="text-[11px] text-foreground/80 font-semibold">{activeCred.issuer}</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {activeCred.desc}
                </p>
              </div>
            </div>

            {/* Bottom telemetry indicators */}
            <div className="border-t border-border/40 pt-3.5 mt-5 flex flex-col sm:flex-row justify-between gap-3 text-[10px] text-neutral-400 font-mono">
              <div className="flex gap-4">
                <div>
                  <span className="text-muted-foreground">Issued: </span>
                  <span className="text-foreground font-semibold">{activeCred.date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration: </span>
                  <span className="text-foreground">{activeCred.duration}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 bg-secondary/15 border border-border px-2 py-0.5 rounded-[2px]">
                <span className="text-emerald-400 font-bold text-[9px] tracking-wider uppercase">
                  {activeCred.badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
