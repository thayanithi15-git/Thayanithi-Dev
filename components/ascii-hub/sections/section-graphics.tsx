"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import type { TechSection } from "@/lib/sections-data"

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
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.95)" : "rgba(0,0,0,0.95)"
        ctx.font = isCurrentHovered ? "bold 12px monospace" : "bold 11px monospace"
        ctx.fillText(point.text, x + 8, y - 6)
        
        ctx.fillStyle = isDark ? "rgba(255,255,255,0.6)" : "rgba(0,0,0,0.6)"
        ctx.font = isCurrentHovered ? "bold 11px monospace" : "11px monospace"
        ctx.fillText(point.date, x + 8, y + 8)
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
              <span className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping shrink-0" />
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
    title: "Programming in Java",
    issuer: "NPTEL (IIT Kharagpur)",
    date: "December 2025",
    duration: "12 Weeks Online Course",
    badge: "90% Elite Badge",
    desc: "Successfully completed the Programming in Java course offered by NPTEL.",
    type: "COURSE",
    code: "NPTEL-JV-25"
  },
  {
    title: "Sakthi Hackathon 1.0",
    issuer: "Dr. Mahalingam College of Engineering and Technology",
    date: "August 13-14, 2025",
    duration: "24 Hours National Level Event",
    badge: "Finalist",
    desc: "Recognized for valuable participation and performance in 24 Hours National Level hackathon with exceptional problem-solving skills.",
    type: "HACKATHON",
    code: "SAKTHI-HACK-1.0"
  },
  {
    title: "Naalaiya Kalam'24",
    issuer: "Bannari Amman Institute of Technology",
    date: "November 2024",
    duration: "Makkal Sinthanai Peravai",
    badge: "Completed",
    desc: "Participated in NAALAIYA KALAM'24 event focusing on educational and cultural development initiatives.",
    type: "EVENT",
    code: "NK-24"
  }
]

export function SectionGraphics({ section }: { section: TechSection }) {
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

        {/* Credentials Grid */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {credentials.map((cred, i) => (
            <motion.div
              key={cred.code}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 + i * 0.1 }}
              className="border border-border p-6 bg-secondary/5 font-mono text-xs flex flex-col justify-between"
              style={{ boxShadow: shadow }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-border pb-3 mb-4">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground">[{cred.type}]</span>
                  <span className="text-[9px] text-muted-foreground/60">{cred.code}</span>
                </div>
                
                <h3 className="font-bold text-sm text-foreground mb-1">{cred.title}</h3>
                <p className="text-[11px] text-foreground/90 font-medium mb-3">{cred.issuer}</p>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">{cred.desc}</p>
              </div>

              <div className="border-t border-border/60 pt-3 mt-4 flex flex-col gap-1 text-[10px]">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Issued:</span>
                  <span className="text-foreground font-semibold">{cred.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Duration:</span>
                  <span className="text-foreground">{cred.duration}</span>
                </div>
                <div className="flex justify-between items-center mt-2 bg-foreground/5 px-2 py-1 rounded-sm">
                  <span className="text-muted-foreground">Status / Badge:</span>
                  <span className="text-foreground font-bold text-[9px] uppercase tracking-wider">{cred.badge}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Dynamic Bento specs grid */}
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: "Competitive Coding", desc: "LeetCode & HackerRank Developer Profiles", badge: "ALGORITHMS" },
            { title: "Hackathons", desc: "Top rankings in local & state hackathons", badge: "SYSTEMS & SPEED" },
            { title: "Certifications", desc: "Google Cloud, Fullstack React, Node.js Architectures", badge: "VERIFIED CRED" },
            { title: "Open Source", desc: "Active contributor to developer tools & templates", badge: "GIT CONTRIBS" }
          ].map((item, i) => (
            <motion.div
              key={item.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 + i * 0.08 }}
              className="flex flex-col justify-between border border-border p-6 bg-secondary/5 hover:border-foreground transition-all duration-300 relative group cursor-pointer"
              style={{ boxShadow: shadow }}
            >
              <div>
                <div className="flex items-center justify-between border-b border-border/40 pb-2 mb-3">
                  <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">{item.badge}</span>
                  <span className="font-mono text-[8px] text-muted-foreground/40">// SYSTEM_{i + 1}</span>
                </div>
                <h4 className="font-mono text-xs font-bold text-foreground group-hover:text-foreground/80 transition-colors uppercase">{item.title}</h4>
                <p className="mt-2 font-mono text-[10px] leading-relaxed text-muted-foreground">{item.desc}</p>
              </div>
              <div className="mt-4 pt-2 border-t border-border/40 flex items-center justify-between text-[8px] font-mono text-muted-foreground/50">
                <span>SYSTEM STATUS: OK</span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity">{"->"}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
