"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import type { TechSection } from "@/lib/sections-data"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 07: CONCURRENCY MODELS
  Style: System activity monitor. Animated horizontal lanes
  representing threads over time, like a profiler timeline view.
  Real-time feeling with animated progress bars and status updates.
*/

interface ThreadLane {
  id: string
  label: string
  segments: { start: number; end: number; type: "work" | "wait" | "blocked" }[]
}

const threadLanesMeta = [
  { name: "Cloud Computing", items: ["GCP", "Kubernetes", "Distributed Architecture", "Docker", "Serverless", "Terraform"] },
  { name: "System Design", items: ["High Availability", "Caching Strategies", "Event-driven Systems", "Load Balancing", "Microservices", "API Gateways"] },
  { name: "AI Integration", items: ["RAG Patterns", "Vector Databases", "LLM Agents", "PyTorch", "Quantization", "Fine-Tuning"] },
  { name: "Open Source", items: ["Developer Tools", "Library Development", "API Design", "Git Workflows", "CI/CD Pipelines"] }
]

type SegType = "work" | "wait" | "blocked"

function generateLanes(): ThreadLane[] {
  return threadLanesMeta.map((meta, i) => {
    const segments: ThreadLane["segments"] = []
    let cursor = 0

    while (cursor < 100) {
      let type: SegType
      let len: number

      if (i === 0) {
        // Cloud Computing: Periodic scaling runs, longer standby wait states
        const rand = Math.random()
        type = rand < 0.3 ? "work" : (rand < 0.8 ? "wait" : "blocked")
        len = type === "blocked" ? 20 : (type === "wait" ? 15 : 8)
      } else if (i === 1) {
        // System Design: Event-loop spikes (frequent quick work/wait transitions)
        const rand = Math.random()
        type = rand < 0.6 ? "work" : "wait"
        len = Math.floor(Math.random() * 6) + 4
      } else if (i === 2) {
        // AI Integration: Heavy processing (long blocked/compute chunks)
        const rand = Math.random()
        type = rand < 0.7 ? "blocked" : "work"
        len = type === "blocked" ? 30 : 10
      } else {
        // Open Source: Pipeline checks (structured sequence of work, wait, blocked)
        const step = cursor % 3
        type = step === 0 ? "work" : (step === 1 ? "wait" : "blocked")
        len = Math.floor(Math.random() * 12) + 8
      }

      const end = Math.min(100, cursor + len)
      segments.push({ start: cursor, end, type })
      cursor = end + Math.floor(Math.random() * 5) + 2
    }
    return { id: `t${i + 1}`, label: meta.name, segments }
  })
}

function TimelineView() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [lanes, setLanes] = useState<ThreadLane[]>(generateLanes)
  const [tick, setTick] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setLanes(generateLanes())
      setTick((t) => t + 1)
    }, 2000)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div ref={ref} className="overflow-hidden border border-border" style={{ boxShadow: shadow }}>
      <div className="flex items-center justify-between border-b border-border bg-secondary/10 px-4 py-2">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-2 w-2 bg-foreground"
            animate={isInView ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1 }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            System activity monitor — thread execution timeline
          </span>
        </div>
        <span className="font-mono text-[10px] text-muted-foreground">0ms — 100ms</span>
      </div>

      {/* Time scale */}
      <div className="flex border-b border-border px-4 py-1">
        <div className="w-48 flex-shrink-0" />
        <div className="flex flex-1 justify-between font-mono text-[9px] text-muted-foreground/50">
          {[0, 20, 40, 60, 80, 100].map((t) => (
            <span key={t}>{t}ms</span>
          ))}
        </div>
      </div>

      {/* Thread lanes */}
      {lanes.map((thread, i) => (
        <motion.div
          key={thread.id}
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.1 + i * 0.05 }}
          className="flex flex-col md:flex-row md:items-center border-b border-border last:border-b-0 py-3 px-4 gap-4"
        >
          {/* Left side: title alone in white */}
          <div className="w-48 shrink-0 flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-foreground shrink-0" />
            <span className="font-mono text-[10px] font-bold text-foreground truncate">{thread.label}</span>
          </div>

          {/* Right side: boxes representing subtopics */}
          <div className="flex flex-wrap gap-4 flex-1">
            {threadLanesMeta[i]?.items.map((subtopic, subIdx) => (
              <div 
                key={subtopic} 
                className="relative flex-1 min-w-[130px] h-8 bg-border/20 border border-border/40 flex items-center justify-center overflow-hidden"
              >
                {/* Animated lane segments (behind the text) */}
                <div className="absolute inset-0 pointer-events-none select-none">
                  {thread.segments.map((seg, j) => (
                    <motion.div
                      key={`${tick}-${subIdx}-${j}`}
                      className={`absolute top-0 bottom-0 h-full ${
                        seg.type === "work" ? "bg-foreground/20"
                        : seg.type === "wait" ? "bg-foreground/5"
                        : "bg-muted-foreground/10"
                      }`}
                      style={{ left: `${seg.start}%`, width: `${seg.end - seg.start}%` }}
                      initial={{ scaleX: 0, originX: 0 }}
                      animate={{ scaleX: 1 }}
                      transition={{ duration: 0.5, delay: i * 0.04 + j * 0.03, ease: "easeOut" }}
                    />
                  ))}
                </div>
                {/* Text inside the animating box */}
                <span className="relative z-10 font-mono text-[9px] font-bold text-foreground px-2 text-center pointer-events-none select-none">
                  {subtopic}
                </span>
              </div>
            ))}
          </div>
        </motion.div>
      ))}

      {/* Legend */}
      <div className="flex gap-6 border-t border-border px-4 py-2">
        {[
          { label: "Active Learning & Labs", cls: "bg-foreground" },
          { label: "Structured Research", cls: "bg-foreground/25" },
          { label: "Target Implementation / Backlog", cls: "bg-muted-foreground/45" },
        ].map((l) => (
          <div key={l.label} className="flex items-center gap-1.5">
            <div className={`h-2 w-4 ${l.cls}`} />
            <span className="font-mono text-[9px] text-muted-foreground">{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function ChannelMonitor() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [bufferFill, setBufferFill] = useState(0)

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setBufferFill((prev) => {
        const delta = (Math.random() - 0.4) * 20
        return Math.max(0, Math.min(128, prev + delta))
      })
    }, 300)
    return () => clearInterval(interval)
  }, [isInView])

  return (
    <div ref={ref} className="border border-border p-4" style={{ boxShadow: shadow }}>
      <div className="mb-3 flex items-center gap-2">
        <div className="h-1.5 w-1.5 bg-foreground" />
        <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
          Channel Buffer
        </span>
      </div>
      <div className="flex items-center gap-4">
        <div className="flex h-20 flex-1 gap-px">
          {Array.from({ length: 32 }).map((_, i) => (
            <div
              key={i}
              className="flex-1 bg-foreground transition-opacity duration-200"
              style={{ opacity: i < Math.floor(bufferFill / 4) ? 1 : 0.05 }}
            />
          ))}
        </div>
        <div className="flex flex-col gap-1 font-mono text-xs">
          <span className="text-foreground font-bold">{Math.floor(bufferFill)}/128</span>
          <span className="text-[10px] text-muted-foreground">capacity</span>
        </div>
      </div>
    </div>
  )
}

export function SectionConcurrency({ section }: { section: TechSection }) {
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
      {/* Header with ghost number */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-12 flex items-end gap-6"
      >
        <span className="font-pixel-line text-7xl font-bold leading-none text-foreground/[0.08] md:text-9xl">
          {section.number}
        </span>
        <div className="max-w-xl pb-2">
          <div className="flex items-center gap-2 font-mono text-xs text-muted-foreground">
            <span className="text-[10px] uppercase tracking-widest">{section.subtitle}</span>
          </div>
          <h2 className="mt-3 font-pixel-line text-3xl font-bold text-foreground md:text-5xl">
            {section.title}
          </h2>
          <p className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">{section.description}</p>
        </div>
      </motion.div>

      {/* Timeline view: full width */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.15 }}
      >
        <TimelineView />
      </motion.div>

      {/* Bottom row: channel monitor */}
      <div className="mt-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <ChannelMonitor />
        </motion.div>
      </div>
    </div>
  )
}
