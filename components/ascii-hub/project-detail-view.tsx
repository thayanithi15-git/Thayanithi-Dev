"use client"

import { useState, useEffect, useRef } from "react"
import Image, { StaticImageData } from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ProjectDetail } from "@/lib/projects-data"
import { getProjectAssets } from "@/lib/project-assets"
import { ProjectHeader } from "@/components/ascii-hub/project-header"
import { Footer } from "@/components/ascii-hub/footer"
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Terminal,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Cpu,
  Layers,
  Sparkles,
  Zap,
  Radio,
  ChevronRight,
  ChevronLeft,
  Maximize2,
  X,
  ArrowDown,
  Server,
  Database,
  Globe,
  Lock,
  Code2,
} from "lucide-react"

const shadowStyle =
  "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px"

interface ProjectDetailViewProps {
  project: ProjectDetail
  prevProject: ProjectDetail
  nextProject: ProjectDetail
}

// Background animated particle canvas
function AnimatedBackgroundCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener("resize", handleResize)

    // Subtle ambient background particles
    const particles = Array.from({ length: 26 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.3,
      vy: -0.2 - Math.random() * 0.4,
      opacity: Math.random() * 0.2 + 0.05,
      char: ["+", "·", "°", "0", "1", "x"][Math.floor(Math.random() * 6)],
    }))

    const render = () => {
      ctx.clearRect(0, 0, width, height)
      ctx.font = "10px monospace"

      particles.forEach((p) => {
        p.x += p.vx
        p.y += p.vy

        if (p.y < 0) {
          p.y = height + 10
          p.x = Math.random() * width
        }
        if (p.x < 0) p.x = width
        if (p.x > width) p.x = 0

        ctx.fillStyle = `rgba(160, 160, 160, ${p.opacity})`
        ctx.fillText(p.char, p.x, p.y)
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-0 opacity-40"
    />
  )
}

// --------------------------------------------------------------------------
// DYNAMIC IMAGE SHOWCASE GALLERY (MAIN IMAGE _1 + ALL SECONDARY ASSETS)
// --------------------------------------------------------------------------
function ProjectImageShowcase({ project }: { project: ProjectDetail }) {
  // Auto-discover all assets matching format: PROJECTNAME_NUMBER (e.g. CNC_1, CNC_2...)
  const discovered = getProjectAssets(project.assetPrefix || project.slug)

  // Fallback to project.gallery or [project.image]
  const rawList: (StaticImageData | string)[] =
    discovered.length > 0
      ? discovered
      : project.gallery && project.gallery.length > 0
      ? project.gallery
      : [project.image]

  // Helper to extract image src string
  const getImageSrc = (img: StaticImageData | string): string => {
    if (typeof img === "string") return img
    return img?.src || ""
  }

  // Strictly deduplicate by src string so main image is never repeated
  const uniqueImages: (StaticImageData | string)[] = []
  const seenSrcs = new Set<string>()

  // Always insert project.image first if present
  if (project.image) {
    uniqueImages.push(project.image)
    seenSrcs.add(getImageSrc(project.image))
  }

  for (const img of rawList) {
    const src = getImageSrc(img)
    if (src && !seenSrcs.has(src)) {
      seenSrcs.add(src)
      uniqueImages.push(img)
    }
  }

  const allImages = uniqueImages.length > 0 ? uniqueImages : [project.image]

  const [selectedIndex, setSelectedIndex] = useState(0)
  const [lightboxOpen, setLightboxOpen] = useState(false)

  const activeImage = allImages[selectedIndex] || project.image

  // Handle lightbox navigation
  const nextImage = () => {
    setSelectedIndex((prev) => (prev + 1) % allImages.length)
  }
  const prevImage = () => {
    setSelectedIndex(
      (prev) => (prev - 1 + allImages.length) % allImages.length
    )
  }

  // Keyboard controls for Lightbox
  useEffect(() => {
    if (!lightboxOpen) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLightboxOpen(false)
      if (e.key === "ArrowRight") nextImage()
      if (e.key === "ArrowLeft") prevImage()
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [lightboxOpen, allImages.length])

  // Determine grid columns dynamically based on image count
  const getSecondaryGridClass = (count: number) => {
    if (count <= 2) return "grid-cols-2"
    if (count === 3) return "grid-cols-2 sm:grid-cols-3"
    if (count === 4) return "grid-cols-2 sm:grid-cols-4"
    return "grid-cols-2 sm:grid-cols-3 md:grid-cols-6"
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mb-12 max-w-4xl mx-auto border border-border bg-secondary/10 p-3 md:p-4 rounded-sm relative overflow-hidden"
      style={{ boxShadow: shadowStyle }}
    >
      {/* Top HUD Header Bar */}
      <div className="flex items-center justify-between border-b border-border px-3 py-2 bg-secondary/30 mb-3 font-mono text-xs">
        <div className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-500/80 animate-pulse" />
          <span className="h-2 w-2 rounded-full bg-foreground/30" />
          <span className="h-2 w-2 rounded-full bg-foreground/30" />
          <span className="ml-2 text-[10px] text-muted-foreground flex items-center gap-1.5 font-medium">
            <Radio className="h-3 w-3 text-emerald-400 animate-pulse" />
            // SCREENSHOT SHOWCASE
          </span>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="px-2 py-0.5 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 font-bold rounded-xs">
            IMAGE 0{selectedIndex + 1} / 0{allImages.length}
          </span>
          <button
            onClick={() => setLightboxOpen(true)}
            className="flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors p-1 border border-border rounded-xs bg-background/50"
            title="Expand Fullscreen"
          >
            <Maximize2 className="h-3 w-3" />
            <span className="hidden sm:inline">FULLSCREEN</span>
          </button>
        </div>
      </div>

      {/* Main Image View */}
      <div className="relative w-full aspect-[16/9] max-h-[420px] overflow-hidden border border-border bg-black group rounded-xs">
        <AnimatePresence mode="wait">
          <motion.div
            key={selectedIndex}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            className="relative w-full h-full cursor-pointer"
            onClick={() => setLightboxOpen(true)}
          >
            <Image
              src={activeImage}
              alt={`${project.name} main screenshot view ${selectedIndex + 1}`}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 896px"
              className="object-cover object-top group-hover:scale-[1.02] transition-transform duration-500"
            />
          </motion.div>
        </AnimatePresence>

        {/* Navigation Arrows on both sides of Main Image View */}
        {allImages.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation()
                prevImage()
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-background/80 hover:bg-emerald-500 border border-border hover:border-emerald-400 text-foreground hover:text-black rounded-full transition-all duration-200 shadow-lg backdrop-blur-xs group/btn opacity-85 hover:opacity-100"
              aria-label="Previous screenshot"
              title="Previous screenshot view"
            >
              <ChevronLeft className="h-5 w-5 group-hover/btn:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation()
                nextImage()
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 z-20 p-2.5 bg-background/80 hover:bg-emerald-500 border border-border hover:border-emerald-400 text-foreground hover:text-black rounded-full transition-all duration-200 shadow-lg backdrop-blur-xs group/btn opacity-85 hover:opacity-100"
              aria-label="Next screenshot"
              title="Next screenshot view"
            >
              <ChevronRight className="h-5 w-5 group-hover/btn:translate-x-0.5 transition-transform" />
            </button>
          </>
        )}

        {/* Subtle scan line passing down the main image */}
        <motion.div
          className="pointer-events-none absolute inset-x-0 h-1 bg-gradient-to-r from-transparent via-emerald-400/40 to-transparent z-10"
          animate={{ y: ["0%", "420px", "0%"] }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        {/* Subtle HUD bottom overlay */}
        <div className="pointer-events-none absolute bottom-2 left-3 right-3 flex items-center justify-between font-mono text-[9px] text-foreground/80 bg-background/80 backdrop-blur-xs px-2.5 py-1 border border-border rounded-xs z-10">
          <span>{project.slug}_view_{selectedIndex + 1}.png</span>
          <span className="text-emerald-400 font-bold">CLICK TO EXPAND</span>
        </div>
      </div>

      {/* Secondary Images Gallery Grid (Shows ALL project images) */}
      {allImages.length > 1 && (
        <div className="mt-3 space-y-2">
          <div className="flex items-center justify-between font-mono text-[10px] text-muted-foreground px-1">
            <span className="font-semibold uppercase text-foreground flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              PROJECT GALLERY ({allImages.length} VIEWS)
            </span>
            <span>Click any thumbnail to switch view</span>
          </div>

          <div
            className={`grid ${getSecondaryGridClass(
              allImages.length
            )} gap-2.5`}
          >
            {allImages.map((img, idx) => {
              const isSelected = idx === selectedIndex
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedIndex(idx)}
                  className={`relative aspect-[16/9] overflow-hidden border rounded-xs transition-all duration-200 group text-left ${
                    isSelected
                      ? "border-emerald-500 ring-2 ring-emerald-500/40 bg-emerald-950/20 shadow-[0_0_12px_rgba(16,185,129,0.2)]"
                      : "border-border/80 hover:border-foreground/60 bg-background/60"
                  }`}
                >
                  <Image
                    src={img}
                    alt={`${project.name} thumbnail ${idx + 1}`}
                    fill
                    sizes="(max-width: 768px) 50vw, 220px"
                    className="object-cover object-top group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors" />

                  {/* Thumbnail Badge Tag */}
                  <div
                    className={`absolute bottom-1 left-1 px-1.5 py-0.5 text-[9px] font-mono font-bold rounded-xs backdrop-blur-xs ${
                      isSelected
                        ? "bg-emerald-500 text-black font-bold"
                        : "bg-background/80 text-foreground/90 border border-border"
                    }`}
                  >
                    {idx === 0 ? "01: MAIN" : `0${idx + 1}: VIEW`}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {lightboxOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-black/95 backdrop-blur-md p-4 sm:p-6"
          >
            {/* Modal Top Bar */}
            <div className="w-full max-w-6xl flex items-center justify-between text-white font-mono text-xs border-b border-border pb-3">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-emerald-400" />
                <span className="font-bold text-sm text-foreground">{project.name}</span>
                <span className="text-muted-foreground">//</span>
                <span className="text-emerald-400 font-semibold">
                  Image {selectedIndex + 1} of {allImages.length}
                </span>
              </div>
              <button
                onClick={() => setLightboxOpen(false)}
                className="p-1.5 border border-border rounded-xs hover:bg-secondary transition-colors text-foreground"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Modal Main Image Container */}
            <div className="relative w-full max-w-5xl h-[65vh] sm:h-[75vh] flex items-center justify-center my-auto">
              <AnimatePresence mode="wait">
                <motion.div
                  key={selectedIndex}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.25 }}
                  className="relative w-full h-full"
                >
                  <Image
                    src={activeImage}
                    alt={`${project.name} expanded view ${selectedIndex + 1}`}
                    fill
                    sizes="100vw"
                    className="object-contain"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Prev / Next Arrows */}
              {allImages.length > 1 && (
                <>
                  <button
                    onClick={prevImage}
                    className="absolute left-2 p-3 bg-background/80 border border-border text-foreground rounded-full hover:bg-emerald-500 hover:text-black transition-all shadow-lg"
                    aria-label="Previous image"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextImage}
                    className="absolute right-2 p-3 bg-background/80 border border-border text-foreground rounded-full hover:bg-emerald-500 hover:text-black transition-all shadow-lg"
                    aria-label="Next image"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>
                </>
              )}
            </div>

            {/* Modal Bottom Thumbnail Strip */}
            {allImages.length > 1 && (
              <div className="w-full max-w-3xl flex items-center justify-center gap-2 overflow-x-auto py-2 border-t border-border">
                {allImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedIndex(idx)}
                    className={`relative h-14 w-24 shrink-0 overflow-hidden border rounded-xs transition-all ${
                      idx === selectedIndex
                        ? "border-emerald-400 ring-2 ring-emerald-500/50 scale-105"
                        : "border-border opacity-60 hover:opacity-100"
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`Thumbnail ${idx + 1}`}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

// --------------------------------------------------------------------------
// SYSTEM ARCHITECTURE TOPOLOGY (THEMED MONOCHROME PIPELINE & RAW ASCII)
// --------------------------------------------------------------------------
function AnimatedArchitectureTopology({
  project,
}: {
  project: ProjectDetail
}) {
  const [viewMode, setViewMode] = useState<"animated" | "ascii">("animated")

  return (
    <div className="mb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <h2 className="font-pixel-line text-xl font-bold flex items-center gap-2 text-foreground">
          <Terminal className="h-4 w-4 text-emerald-400" />
          <span>System Architecture Topology</span>
        </h2>

        {/* Mode Switcher: Animated Pipeline vs Raw ASCII */}
        <div className="flex items-center gap-1 bg-secondary/30 border border-border p-1 rounded-xs font-mono text-xs">
          <button
            onClick={() => setViewMode("animated")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xs transition-all ${
              viewMode === "animated"
                ? "bg-foreground text-background font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Zap className="h-3 w-3 text-muted-foreground" />
            <span>FLOW PIPELINE (ANIMATED)</span>
          </button>
          <button
            onClick={() => setViewMode("ascii")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-xs transition-all ${
              viewMode === "ascii"
                ? "bg-foreground text-background font-bold shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Code2 className="h-3 w-3 text-muted-foreground" />
            <span>RAW ASCII SCHEMATIC</span>
          </button>
        </div>
      </div>

      {/* VIEW MODE 1: ANIMATED FLOW PIPELINE WITH MOVING ARROWS & DATA PACKETS */}
      {viewMode === "animated" ? (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="border border-border bg-secondary/10 p-5 md:p-8 rounded-sm relative overflow-hidden"
          style={{ boxShadow: shadowStyle }}
        >
          {/* Subtle background moving grid */}
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#88888810_1px,transparent_1px),linear-gradient(to_bottom,#88888810_1px,transparent_1px)] bg-[size:24px_24px]" />

          <div className="relative z-10 max-w-4xl mx-auto space-y-4 font-mono">
            {/* TIER 1: Presentation / Client Web Application */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border border-border bg-secondary/15 p-5 rounded-xs relative overflow-hidden group shadow-xs hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-foreground" />
                  <span className="font-mono text-xs font-bold text-foreground tracking-wide uppercase">
                    TIER 1 // CLIENT INTERFACE & APPLICATION LAYER
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xs flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  PORTAL_ONLINE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="space-y-1 text-muted-foreground">
                  <span className="block text-foreground font-semibold">
                    Client Technologies:
                  </span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.techStack[0]?.items.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 bg-background border border-border rounded-xs text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 text-muted-foreground border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-3">
                  <span className="block text-foreground font-semibold">
                    Active Execution Modules:
                  </span>
                  <ul className="text-[11px] space-y-1 list-disc list-inside text-muted-foreground">
                    <li>G-Code Viewer & Code Diff Engine</li>
                    <li>Atomic Client State Hydration & Live Socket</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* FLOW CONNECTOR 1: MOVING ARROWS & DATA PACKET ANIMATION */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              {/* Vertical Animated Line */}
              <div className="relative h-16 w-full flex items-center justify-center">
                {/* SVG Flow Cable */}
                <svg className="absolute inset-0 w-full h-full overflow-visible text-border">
                  <line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className="opacity-60"
                  />
                </svg>

                {/* Moving Data Packet Pill */}
                <motion.div
                  className="absolute px-2.5 py-0.5 bg-foreground text-background font-mono text-[9px] font-bold rounded-full shadow-xs z-20 flex items-center gap-1"
                  animate={{ y: [-24, 24] }}
                  transition={{
                    duration: 2.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Zap className="h-2.5 w-2.5 fill-background text-background" />
                  <span>HTTPS / REST / CRYPTO_HASH</span>
                </motion.div>

                {/* Moving Flow Arrow Heads */}
                <motion.div
                  className="absolute flex flex-col items-center text-foreground/70 z-10"
                  animate={{ y: [-15, 15], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 1.8,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <ArrowDown className="h-5 w-5" />
                </motion.div>
              </div>
            </div>

            {/* TIER 2: Backend Services & Security Vault */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border border-border bg-secondary/15 p-5 rounded-xs relative overflow-hidden group shadow-xs hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Server className="h-4 w-4 text-foreground" />
                  <span className="font-mono text-xs font-bold text-foreground tracking-wide uppercase">
                    TIER 2 // BACKEND ENGINE & SECURITY VAULT
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xs flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  VERIFIER_ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="space-y-1 text-muted-foreground">
                  <span className="block text-foreground font-semibold">
                    Core Backend Stack:
                  </span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.techStack[1]?.items.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 bg-background border border-border rounded-xs text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 text-muted-foreground border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-3">
                  <span className="block text-foreground font-semibold">
                    Security & Processing Pipeline:
                  </span>
                  <ul className="text-[11px] space-y-1 list-disc list-inside text-muted-foreground">
                    <li>AES-256 G-Code File Cipher & Audit Log Engine</li>
                    <li>Role-Based Access Controller (RBAC)</li>
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* FLOW CONNECTOR 2: MOVING ARROWS & STORAGE STREAM */}
            <div className="relative py-4 flex flex-col items-center justify-center">
              <div className="relative h-16 w-full flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full overflow-visible text-border">
                  <line
                    x1="50%"
                    y1="0"
                    x2="50%"
                    y2="100%"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeDasharray="6 6"
                    className="opacity-60"
                  />
                </svg>

                {/* Moving Storage Packet Pill */}
                <motion.div
                  className="absolute px-2.5 py-0.5 bg-foreground text-background font-mono text-[9px] font-bold rounded-full shadow-xs z-20 flex items-center gap-1"
                  animate={{ y: [-24, 24] }}
                  transition={{
                    duration: 2.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Lock className="h-2.5 w-2.5 fill-background text-background" />
                  <span>ENC_STREAM / GRIDFS_BINARY</span>
                </motion.div>

                {/* Moving Flow Arrow Heads */}
                <motion.div
                  className="absolute flex flex-col items-center text-foreground/70 z-10"
                  animate={{ y: [-15, 15], opacity: [0.3, 1, 0.3] }}
                  transition={{
                    duration: 2.0,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                >
                  <ArrowDown className="h-5 w-5" />
                </motion.div>
              </div>
            </div>

            {/* TIER 3: Persistent Storage & Cloud Infrastructure */}
            <motion.div
              whileHover={{ scale: 1.01 }}
              className="border border-border bg-secondary/15 p-5 rounded-xs relative overflow-hidden group shadow-xs hover:border-emerald-500/40 transition-colors"
            >
              <div className="flex items-center justify-between mb-3 border-b border-border pb-2">
                <div className="flex items-center gap-2">
                  <Database className="h-4 w-4 text-foreground" />
                  <span className="font-mono text-xs font-bold text-foreground tracking-wide uppercase">
                    TIER 3 // PERSISTENT STORAGE & CLOUD TIER
                  </span>
                </div>
                <span className="font-mono text-[10px] px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold rounded-xs flex items-center gap-1">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  STORAGE_SYNCED
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs font-mono">
                <div className="space-y-1 text-muted-foreground">
                  <span className="block text-foreground font-semibold">
                    Storage Architecture:
                  </span>
                  <div className="flex flex-wrap gap-1 pt-1">
                    {project.techStack[2]?.items.map((tech) => (
                      <span
                        key={tech}
                        className="text-[10px] px-2 py-0.5 bg-background border border-border rounded-xs text-foreground"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-1 text-muted-foreground border-t md:border-t-0 md:border-l border-border pt-2 md:pt-0 md:pl-3">
                  <span className="block text-foreground font-semibold">
                    Data Persistence & Cloud:
                  </span>
                  <ul className="text-[11px] space-y-1 list-disc list-inside text-muted-foreground">
                    <li>MongoDB Atlas Machine Schemas & Operator Profiles</li>
                    <li>GCP Cloud Storage Encrypted Backup Vault</li>
                  </ul>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      ) : (
        /* VIEW MODE 2: RAW ASCII SCHEMATIC */
        <div
          className="relative border border-border bg-background p-4 md:p-6 rounded-sm overflow-x-auto"
          style={{ boxShadow: shadowStyle }}
        >
          <motion.div
            className="pointer-events-none absolute inset-x-0 h-8 bg-gradient-to-b from-transparent via-emerald-500/10 to-transparent"
            animate={{ y: ["0%", "200px", "0%"] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          />

          <pre className="font-mono text-[9px] sm:text-[11px] leading-tight text-foreground font-semibold whitespace-pre">
            {project.architectureAscii}
          </pre>
        </div>
      )}
    </div>
  )
}

// --------------------------------------------------------------------------
// MAIN PROJECT DETAIL VIEW CONTAINER
// --------------------------------------------------------------------------
export function ProjectDetailView({
  project,
  prevProject,
  nextProject,
}: ProjectDetailViewProps) {
  // Live auto-streaming terminal logs state
  const [logs, setLogs] = useState<string[]>(project.terminalLogs)
  const terminalEndRef = useRef<HTMLDivElement | null>(null)

  // Auto-stream telemetry log lines continuously
  useEffect(() => {
    const extraTelemetryLines = [
      `[LIVE_TELEMETRY] Signal response time 14ms | Network packet integrity 100%`,
      `[MEMORY_AUDIT] Garbage collector cleared 18.4MB buffer space`,
      `[SECURITY_GUARD] SHA-256 hash match verified: 0x8f3c matching target`,
      `[METRIC_UPDATE] System throughput running at optimal velocity`,
      `[CLUSTER_HEALTH] Nodes 1..4 responding: 0 dropouts detected`,
      `[STREAM_DATA] Telemetry heartbeat dispatched to central repository`,
    ]

    const interval = setInterval(() => {
      const randomLine =
        extraTelemetryLines[
          Math.floor(Math.random() * extraTelemetryLines.length)
        ]
      const timestamp = new Date().toLocaleTimeString("en-US", {
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })

      setLogs((prev) => {
        const nextLogs = [...prev, `[${timestamp}] ${randomLine}`]
        if (nextLogs.length > 14) {
          return nextLogs.slice(nextLogs.length - 14)
        }
        return nextLogs
      })
    }, 2800)

    return () => clearInterval(interval)
  }, [])

  const allTechItems = project.techStack.flatMap((s) => s.items)

  return (
    <div className="relative min-h-screen bg-background text-foreground overflow-x-hidden w-full max-w-full font-mono">
      {/* Background canvas moving particles */}
      <AnimatedBackgroundCanvas />

      {/* Vertical subtle automatic moving scanline background effect */}
      <motion.div
        className="pointer-events-none fixed inset-x-0 h-48 bg-gradient-to-b from-transparent via-foreground/5 to-transparent border-b border-border/30 z-0"
        animate={{ y: ["-20vh", "120vh"] }}
        transition={{ duration: 16, repeat: Infinity, ease: "linear" }}
      />

      {/* Responsive Header */}
      <ProjectHeader projectName={project.name} />

      <main className="relative z-10 mx-auto max-w-7xl px-4 py-8 md:py-12 lg:px-8 w-full max-w-full">
        {/* Breadcrumb & Navigation */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-6 flex items-center justify-between font-mono text-xs text-muted-foreground"
        >
          <div className="flex items-center gap-2">
            <Link
              href="/"
              className="hover:text-foreground transition-colors"
            >
              Portfolio
            </Link>
            <span>/</span>
            <Link
              href="/#hardware-abstraction"
              className="hover:text-foreground transition-colors"
            >
              Projects
            </Link>
            <span>/</span>
            <span className="text-foreground font-semibold">
              {project.name}
            </span>
          </div>
          <span className="hidden sm:inline-block text-[10px] px-2 py-0.5 border border-border bg-secondary/30 rounded-xs">
            {project.level}
          </span>
        </motion.div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative border border-border bg-secondary/10 p-6 md:p-10 rounded-sm mb-10 overflow-hidden"
          style={{ boxShadow: shadowStyle }}
        >
          <motion.div
            className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className="font-mono text-xs font-bold px-2.5 py-1 bg-foreground text-background rounded-xs">
              {project.level}
            </span>

            {/* Clean green status badge */}
            <span className="font-mono text-xs px-2.5 py-1 border border-emerald-500/30 text-emerald-400 bg-emerald-500/10 flex items-center gap-1.5 font-medium rounded-xs">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              {project.status}
            </span>

            <span className="font-mono text-xs text-muted-foreground border border-border px-2.5 py-1 rounded-xs bg-background/50">
              {project.category}
            </span>
          </div>

          <h1 className="font-pixel-line text-3xl sm:text-4xl md:text-6xl font-bold text-foreground tracking-tight mb-4">
            {project.name}
          </h1>

          <div className="flex items-center gap-2 mb-6 text-xs md:text-sm font-mono text-foreground/90 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-emerald-400 shrink-0" />
            <span className="uppercase tracking-wide">{project.tagline}</span>
          </div>

          <p className="font-mono text-xs md:text-sm leading-relaxed text-muted-foreground max-w-4xl mb-8">
            {project.fullDescription}
          </p>

          {/* Action CTAs & Metadata Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 border-t border-border/60 pt-6">
            <div className="flex flex-wrap items-center gap-3">
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 font-mono text-xs font-bold bg-foreground text-background px-4 py-2 hover:bg-emerald-500 hover:text-black transition-all duration-200 rounded-xs shadow-xs"
                >
                  <span>Launch Live Application</span>
                  <ExternalLink className="h-3.5 w-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              )}
              {project.githubUrl && (
                <a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-mono text-xs font-bold border border-border bg-secondary/30 px-4 py-2 hover:bg-foreground hover:text-background transition-all duration-200 rounded-xs"
                >
                  <Github className="h-3.5 w-3.5" />
                  <span>GitHub Repository</span>
                </a>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground font-mono">
              <div>
                <span className="block text-[10px] uppercase opacity-60">
                  Timeline
                </span>
                <span className="text-foreground font-semibold">
                  {project.timeline}
                </span>
              </div>
              <div>
                <span className="block text-[10px] uppercase opacity-60">
                  Role
                </span>
                <span className="text-foreground font-semibold">
                  {project.role}
                </span>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Automatic Horizontal Moving Tech Stream Marquee */}
        <div className="mb-12 overflow-hidden border-y border-border/70 bg-secondary/20 py-2.5 relative">
          <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-background to-transparent z-10" />

          <motion.div
            className="flex gap-6 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 22,
              ease: "linear",
              repeat: Infinity,
            }}
          >
            {[...allTechItems, ...allTechItems, ...allTechItems].map(
              (item, i) => (
                <span
                  key={`${item}-${i}`}
                  className="inline-flex items-center gap-2 font-mono text-[11px] text-muted-foreground font-medium"
                >
                  <Zap className="h-3 w-3 text-emerald-400 shrink-0" />
                  <span className="text-foreground">{item}</span>
                  <span className="ml-4 text-border font-bold">///</span>
                </span>
              )
            )}
          </motion.div>
        </div>

        {/* Dynamic Image Showcase Gallery (Shows ALL project images) */}
        <ProjectImageShowcase project={project} />

        {/* -------------------------------------------------------------------------- */}
        {/* SECTION 1: KEY PERFORMANCE METRICS & IMPACT (GREEN ACCENTS + MOVEMENT ANIMATION) */}
        {/* -------------------------------------------------------------------------- */}
        <div className="mb-12">
          <h2 className="font-pixel-line text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Activity className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Key Performance Metrics & Impact</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {project.metrics.map((metric, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  opacity: { duration: 0.4, delay: idx * 0.1 },
                  y: {
                    duration: 4 + idx * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  y: -8,
                  scale: 1.025,
                  transition: { duration: 0.25 },
                }}
                className="relative border border-border bg-secondary/10 p-5 rounded-sm flex flex-col justify-between overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_18px_rgba(16,185,129,0.18)] transition-all duration-300"
                style={{ boxShadow: shadowStyle }}
              >
                {/* Subtle animated green line indicator at bottom */}
                <motion.div
                  className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-transparent opacity-60 group-hover:opacity-100"
                  animate={{ scaleX: [0.3, 1, 0.3], opacity: [0.4, 0.9, 0.4] }}
                  transition={{
                    duration: 3 + idx * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />

                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground block">
                      {metric.label}
                    </span>
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-400/80 group-hover:bg-emerald-400 transition-colors" />
                  </div>
                  <div className="font-pixel-line text-2xl md:text-3xl font-bold text-emerald-400 mb-2">
                    {metric.value}
                  </div>
                </div>
                <p className="font-mono text-xs text-muted-foreground leading-relaxed border-t border-border/40 pt-3 group-hover:text-foreground/90 transition-colors">
                  {metric.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* SECTION 2 & 3: EXECUTIVE SUMMARY - PROBLEM & SOLUTION (GREEN ACCENTS + MOVEMENT ANIMATION) */}
        {/* -------------------------------------------------------------------------- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {/* PROBLEM STATEMENT CARD */}
          <motion.div
            initial={{ opacity: 0, x: -15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 5.5, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.25 },
            }}
            className="relative border border-border bg-secondary/5 p-6 rounded-sm overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_22px_rgba(16,185,129,0.16)] transition-all duration-300"
            style={{ boxShadow: shadowStyle }}
          >
            {/* Top Green Moving Accent Beam */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-emerald-500/40 via-emerald-400 to-transparent"
              animate={{ x: ["-100%", "100%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <h3 className="font-pixel-line text-lg font-bold mb-3 text-foreground flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Problem Statement</span>
            </h3>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors">
              {project.problemStatement}
            </p>
          </motion.div>

          {/* ENGINEERING SOLUTION CARD */}
          <motion.div
            initial={{ opacity: 0, x: 15 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            animate={{ y: [0, -5, 0] }}
            transition={{
              opacity: { duration: 0.5 },
              y: { duration: 6, repeat: Infinity, ease: "easeInOut" },
            }}
            whileHover={{
              y: -8,
              scale: 1.02,
              transition: { duration: 0.25 },
            }}
            className="relative border border-border bg-secondary/5 p-6 rounded-sm overflow-hidden group hover:border-emerald-500/50 hover:shadow-[0_0_22px_rgba(16,185,129,0.16)] transition-all duration-300"
            style={{ boxShadow: shadowStyle }}
          >
            {/* Top Green Moving Accent Beam */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-400 to-emerald-500/40"
              animate={{ x: ["100%", "-100%"] }}
              transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <h3 className="font-pixel-line text-lg font-bold mb-3 text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-400 group-hover:scale-110 transition-transform" />
              <span>Engineering Solution</span>
            </h3>
            <p className="font-mono text-xs leading-relaxed text-muted-foreground group-hover:text-foreground/90 transition-colors">
              {project.solutionOverview}
            </p>
          </motion.div>
        </div>

        {/* -------------------------------------------------------------------------- */}
        {/* SECTION 4: CORE CAPABILITIES & SYSTEM FEATURES (GREEN ACCENTS + MOVEMENT ANIMATION) */}
        {/* -------------------------------------------------------------------------- */}
        <div className="mb-12">
          <h2 className="font-pixel-line text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Cpu className="h-4 w-4 text-emerald-400 animate-pulse" />
            <span>Core Capabilities & System Features</span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {project.keyFeatures.map((feat, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                animate={{ y: [0, -4, 0] }}
                transition={{
                  opacity: { duration: 0.4, delay: idx * 0.08 },
                  y: {
                    duration: 3.8 + idx * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                  },
                }}
                whileHover={{
                  y: -7,
                  scale: 1.02,
                  transition: { duration: 0.25 },
                }}
                className="relative border border-border bg-secondary/5 p-5 rounded-sm group hover:border-emerald-500/50 hover:shadow-[0_0_18px_rgba(16,185,129,0.15)] transition-all duration-300"
                style={{ boxShadow: shadowStyle }}
              >
                {/* Floating green pulse dot in corner */}
                <span className="absolute top-3 right-3 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>

                <div className="flex items-center gap-3 mb-2">
                  <span className="font-mono text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-xs">
                    0{idx + 1}
                  </span>
                  <h3 className="font-pixel-line text-sm font-bold text-foreground group-hover:text-emerald-400 transition-colors">
                    {feat.title}
                  </h3>
                </div>
                <p className="font-mono text-xs leading-relaxed text-muted-foreground pl-9 group-hover:text-foreground/90 transition-colors">
                  {feat.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Technical Stack Architecture */}
        <div className="mb-12">
          <h2 className="font-pixel-line text-xl font-bold mb-6 flex items-center gap-2 text-foreground">
            <Layers className="h-4 w-4 text-emerald-400" />
            <span>Technical Stack Architecture</span>
          </h2>
          <div
            className="border border-border bg-secondary/5 p-6 rounded-sm"
            style={{ boxShadow: shadowStyle }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {project.techStack.map((stack, idx) => (
                <div key={idx} className="space-y-3">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-emerald-400 block border-b border-border/60 pb-2">
                    // {stack.category}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {stack.items.map((item) => (
                      <span
                        key={item}
                        className="font-mono text-[10px] px-2.5 py-1 border border-border bg-background/80 text-foreground rounded-xs hover:border-emerald-500/40 hover:text-emerald-400 transition-colors"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Animated System Architecture Topology Component */}
        <AnimatedArchitectureTopology project={project} />

        {/* Live Automatic Telemetry CLI Log */}
        <div className="mb-16">
          <div
            className="border border-border bg-background rounded-sm overflow-hidden"
            style={{ boxShadow: shadowStyle }}
          >
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5 bg-secondary/30 font-mono text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-foreground">TELEMETRY_CONSOLE // {project.slug}.sh</span>
              </div>
              <div className="flex items-center gap-2 text-[10px]">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-emerald-400 font-medium uppercase tracking-wider">
                  LIVE STREAM
                </span>
              </div>
            </div>
            <div className="p-4 sm:p-6 font-mono text-xs text-foreground space-y-2 overflow-x-auto max-h-[300px] overflow-y-auto bg-background">
              <AnimatePresence>
                {logs.map((line, idx) => (
                  <motion.div
                    key={`${line}-${idx}`}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex gap-2 items-start"
                  >
                    <span className="text-emerald-400 shrink-0 font-bold">&gt;</span>
                    <span
                      className={
                        line.startsWith("$")
                          ? "text-foreground font-bold"
                          : line.includes("[WARN]")
                          ? "text-amber-400 font-medium"
                          : line.includes("[SUCCESS]")
                          ? "text-emerald-400 font-semibold"
                          : line.includes("[LIVE_TELEMETRY]")
                          ? "text-emerald-300 font-medium"
                          : "text-muted-foreground"
                      }
                    >
                      {line}
                    </span>
                  </motion.div>
                ))}
              </AnimatePresence>

              <div className="flex items-center gap-2 text-muted-foreground pt-1">
                <span className="text-emerald-400 font-bold">&gt;</span>
                <span className="inline-block h-3.5 w-2 bg-emerald-400 animate-pulse" />
              </div>
              <div ref={terminalEndRef} />
            </div>
          </div>
        </div>

        {/* Next / Previous Project Carousel Navigation */}
        <div className="border-t border-border pt-8 mb-12 grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href={`/projects/${prevProject.slug}`}
            className="border border-border bg-secondary/10 p-4 rounded-sm hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-200 flex flex-col items-start group"
          >
            <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1 group-hover:text-emerald-400">
              <ArrowLeft className="h-3 w-3" /> Previous Project
            </span>
            <span className="font-pixel-line text-sm font-bold text-foreground mt-1 group-hover:text-emerald-400">
              {prevProject.name}
            </span>
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="border border-border bg-secondary/10 p-4 rounded-sm hover:border-emerald-500/50 hover:shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-200 flex flex-col items-end text-right group"
          >
            <span className="font-mono text-[10px] text-muted-foreground uppercase flex items-center gap-1 group-hover:text-emerald-400">
              Next Project <ChevronRight className="h-3 w-3" />
            </span>
            <span className="font-pixel-line text-sm font-bold text-foreground mt-1 group-hover:text-emerald-400">
              {nextProject.name}
            </span>
          </Link>
        </div>
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  )
}
