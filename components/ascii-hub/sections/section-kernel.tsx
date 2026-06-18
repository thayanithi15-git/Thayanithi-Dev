"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import Image from "next/image"
import type { TechSection } from "@/lib/sections-data"
import profilePic from "@/assets/me/thayanithi.jpeg"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 01: KERNEL & SYSTEMS
  Style: Full-width terminal takeover. The entire section looks like one big terminal window.
  The background is inverted (white on black), with a persistent "menu bar" at top.
*/

function BootSequence() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [lines, setLines] = useState<string[]>([])
  const bootLines = [
    "[  0.000000] Initializing system boot sequence...",
    "[  0.000104] Hostname: THAYANITHI",
    "[  0.000210] CPU: 12th Gen Intel(R) Core(TM) i5-12500H (2.50 GHz)",
    "[  0.000452] Memory: 8.00 GB RAM (7.69 GB usable)",
    "[  0.001102] GPU 0: NVIDIA GeForce RTX 3050 Laptop GPU (4 GB)",
    "[  0.001438] GPU 1: Intel(R) UHD Graphics (128 MB)",
    "[  0.002014] Platform: 64-bit operating system, x64-based processor",
    "[  0.003550] Checking environment dependencies...",
    "[  OK  ] System operational.",
  ]

  useEffect(() => {
    if (!isInView) return
    let i = 0
    const interval = setInterval(() => {
      if (i < bootLines.length) {
        const currentLine = bootLines[i]
        i++
        setLines((prev) => [...prev, currentLine])
      } else {
        clearInterval(interval)
      }
    }, 150)
    return () => clearInterval(interval)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isInView])

  return (
    <div ref={ref} className="bg-background p-6 font-mono text-xs leading-relaxed text-foreground">
      {lines.map((line, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className={
            typeof line === "string" && line.startsWith("[  OK")
              ? "mt-2 font-bold text-foreground"
              : "text-muted-foreground"
          }
        >
          {line}
        </motion.div>
      ))}
      {lines.length < bootLines.length && (
        <span className="animate-blink inline-block text-foreground">{"_"}</span>
      )}
    </div>
  )
}

export function SectionKernel({ section }: { section: TechSection }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
      {/* Section label with ghost number */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="mb-12 flex items-end gap-6"
      >
        <span className="font-pixel-line text-7xl font-bold leading-none text-foreground/[0.08] md:text-9xl">
          {section.number}
        </span>
        <div className="flex-1 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{section.subtitle}</span>
          </div>
          <h2 className="mt-2 font-pixel-line text-3xl font-bold text-foreground md:text-5xl">
            {section.title}
          </h2>
        </div>
      </motion.div>

      {/* Giant terminal window */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="overflow-hidden border border-border"
        style={{ boxShadow: shadow }}
      >
        {/* Terminal title bar */}
        <div className="flex items-center justify-between border-b border-border bg-foreground px-4 py-2">
          <div className="flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="h-2.5 w-2.5 border border-background/30 bg-background" />
              <div className="h-2.5 w-2.5 border border-background/30 bg-background/60" />
              <div className="h-2.5 w-2.5 border border-background/30 bg-background/30" />
            </div>
            <span className="font-mono text-xs text-background">
              kernel@THAYANITHI:~
            </span>
          </div>
          <span className="font-mono text-[10px] text-background/50">bash 5.2.15</span>
        </div>

        {/* Terminal body with two columns */}
        <div className="grid lg:grid-cols-5">
          {/* Left: Boot sequence (3 cols) */}
          <div className="border-b border-border lg:col-span-3 lg:border-b-0 lg:border-r">
            <div className="border-b border-border px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                Boot Sequence
              </span>
            </div>
            <BootSequence />
          </div>

          {/* Right: System info panel (2 cols) */}
          <div className="flex flex-col lg:col-span-2">
            <div className="border-b border-border px-4 py-2">
              <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                System Overview
              </span>
            </div>

            {/* Title area */}
            <div className="border-b border-border p-6 flex flex-col sm:flex-row gap-6 items-center sm:items-start">
              {/* Profile Image with retro frame */}
              <div className="relative h-24 w-24 shrink-0 overflow-hidden border border-border bg-secondary/50 p-1" style={{ boxShadow: shadow }}>
                <div className="relative h-full w-full grayscale contrast-125 hover:grayscale-0 transition-all duration-300">
                  <Image
                    src={profilePic}
                    alt="Thayanithi S"
                    fill
                    sizes="96px"
                    className="object-cover"
                    priority
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-background/20 to-transparent" />
                </div>
              </div>

              <div className="flex-1">
                <h2 className="font-pixel-line text-3xl font-bold text-foreground md:text-4xl">
                  {section.title}
                </h2>
                <p className="mt-3 font-mono text-xs leading-relaxed text-muted-foreground">
                  {section.description}
                </p>
              </div>
            </div>

            {/* Specs as system parameters */}
            <div className="flex-1 p-4">
              <div className="flex flex-col gap-3">
                {section.specs.map((spec, i) => (
                  <motion.div
                    key={spec.label}
                    initial={{ opacity: 0, x: 10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.1 }}
                    className="flex items-start gap-2 font-mono text-xs"
                  >
                    <span className="text-muted-foreground">{">"}</span>
                    <span className="text-muted-foreground">{spec.label}:</span>
                    <span className="font-bold text-foreground">{spec.value}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom ASCII schematic */}
        <div className="border-t border-border">
          <div className="flex items-center gap-2 border-b border-border px-4 py-2">
            <div className="h-1.5 w-1.5 bg-foreground" />
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
              Architecture Schematic Flow
            </span>
          </div>
          <div className="overflow-x-auto p-8 bg-secondary/10">
            <div className="flex min-w-[700px] items-center justify-between font-mono text-xs text-foreground">
              <div className="border border-border p-3 bg-background text-center flex-1 max-w-[140px]" style={{ boxShadow: shadow }}>
                <div className="font-bold text-[10px] uppercase text-muted-foreground mb-1">Entry Node</div>
                <div className="font-bold">USER</div>
              </div>
              <div className="flex-shrink-0 px-4 text-muted-foreground">─────▶</div>
              
              <div className="border border-border p-3 bg-background text-center flex-1 max-w-[140px]" style={{ boxShadow: shadow }}>
                <div className="font-bold text-[10px] uppercase text-muted-foreground mb-1">Frontend</div>
                <div className="font-bold">React / Next</div>
              </div>
              <div className="flex-shrink-0 px-4 text-muted-foreground">─────▶</div>
              
              <div className="border border-border p-3 bg-background text-center flex-1 max-w-[140px]" style={{ boxShadow: shadow }}>
                <div className="font-bold text-[10px] uppercase text-muted-foreground mb-1">API Router</div>
                <div className="font-bold">Express Engine</div>
              </div>
              <div className="flex-shrink-0 px-4 text-muted-foreground">─────▶</div>
              
              <div className="border border-border p-3 bg-background text-center flex-1 max-w-[140px]" style={{ boxShadow: shadow }}>
                <div className="font-bold text-[10px] uppercase text-muted-foreground mb-1">Cloud Cluster</div>
                <div className="font-bold">GCP / API</div>
              </div>
              <div className="flex-shrink-0 px-4 text-muted-foreground">─────▶</div>
              
              <div className="border border-border p-3 bg-background text-center flex-1 max-w-[140px]" style={{ boxShadow: shadow }}>
                <div className="font-bold text-[10px] uppercase text-muted-foreground mb-1">Database</div>
                <div className="font-bold">MongoDB Atlas</div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
