"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import type { TechSection } from "@/lib/sections-data"
import Image from "next/image"

import crayonImg from "@/assets/cert/crayon.jpg"
import ciscoOsImg from "@/assets/cert/cisco_operating_system.png"
import nptelJavaImg from "@/assets/cert/nptel_java.png"
import sakthiImg from "@/assets/cert/sakthi.jpg"
import nkImg from "@/assets/cert/naalaiyakalam.jpg"
import ciscoCyberImg from "@/assets/cert/cisco_cybersecurity.png"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 05: GRAPHICS PIPELINES
  Style: Oscilloscope / scanline waveform animation.
*/

const POINTS = 120

const wavePoints = [
  { baseXPercent: 0.0, date: "SEP 24 - APR 25", text: "Software Intern @ Crayon'd", type: "EXP" },
  { baseXPercent: 0.15, date: "OCT 2024", text: "Launched BITLINKS Platform", type: "PROJECT" },
  { baseXPercent: 0.3, date: "JUN 2025", text: "Advanced React Systems Cert", type: "CERT" },
  { baseXPercent: 0.45, date: "JAN 25 - DEC 25", text: "Software Engineer @ EQREV", type: "EXP" },
  { baseXPercent: 0.6, date: "OCT 2025", text: "GCP Associate Engineer Cert", type: "CERT" },
  { baseXPercent: 0.75, date: "SEP 25 - JAN 26", text: "Frontend Dev @ Thinkuni", type: "EXP" },
  { baseXPercent: 0.9, date: "DEC 2025", text: "NPTEL Java Elite Cert (90%)", type: "CERT" }
]

function Oscilloscope() {
  const ref = useRef<HTMLCanvasElement>(null)
  const animRef = useRef<number>(0)
  const [hoveredPoint, setHoveredPoint] = useState<typeof wavePoints[0] | null>(null)
  const mouseRef = useRef<{ x: number; y: number } | null>(null)
  const hoveredPointRef = useRef<typeof wavePoints[0] | null>(null)

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

      // Main waveform — composite of multiple frequencies (slower speed)
      ctx.strokeStyle = isDark ? "rgba(255,255,255,0.85)" : "rgba(0,0,0,0.85)"
      ctx.lineWidth = 2
      ctx.shadowColor = isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.2)"
      ctx.shadowBlur = isDark ? 8 : 2
      ctx.beginPath()
      for (let i = 0; i <= POINTS; i++) {
        const x = (W / POINTS) * i
        const phase = (i / POINTS) * Math.PI * 2
        const y =
          H / 2 +
          (H / 5) * (
            Math.sin(phase * 3 + t) * 0.5 +
            Math.sin(phase * 7 - t * 1.3) * 0.25 +
            Math.sin(phase * 11 + t * 0.7) * 0.15 +
            Math.sin(phase * 2 - t * 0.4) * 0.1
          )
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
        const phase = (i / POINTS) * Math.PI * 2
        const y =
          H / 2 +
          (H / 6) * Math.sin(phase * 5 + t * 1.8 + 1.2)
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y)
      }
      ctx.stroke()

      let hoveredAny = null
      let isPointer = false

      // Draw milestones pinned to active wave coordinates, moving right to left
      wavePoints.forEach((point) => {
        // Subtract offset from baseXPercent to shift items leftwards over time.
        // Wrap around [0, 1] using modulo.
        let xPercent = (point.baseXPercent - t * 0.05) % 1
        if (xPercent < 0) xPercent += 1

        const x = W * xPercent
        const phase = xPercent * Math.PI * 2
        const y =
          H / 2 +
          (H / 5) * (
            Math.sin(phase * 3 + t) * 0.5 +
            Math.sin(phase * 7 - t * 1.3) * 0.25 +
            Math.sin(phase * 11 + t * 0.7) * 0.15 +
            Math.sin(phase * 2 - t * 0.4) * 0.1
          )

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

        // Info Text Label (title is now primary/large, date is secondary/smaller below it)
        if (W > 768 || isCurrentHovered) {
          ctx.fillStyle = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.95)"
          ctx.font = isCurrentHovered ? "bold 12px monospace" : "bold 11px monospace"
          ctx.fillText(point.text, x + 8, y - 6)
          
          ctx.fillStyle = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
          ctx.font = isCurrentHovered ? "bold 11px monospace" : "11px monospace"
          ctx.fillText(point.date, x + 8, y + 8)
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
        className="h-48 w-full border border-border bg-background md:h-64 cursor-default block"
        style={{ boxShadow: shadow }}
      />
    </div>
  )
}

const credentials = [
  {
    title: "Crayon'd Full-Stack Internship",
    issuer: "Crayon'd",
    date: "July 30, 2025",
    duration: "Sept 19, 2024 – Apr 5, 2025",
    badge: "Internship Complete",
    desc: "1000+ hours of fullstack web development engineering and client feature delivery.",
    type: "INTERNSHIP",
    code: "CRYND-FS-25",
    image: crayonImg
  },
  {
    title: "Operating System Basics",
    issuer: "Cisco Networking Academy",
    date: "June 2024",
    duration: "Independent Certification",
    badge: "OS Core",
    desc: "Acquired fundamental expertise in Operating System architectures, memory processes, and virtualization.",
    type: "CERTIFICATION",
    code: "CSCO-OS-24",
    image: ciscoOsImg
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
    image: nptelJavaImg
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
    image: sakthiImg
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
    image: nkImg
  },
  {
    title: "Cybersecurity Essentials",
    issuer: "Cisco Networking Academy",
    date: "July 2024",
    duration: "Independent Certification",
    badge: "Security Core",
    desc: "Comprehensive foundation in network vulnerabilities, encryption systems, and cyber security protocols.",
    type: "CERTIFICATION",
    code: "CSCO-SEC-24",
    image: ciscoCyberImg
  }
]

export function SectionGraphics({ section }: { section: TechSection }) {
  const [activeIdx, setActiveIdx] = useState(0) // Start with first certificate loaded
  const [isPaused, setIsPaused] = useState(false)

  useEffect(() => {
    if (isPaused) return
    const timer = setInterval(() => {
      setActiveIdx((prev) => (prev + 1) % credentials.length)
    }, 3000)
    return () => clearInterval(timer)
  }, [isPaused])

  return (
    <div className="py-20 lg:py-32">
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
            <span className="h-2 w-2 animate-pulse bg-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">SIGNAL — GPU WAVEFORM</span>
          </div>
          <Oscilloscope />
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
              <span className="text-[10px] uppercase font-bold text-foreground tracking-wider">Credentials Registry Log</span>
              <span className="text-[8px] text-muted-foreground/60">// SYS_REG_MATRIX</span>
            </div>
            
            <div className="flex flex-col divide-y divide-border/40">
              {credentials.map((cred, idx) => {
                const isActive = activeIdx === idx
                return (
                  <button
                    key={cred.code}
                    onMouseEnter={() => setActiveIdx(idx)}
                    onClick={() => setActiveIdx(idx)}
                    className={`flex flex-col gap-1 p-3.5 text-left transition-all duration-200 border-l-2 focus:outline-none ${
                      isActive 
                        ? "border-l-foreground bg-secondary/15" 
                        : "border-l-transparent hover:bg-secondary/10"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[8px] uppercase tracking-wider text-muted-foreground/75">
                        [{cred.type}] {cred.code}
                      </span>
                      <span className="text-[9px] text-muted-foreground/60">{cred.date}</span>
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
                  <div className="h-1.5 w-1.5 bg-foreground rounded-full animate-pulse" />
                  <span className="text-[9px] uppercase tracking-wider text-foreground/80 font-bold">
                    IMAGE VIEWPORT: TELEMETRY_STREAM
                  </span>
                </div>
                <span className="text-[8px] text-muted-foreground/50">REF_ID: {credentials[activeIdx].code}</span>
              </div>

              {/* Monitor Screen Frame */}
              <div className="relative w-full aspect-[16/10] border border-border/80 overflow-hidden bg-black/40 rounded-[2px]" style={{ boxShadow: shadow }}>
                <Image
                  src={credentials[activeIdx].image}
                  alt={credentials[activeIdx].title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 550px"
                  className="object-contain grayscale hover:grayscale-0 transition-all duration-500 ease-in-out cursor-crosshair hover:scale-[1.02]"
                />
              </div>

              {/* Selected Credentials Metadata */}
              <div className="flex flex-col gap-2 text-xs text-neutral-300">
                <div>
                  <h4 className="font-bold text-sm text-foreground">{credentials[activeIdx].title}</h4>
                  <p className="text-[11px] text-foreground/80 font-semibold">{credentials[activeIdx].issuer}</p>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">
                  {credentials[activeIdx].desc}
                </p>
              </div>
            </div>

            {/* Bottom telemetry indicators */}
            <div className="border-t border-border/40 pt-3.5 mt-5 flex flex-col sm:flex-row justify-between gap-3 text-[10px] text-neutral-400 font-mono">
              <div className="flex gap-4">
                <div>
                  <span className="text-muted-foreground">Issued: </span>
                  <span className="text-foreground font-semibold">{credentials[activeIdx].date}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Duration: </span>
                  <span className="text-foreground">{credentials[activeIdx].duration}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-1.5 bg-secondary/15 border border-border px-2 py-0.5 rounded-[2px]">
                <span className="text-foreground font-bold text-[9px] tracking-wider uppercase">
                  {credentials[activeIdx].badge}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
