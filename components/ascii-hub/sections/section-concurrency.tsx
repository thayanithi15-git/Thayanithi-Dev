"use client"

import { motion, useInView, AnimatePresence } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import type { TechSection } from "@/lib/sections-data"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 07: CONCURRENCY MODELS
  Style: System activity monitor with interactive target roadmap,
  skill telemetry display, and strict category buffer capacity limits.
*/

const subtopicDescriptions: Record<string, string> = {
  // Cloud Computing
  GCP: "Google Cloud Platform infra, IAM role policies & Cloud Run autoscaling.",
  Kubernetes: "Container orchestration, ingress controllers & pod autoscaling.",
  "Distributed Architecture": "Consensus algorithms (Raft/Paxos) & CAP theorem trade-offs.",
  Docker: "Multi-stage Dockerfiles, container isolation & custom virtual networks.",
  Serverless: "Edge functions, cold-start latency mitigation & event-driven triggers.",
  Terraform: "Infrastructure as Code, state locking & modular cloud provisioning.",

  // System Design
  "High Availability": "Multi-region failover, load balancing & active-active replication.",
  "Caching Strategies": "Redis cluster, cache invalidation & write-through/write-behind.",
  "Event-driven Systems": "Kafka message brokers, event sourcing & CQRS architecture.",
  "Load Balancing": "Layer 4 vs Layer 7 routing, round-robin & weighted algorithms.",
  Microservices: "Service mesh (Istio), gRPC IPC & circuit breaker resilience.",
  "API Gateways": "Rate limiting, JWT token verification & reverse proxy routing.",

  // AI Integration
  "RAG Patterns": "Retrieval-Augmented Generation, vector embeddings & hybrid search.",
  "Vector Databases": "Qdrant / Pinecone indexing, cosine similarity & HNSW graphs.",
  "LLM Agents": "Autonomous tool invocation, agentic loops & working memory state.",
  PyTorch: "Tensor manipulations, CUDA GPU acceleration & gradient descent.",
  Quantization: "GGUF/AWQ model compression, FP16 to INT4 weight quantization.",
  "Fine-Tuning": "LoRA / QLoRA parameter-efficient LLM fine-tuning workflows.",

  // Open Source
  "Developer Tools": "CLI tools, scaffolding utilities & dev experience automation.",
  "Library Development": "NPM/Cargo packages, semver versioning & tree-shakeable builds.",
  "API Design": "RESTful standards, GraphQL schema stitching & OpenAPI specs.",
  "Git Workflows": "Trunk-based development, interactive rebase & conventional commits.",
  "CI/CD Pipelines": "GitHub Actions matrix builds & automated integration testing."
}

const threadLanesMeta = [
  { name: "Cloud Computing", items: ["GCP", "Docker", "Kubernetes", "Distributed Architecture", "Serverless", "Terraform"] },
  { name: "System Design", items: ["High Availability", "Caching Strategies", "Event-driven Systems", "Load Balancing", "Microservices", "API Gateways"] },
  { name: "AI Integration", items: ["RAG Patterns", "Vector Databases", "LLM Agents", "PyTorch", "Quantization", "Fine-Tuning"] },
  { name: "Open Source", items: ["Developer Tools", "Library Development", "API Design", "Git Workflows", "CI/CD Pipelines"] }
]

type FilterType = "all" | "active" | "research" | "backlog"

interface SelectedCardInfo {
  domain: string
  title: string
  statusType: "active" | "research" | "backlog"
  statusLabel: string
  desc: string
}

function TimelineView({
  selectedCard,
  onSelectTarget,
  onTriggerSpike
}: {
  selectedCard: SelectedCardInfo | null
  onSelectTarget: (card: SelectedCardInfo | null) => void
  onTriggerSpike: () => void
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })
  const [activeFilter, setActiveFilter] = useState<FilterType>("all")

  return (
    <div ref={ref} className="overflow-hidden border border-border bg-background" style={{ boxShadow: shadow }}>
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border bg-secondary/15 px-4 py-3 gap-2">
        <div className="flex items-center gap-2">
          <motion.div
            className="h-2 w-2 bg-foreground"
            animate={isInView ? { opacity: [1, 0.3, 1] } : {}}
            transition={{ repeat: Infinity, duration: 1.2 }}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            System target roadmap — domain focus & active targets
          </span>
        </div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground">
          <span>FILTER: <strong className="text-foreground uppercase">{activeFilter}</strong></span>
          <span className="text-border">|</span>
          <span>CLICK ANY CARD TO INSPECT</span>
        </div>
      </div>

      {/* Target domains */}
      {threadLanesMeta.map((thread, i) => (
        <motion.div
          key={thread.name}
          initial={{ opacity: 0, y: 15 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.1 + i * 0.08 }}
          className="flex flex-col lg:flex-row lg:items-center border-b border-border last:border-b-0 py-4 px-4 gap-4"
        >
          {/* Left side: Domain name */}
          <div className="w-48 shrink-0 flex items-center gap-2">
            <div className="h-1.5 w-1.5 bg-foreground shrink-0" />
            <span className="font-mono text-[10px] font-bold text-foreground uppercase tracking-wider">{thread.name}</span>
          </div>

          {/* Right side: Interactive subtopic cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 flex-1">
            {thread.items.map((subtopic, subIdx) => {
              const statusType: "active" | "research" | "backlog" = subIdx < 2 ? "active" : (subIdx < 4 ? "research" : "backlog")
              const statusLabel = statusType === "active" ? "Active" : (statusType === "research" ? "Research" : "Backlog")
              const statusColor = statusType === "active" ? "bg-white" : (statusType === "research" ? "bg-white/40" : "bg-transparent border border-white/45")
              
              const isMatchFilter = activeFilter === "all" || activeFilter === statusType
              const isSelected = selectedCard?.title === subtopic

              return (
                <motion.div 
                  key={subtopic} 
                  whileHover={{ y: -4, scale: 1.03 }}
                  whileTap={{ scale: 0.94 }}
                  transition={{ type: "spring", stiffness: 350, damping: 18 }}
                  onClick={() => {
                    onSelectTarget({
                      domain: thread.name,
                      title: subtopic,
                      statusType,
                      statusLabel: statusType === "active" ? "ACTIVE LEARNING & LABS" : (statusType === "research" ? "STRUCTURED RESEARCH" : "TARGET IMPLEMENTATION / BACKLOG"),
                      desc: subtopicDescriptions[subtopic] || "System roadmap module target under evaluation."
                    })
                  }}
                  className={`relative p-2.5 bg-secondary/10 border flex flex-col justify-between transition-all duration-300 cursor-pointer group overflow-hidden min-h-[60px] rounded-[2px] ${
                    isMatchFilter 
                      ? "opacity-100 border-border hover:border-foreground hover:bg-secondary/25" 
                      : "opacity-30 grayscale border-border/40"
                  } ${isSelected ? "ring-2 ring-foreground bg-secondary/30 shadow-lg scale-[1.02]" : ""}`}
                  style={{ boxShadow: shadow }}
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="font-mono text-[8px] text-muted-foreground uppercase tracking-wider">
                      {statusLabel}
                    </span>
                    <div className={`h-1.5 w-1.5 shrink-0 rounded-[1px] ${statusColor}`} />
                  </div>
                  
                  <span className="font-mono text-[9.5px] font-bold text-foreground leading-tight tracking-wide">
                    {subtopic}
                  </span>
                  
                  {/* Active scanner animations */}
                  {statusType === "active" && isMatchFilter && (
                    <div className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-secondary/50 overflow-hidden">
                      <motion.div 
                        className="h-full bg-foreground w-1/2"
                        initial={{ left: "-100%" }}
                        animate={{ left: "100%" }}
                        transition={{ repeat: Infinity, duration: 1.8, ease: "linear" }}
                        style={{ position: "absolute" }}
                      />
                    </div>
                  )}

                  {/* Pulsing ring highlight when selected */}
                  {isSelected && (
                    <motion.div
                      layoutId="selectedCardGlow"
                      className="absolute inset-0 border-2 border-foreground rounded-[2px] pointer-events-none"
                      initial={false}
                      transition={{ type: "spring", stiffness: 400, damping: 25 }}
                    />
                  )}
                </motion.div>
              )
            })}
          </div>
        </motion.div>
      ))}

      {/* Interactive Telemetry Console Drawer */}
      <AnimatePresence>
        {selectedCard && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="border-t border-b border-border bg-secondary/20 p-4 font-mono"
          >
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex flex-col gap-1.5 max-w-2xl">
                <div className="flex items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 bg-foreground text-background font-bold uppercase tracking-wider rounded-[2px]">
                    [{selectedCard.domain}]
                  </span>
                  <span className="text-muted-foreground uppercase text-[9px] tracking-wider">
                    MODULE STATUS: <strong className="text-foreground">{selectedCard.statusLabel}</strong>
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground flex items-center gap-2 mt-0.5">
                  <span className="h-2 w-2 bg-foreground rounded-full animate-ping shrink-0" />
                  {selectedCard.title}
                </h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {selectedCard.desc}
                </p>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={onTriggerSpike}
                  className="px-3.5 py-2 bg-foreground text-background font-mono text-[10px] font-bold uppercase tracking-wider rounded-[2px] shadow-sm hover:opacity-90 transition-opacity flex items-center gap-2"
                >
                  <span className="h-1.5 w-1.5 bg-background rounded-full animate-pulse" />
                  Simulate Load Spike
                </motion.button>
                <button
                  onClick={() => onSelectTarget(null)}
                  className="px-3 py-2 border border-border text-muted-foreground hover:text-foreground font-mono text-[10px] uppercase tracking-wider rounded-[2px] transition-colors bg-background/50"
                >
                  [× CLOSE]
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Interactive Legend / Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border px-4 py-3 bg-secondary/5 font-mono text-[9px]">
        <div className="flex items-center gap-2 text-muted-foreground uppercase tracking-wider">
          <span className="font-bold text-foreground">// ROADMAP FILTER:</span>
          <span>CLICK A CATEGORY TO FILTER TARGETS</span>
        </div>

        <div className="flex flex-wrap gap-2">
          {[
            { id: "all", label: "ALL TARGETS", cls: "bg-foreground text-background font-bold" },
            { id: "active", label: "Active Learning & Labs", cls: "bg-white text-black font-semibold" },
            { id: "research", label: "Structured Research", cls: "bg-white/40 text-foreground font-semibold" },
            { id: "backlog", label: "Target Implementation / Backlog", cls: "border border-white/45 text-foreground/80" },
          ].map((l) => {
            const isSelected = activeFilter === l.id
            return (
              <motion.button
                key={l.id}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveFilter(isSelected && l.id !== "all" ? "all" : l.id as FilterType)}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-[2px] border transition-all duration-200 cursor-pointer ${
                  isSelected 
                    ? "border-foreground shadow-md ring-1 ring-foreground opacity-100" 
                    : "border-border/60 hover:border-foreground/60 opacity-70"
                }`}
              >
                <div className={`h-1.5 w-2.5 rounded-[1px] ${l.cls}`} />
                <span className={`uppercase tracking-wider ${isSelected ? "text-foreground font-bold" : "text-muted-foreground"}`}>
                  {l.label}
                </span>
              </motion.button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ChannelMonitor({ 
  spikeTrigger, 
  activeTarget 
}: { 
  spikeTrigger: number
  activeTarget: SelectedCardInfo | null 
}) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  // Enforce strict category ceilings:
  // - Structured Research: Max 118 / 128 (NEVER above 120!)
  // - Target Implementation / Backlog: Max 112 / 128 (NEVER above 120!)
  // - Active Learning & Labs / Default: Max 124 / 128 (NEVER above 125, NEVER 128/128!)
  const currentMaxCap = activeTarget 
    ? (activeTarget.statusType === "research" ? 118 : (activeTarget.statusType === "backlog" ? 112 : 124))
    : 124

  const [bufferFill, setBufferFill] = useState(64)

  // Trigger burst spike on prop change, hard capped at currentMaxCap
  useEffect(() => {
    if (spikeTrigger > 0) {
      setBufferFill(currentMaxCap)
    }
  }, [spikeTrigger, currentMaxCap])

  useEffect(() => {
    if (!isInView) return
    const interval = setInterval(() => {
      setBufferFill((prev) => {
        const delta = (Math.random() - 0.48) * 16
        const nextVal = prev + delta
        // Hard limits: never above currentMaxCap, never above 124, NEVER 128!
        return Math.max(12, Math.min(currentMaxCap, nextVal))
      })
    }, 250)
    return () => clearInterval(interval)
  }, [isInView, currentMaxCap])

  const displayVal = Math.min(currentMaxCap, Math.floor(bufferFill))

  return (
    <div ref={ref} className="border border-border p-4 bg-background rounded-[2px]" style={{ boxShadow: shadow }}>
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/40 pb-2.5">
        <div className="flex items-center gap-2">
          <div className={`h-2 w-2 bg-foreground rounded-full ${spikeTrigger > 0 ? "animate-ping" : ""}`} />
          <span className="font-mono text-[10px] uppercase tracking-widest text-foreground font-bold">
            CHANNEL BUFFER — TELEMETRY MONITOR
          </span>
        </div>

        {activeTarget ? (
          <div className="flex items-center gap-2 font-mono text-[10px]">
            <span className="text-muted-foreground uppercase text-[9px]">ACTIVE SKILL:</span>
            <span className="px-2 py-0.5 bg-foreground text-background font-bold uppercase rounded-[2px]">
              {activeTarget.title}
            </span>
            <span className="text-muted-foreground uppercase text-[9px]">
              [{activeTarget.statusType === "active" ? "ACTIVE LAB — MAX CAP 124" : (activeTarget.statusType === "research" ? "RESEARCH — MAX CAP 118" : "BACKLOG — MAX CAP 112")}]
            </span>
          </div>
        ) : (
          <span className="font-mono text-[9px] text-muted-foreground uppercase tracking-wider">
            STATUS: BUS MONITOR STANDBY (MAX CAP 124/128)
          </span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex h-20 flex-1 gap-px bg-secondary/10 p-1 border border-border/50 rounded-[2px] overflow-hidden">
          {Array.from({ length: 32 }).map((_, i) => {
            const barThreshold = (i + 1) * 4
            const isActiveBar = barThreshold <= displayVal
            return (
              <motion.div
                key={i}
                className="flex-1 bg-foreground transition-opacity duration-150"
                animate={{ opacity: isActiveBar ? 1 : 0.04 }}
              />
            )
          })}
        </div>
        <div className="flex flex-col gap-1 font-mono min-w-[85px] text-right">
          <span className="text-foreground font-bold text-sm tracking-tight">{displayVal}/128</span>
          <span className="text-[9px] text-muted-foreground uppercase tracking-wider">BUFFER LOAD</span>
        </div>
      </div>
    </div>
  )
}

export function SectionConcurrency({ section }: { section: TechSection }) {
  const [spikeTrigger, setSpikeTrigger] = useState(0)
  const [activeTarget, setActiveTarget] = useState<SelectedCardInfo | null>(null)

  const handleSelectTarget = (target: SelectedCardInfo | null) => {
    setActiveTarget(target)
    setSpikeTrigger((prev) => prev + 1)
  }

  const handleTriggerSpike = () => {
    setSpikeTrigger((prev) => prev + 1)
  }

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
        <TimelineView
          selectedCard={activeTarget}
          onSelectTarget={handleSelectTarget}
          onTriggerSpike={handleTriggerSpike}
        />
      </motion.div>

      {/* Bottom row: channel monitor */}
      <div className="mt-6 w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.25 }}
        >
          <ChannelMonitor
            spikeTrigger={spikeTrigger}
            activeTarget={activeTarget}
          />
        </motion.div>
      </div>
    </div>
  )
}


