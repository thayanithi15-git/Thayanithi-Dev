"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import type { TechSection } from "@/lib/sections-data"
import Image from "next/image"

// Import project screenshots
import eqrevImg from "@/assets/projects/eqrev.png"
import cncImg from "@/assets/projects/cnc.png"
import bitlinksImg from "@/assets/projects/bitlinks.png"
import devrankImg from "@/assets/projects/devrank.png"
import progressiqImg from "@/assets/projects/progressiq.png"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 08: HARDWARE ABSTRACTION
  Style: Exploded view / layer cake. Each layer is a full-width band
  that you can hover to expand. Very different from the rest:
  big bold type, stacking layers that feel physical/tangible.
  Final section so it has a conclusive, monumental feel.
*/

const layers = [
  {
    level: "PROJ_04",
    name: "PROGRESS IQ",
    desc: "REAL-TIME MONITORING & ANALYTICS. Monitor daily activities and task updates instantly across teams with live sync. Features AI-driven insights to measure productivity, role-based access control, and centralized collaboration workspace.",
    detail: "Next.js | Socket.io | AI Analytics | TypeScript | Node.js | MongoDB | Tailwind CSS",
    url: "https://progress-iq.vercel.app/",
    color: "bg-foreground",
    textColor: "text-background",
    image: progressiqImg,
  },
  {
    level: "PROJ_03",
    name: "EQ REV",
    desc: "Quick Commerce Analytics. EQREV specializes in scaling brands across Quick Commerce. A strategic partner in Quick Commerce growth, providing pin code-level insights.",
    detail: "React.js | Chart.js | Recharts | Tailwind CSS | Hero UI | Zustand",
    url: "https://app.eqrev.com/",
    color: "bg-foreground/90",
    textColor: "text-background",
    image: eqrevImg,
  },
  {
    level: "PROJ_02",
    name: "CNC VAULT",
    desc: "CNC CONTROL HUB. Secure access to centralized machine programs, PLC logic, and configuration management for industrial CNC machinery.",
    detail: "Next.js | TypeScript | Node.js | Express.io | MongoDB | GCP | shadcn/ui",
    url: "https://cnc-machines.vercel.app/",
    color: "bg-foreground/75",
    textColor: "text-background",
    image: cncImg,
  },
  {
    level: "PROJ_01",
    name: "BITLINKS",
    desc: "COLLEGE COMMUNITY NETWORK. Modern community portal featuring smooth animations, optimized speed, responsive design, and collaborative workspaces.",
    detail: "Next.js | Framer Motion | Tailwind CSS | TypeScript | Vercel",
    url: "https://bitlinks.bitsathy.ac.in/",
    color: "bg-foreground/55",
    textColor: "text-background",
    image: bitlinksImg,
  },
  {
    level: "PROJ_00",
    name: "DEV RANK",
    desc: "Developer Ranking Platform. Connects coding profiles (GitHub, LeetCode) to compute and display rankings in developer communities, helping recruiters discover top talent.",
    detail: "Next.js | Rapid API | Data Scraping | Tailwind CSS | TypeScript",
    url: "https://github.com/thayanithi15-git",
    color: "bg-foreground/35",
    textColor: "text-foreground",
    image: devrankImg,
  },
]

function LayerStack() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [expanded, setExpanded] = useState<number | null>(null)

  return (
    <div ref={ref} className="flex flex-col">
      {layers.map((layer, i) => (
        <motion.div
          key={layer.level}
          initial={{ opacity: 0, x: i * 10 - 20 }}
          animate={isInView ? { opacity: 1, x: 0 } : {}}
          transition={{ delay: 0.2 + i * 0.12, duration: 0.5 }}
          onClick={() => setExpanded(expanded === i ? null : i)}
          className={`cursor-pointer border border-border ${layer.color} transition-all duration-300 ${
            expanded === i ? "py-8" : "py-4"
          }`}
          style={{
            boxShadow: shadow,
            marginTop: i > 0 ? "-1px" : 0,
          }}
        >
          <div className="mx-auto flex max-w-7xl items-start gap-6 px-4 lg:px-8">
            <span className={`font-mono text-sm font-bold ${layer.textColor} opacity-50`}>
              {layer.level}
            </span>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <h3 className={`font-pixel-line text-xl font-bold ${layer.textColor} md:text-2xl`}>
                  {layer.name}
                </h3>
                <motion.span
                  animate={{ rotate: expanded === i ? 180 : 0 }}
                  className={`font-mono text-sm ${layer.textColor} opacity-50`}
                >
                  v
                </motion.span>
              </div>
              <motion.div
                initial={false}
                animate={{ height: expanded === i ? "auto" : 0, opacity: expanded === i ? 1 : 0 }}
                className="overflow-hidden"
              >
                <div className="flex flex-col md:flex-row gap-6 mt-4 items-start">
                  <div className="flex-1">
                    <p className={`font-mono text-xs leading-relaxed ${layer.textColor} opacity-70`}>
                      {layer.desc}
                    </p>
                    {/* Visual Badge/Tag Stack for Technologies */}
                    <div className="flex flex-wrap gap-1.5 mt-3">
                      {layer.detail.split(" | ").map((tech) => (
                        <span 
                          key={tech} 
                          className={`font-mono text-[9px] px-2 py-0.5 border rounded-[2px] transition-all duration-200 ${
                            layer.textColor === "text-background" 
                              ? "border-background/20 text-background bg-background/5 hover:bg-background hover:text-foreground" 
                              : "border-border text-foreground bg-secondary/15 hover:border-foreground hover:bg-foreground hover:text-background"
                          }`}
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                    {layer.url && (
                      <div className="mt-4">
                        <a
                          href={layer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className={`inline-block font-mono text-xs border border-current px-3 py-1 transition-colors duration-200 ${
                            layer.textColor === "text-background"
                              ? "hover:bg-background hover:text-foreground"
                              : "hover:bg-foreground hover:text-background"
                          }`}
                        >
                          Launch Application {"->"}
                        </a>
                      </div>
                    )}
                  </div>
                  {layer.image && (
                    <div className="relative w-full md:w-72 aspect-[16/10] shrink-0 border border-border bg-secondary/50 p-1 overflow-hidden" style={{ boxShadow: shadow }}>
                      <div className="relative w-full h-full">
                        <Image
                          src={layer.image}
                          alt={layer.name}
                          fill
                          sizes="(max-width: 768px) 100vw, 288px"
                          className="object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

function CombinedRegistry() {
  const registers = [
    { name: "PROGRESS_IQ", value: "progress-iq.vercel.app", href: "https://progress-iq.vercel.app/", techs: ["Next.js", "Socket.io", "AI Analytics", "TypeScript", "Node.js", "MongoDB", "Tailwind CSS"] },
    { name: "EQ_REV", value: "app.eqrev.com", href: "https://app.eqrev.com/", techs: ["React.js", "Chart.js", "Recharts", "Tailwind CSS", "Hero UI", "Zustand"] },
    { name: "CNC_VAULT", value: "cnc-machines.vercel.app", href: "https://cnc-machines.vercel.app/", techs: ["Next.js", "TypeScript", "Node.js", "Express.io", "MongoDB", "GCP", "shadcn/ui"] },
    { name: "BITLINKS", value: "bitlinks.bitsathy.ac.in", href: "https://bitlinks.bitsathy.ac.in/", techs: ["Next.js", "Framer Motion", "Tailwind CSS", "TypeScript", "Vercel"] },
    { name: "DEV_RANK", value: "github.com/thayanithi15-git", href: "https://github.com/thayanithi15-git", techs: ["Next.js", "Rapid API", "Data Scraping", "Tailwind CSS", "TypeScript"] }
  ]

  return (
    <div className="border border-border bg-secondary/5" style={{ boxShadow: shadow }}>
      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-border px-4 py-3 bg-secondary/10">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 bg-foreground animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-bold">
            Project Registry & Tech Stack Dependency Matrix
          </span>
        </div>
        <span className="font-mono text-[9px] text-muted-foreground/60">// SYSTEM REGISTER MATRIX</span>
      </div>

      {/* Grid Table */}
      <div className="flex flex-col font-mono text-xs divide-y divide-border/60">
        {/* Table Header */}
        <div className="hidden md:flex items-center px-6 py-2.5 bg-secondary/20 text-muted-foreground text-[10px] uppercase tracking-wider font-bold">
          <div className="w-1/4">Registry ID</div>
          <div className="w-1/4">Access Point (URL)</div>
          <div className="w-2/4">Dependency Stack</div>
        </div>

        {/* Table Rows */}
        {registers.map((reg, i) => (
          <motion.div
            key={reg.name}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
            className="flex flex-col md:flex-row md:items-center px-6 py-4 hover:bg-secondary/10 transition-colors duration-200 gap-3 md:gap-0"
          >
            {/* Project Name */}
            <div className="w-full md:w-1/4 flex items-center gap-2.5">
              <span className="h-1 w-1 bg-green-500 rounded-full animate-pulse" />
              <span className="font-bold text-foreground text-xs">{reg.name}</span>
            </div>

            {/* Link */}
            <div className="w-full md:w-1/4">
              <a
                href={reg.href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-muted-foreground hover:text-foreground hover:underline transition-all duration-200 inline-flex items-center gap-1 cursor-pointer"
              >
                {reg.value}
                <span className="text-[8px] opacity-60">↗</span>
              </a>
            </div>

            {/* Tech Stack Badges */}
            <div className="w-full md:w-2/4 flex flex-wrap gap-1">
              {reg.techs.map((tech) => (
                <span
                  key={tech}
                  className="font-mono text-[9px] px-1.5 py-0.5 border border-border/60 text-muted-foreground bg-background/40 rounded-[2px] hover:border-foreground hover:text-foreground transition-all duration-150"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  )
}

export function SectionHardware({ section }: { section: TechSection }) {
  return (
    <div className="py-20 lg:py-32">
      {/* Header: big number */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-12 flex items-center gap-8"
        >
          <span className="font-pixel-line text-8xl font-bold text-foreground/[0.06] md:text-[10rem]">
            {section.number}
          </span>
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{section.subtitle}</span>
            <h2 className="font-pixel-line text-3xl font-bold text-foreground md:text-5xl">{section.title}</h2>
            <p className="mt-4 max-w-xl font-mono text-xs leading-relaxed text-muted-foreground">{section.description}</p>
          </div>
        </motion.div>
      </div>

      {/* Full-width layer stack */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        <LayerStack />
      </motion.div>

      {/* Bottom: unified combined registry view */}
      <div className="mx-auto mt-12 max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <CombinedRegistry />
        </motion.div>
      </div>
    </div>
  )
}
