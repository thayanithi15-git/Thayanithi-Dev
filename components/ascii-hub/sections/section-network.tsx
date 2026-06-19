"use client"

import { motion } from "framer-motion"
import type { TechSection } from "@/lib/sections-data"
import { useState } from "react"
import Image from "next/image"

// Import all tech stack logos
import tsLogo from "@/assets/techstacks/ts.png"
import jsLogo from "@/assets/techstacks/js.png"
import nextjsLogo from "@/assets/techstacks/nextjs.png"
import reactLogo from "@/assets/techstacks/react.png"
import nodeLogo from "@/assets/techstacks/node.png"
import expressLogo from "@/assets/techstacks/express.png"
import mongoLogo from "@/assets/techstacks/mongo.png"
import mysqlLogo from "@/assets/techstacks/mysql.png"
import postgresLogo from "@/assets/techstacks/postgres.png"
import firebaseLogo from "@/assets/techstacks/firebase.png"
import githubLogo from "@/assets/techstacks/github.png"
import tailwindLogo from "@/assets/techstacks/tailwind.png"
import framerLogo from "@/assets/techstacks/framer.png"
import restapiLogo from "@/assets/techstacks/restapi.png"
import vscodeLogo from "@/assets/techstacks/vscode.png"
import postmanLogo from "@/assets/techstacks/postman.png"
import dockerLogo from "@/assets/techstacks/docker.png"
import figmaLogo from "@/assets/techstacks/figma.png"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

// Map of individual tech item names to their respective logos
const techItemLogos: Record<string, any> = {
  "TypeScript": tsLogo,
  "JavaScript": jsLogo,
  "Next.js": nextjsLogo,
  "React.js": reactLogo,
  "Tailwind CSS": tailwindLogo,
  "Framer Motion": framerLogo,
  "React Native": reactLogo,
  "Node.js": nodeLogo,
  "Express.js": expressLogo,
  "REST APIs": restapiLogo,
  "MongoDB": mongoLogo,
  "MySQL": mysqlLogo,
  "PostgreSQL": postgresLogo,
  "GitHub": githubLogo,
  "Git": githubLogo,
  "VS Code": vscodeLogo,
  "Postman": postmanLogo,
  "Docker": dockerLogo,
  "Figma": figmaLogo,
  "Firebase": firebaseLogo
}

const nodes = [
  { id: "LANG", name: "Languages", x: 15, y: 20, status: "active", items: [
    { name: "TypeScript", pct: 95 },
    { name: "JavaScript", pct: 95 },
    { name: "Python", pct: 80 },
    { name: "Java", pct: 75 },
    { name: "C", pct: 70 }
  ]},
  { id: "WEB", name: "Frontend", x: 50, y: 15, status: "active", items: [
    { name: "Next.js", pct: 95 },
    { name: "React.js", pct: 95 },
    { name: "Vue.js", pct: 80 },
    { name: "Tailwind CSS", pct: 90 },
    { name: "Framer Motion", pct: 85 }
  ]},
  { id: "MOBL", name: "Mobile", x: 85, y: 20, status: "active", items: [
    { name: "React Native", pct: 90 },
    { name: "Flutter", pct: 75 }
  ]},
  { id: "BACK", name: "Backend", x: 50, y: 50, status: "active", items: [
    { name: "Node.js", pct: 95 },
    { name: "Express.js", pct: 90 },
    { name: "Fastify", pct: 80 },
    { name: "REST APIs", pct: 95 },
    { name: "JWT Auth", pct: 90 }
  ]},
  { id: "DATA", name: "Databases", x: 20, y: 80, status: "active", items: [
    { name: "MongoDB", pct: 90 },
    { name: "MySQL", pct: 85 },
    { name: "PostgreSQL", pct: 85 },
    { name: "Prisma", pct: 85 },
    { name: "Sequelize", pct: 80 }
  ]},
  { id: "CLOD", name: "Cloud Stack", x: 50, y: 80, status: "active", items: [
    { name: "Google Cloud", pct: 80 },
    { name: "BigQuery", pct: 75 }
  ]},
  { id: "TOOL", name: "Dev Tools", x: 80, y: 80, status: "active", items: [
    { name: "Git", pct: 90 },
    { name: "GitHub", pct: 90 },
    { name: "VS Code", pct: 95 },
    { name: "Postman", pct: 90 },
    { name: "Web Scraping", pct: 85 }
  ]},
]

const connections = [
  [0, 1], [0, 2], [0, 3], [0, 4],
  [1, 3], [2, 3], [3, 4], [3, 5],
  [3, 6], [5, 4], [6, 1], [6, 2]
]

function NetworkMap({ selectedNode, onSelectNode }: {
  selectedNode: number
  onSelectNode: (idx: number) => void
}) {
  return (
    <div className="relative aspect-[1.2/1] sm:aspect-[2/1] w-full overflow-hidden border border-border bg-background p-4" style={{ boxShadow: shadow }}>
      {/* Grid lines */}
      <div className="absolute inset-0 opacity-[0.03]" aria-hidden="true">
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`h-${i}`} className="absolute h-px w-full bg-foreground" style={{ top: `${(i + 1) * 10}%` }} />
        ))}
        {Array.from({ length: 10 }).map((_, i) => (
          <div key={`v-${i}`} className="absolute top-0 h-full w-px bg-foreground" style={{ left: `${(i + 1) * 10}%` }} />
        ))}
      </div>

      {/* Connections as flowing dashed lines with moving arrows */}
      <svg className="absolute inset-0 h-full w-full" aria-hidden="true">
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="36"
            refY="5"
            markerWidth="5"
            markerHeight="5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="currentColor" className="text-foreground/60" />
          </marker>
        </defs>
        {connections.map(([from, to], i) => (
          <g key={i}>
            {/* Static background connection path */}
            <line
              x1={`${nodes[from].x}%`}
              y1={`${nodes[from].y}%`}
              x2={`${nodes[to].x}%`}
              y2={`${nodes[to].y}%`}
              stroke="currentColor"
              strokeWidth="1"
              className="text-border/20"
            />
            {/* Continuously flowing animated dashed lines with arrowheads */}
            <motion.line
              x1={`${nodes[from].x}%`}
              y1={`${nodes[from].y}%`}
              x2={`${nodes[to].x}%`}
              y2={`${nodes[to].y}%`}
              stroke="currentColor"
              strokeWidth="1.2"
              strokeDasharray="6 8"
              markerEnd="url(#arrow)"
              className="text-foreground/40"
              animate={{ strokeDashoffset: [0, -28] }}
              transition={{
                repeat: Infinity,
                ease: "linear",
                duration: 2.5
              }}
            />
          </g>
        ))}
      </svg>

      {/* Nodes (rendered as clean text badges with responsive styles) */}
      {nodes.map((node, i) => {
        const isSelected = selectedNode === i
        return (
          <motion.button
            key={node.id}
            onClick={() => onSelectNode(i)}
            className="absolute flex flex-col items-center focus:outline-none z-10"
            style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 + i * 0.05, type: "spring" }}
          >
            <div className={`flex h-8 px-3 items-center justify-center border font-mono text-[9px] font-bold transition-all duration-300 ${
              isSelected ? "border-foreground bg-foreground text-background scale-105 shadow-md"
              : "border-border bg-background text-foreground hover:border-foreground hover:scale-102"
            }`} style={{ boxShadow: shadow }}>
              {node.name}
            </div>
            {isSelected && (
              <motion.div
                className="mt-1 h-1 w-1 bg-foreground"
                animate={{ opacity: [1, 0.2, 1] }}
                transition={{ repeat: Infinity, duration: 2, delay: i * 0.3 }}
              />
            )}
          </motion.button>
        )
      })}
    </div>
  )
}

export function SectionNetwork({ section }: { section: TechSection }) {
  const [selectedNode, setSelectedNode] = useState(0)

  return (
    <div className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
      {/* Non-inverted header band */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="flex flex-col gap-4 text-foreground mb-8"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-end gap-6">
            <span className="font-pixel-line text-7xl font-bold leading-none text-foreground/[0.08] md:text-9xl">
              {section.number}
            </span>
            <div className="pb-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{section.subtitle}</span>
              </div>
              <h2 className="mt-2 font-pixel-line text-3xl font-bold text-foreground md:text-5xl">
                {section.title}
              </h2>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <motion.div
              className="h-2.5 w-2.5 bg-foreground"
              animate={{ opacity: [1, 0.3, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            />
            <span className="font-mono text-xs text-muted-foreground">ACTIVE</span>
          </div>
        </div>
        <p className="max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground">
          {section.description} Select a node on the network topology model to load its details.
        </p>
      </motion.div>

      {/* Bento grid */}
      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        {/* Network map (2 cols) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2"
        >
          <NetworkMap selectedNode={selectedNode} onSelectNode={setSelectedNode} />
        </motion.div>

        {/* Dynamic Items stack for the selected Node */}
        <div className="flex flex-col gap-4">
          <div className="border border-border p-4 bg-secondary/20" style={{ boxShadow: shadow }}>
            <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground block mb-2">Category</span>
            <h3 className="font-pixel-line text-2xl font-bold text-foreground">{nodes[selectedNode].name}</h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-4">
            {nodes[selectedNode].items.map((m, i) => (
              <motion.div
                key={m.name}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-2.5 border border-border p-4 bg-background"
                style={{ boxShadow: shadow }}
              >
                {techItemLogos[m.name] && (
                  <div className="relative h-9 w-9 shrink-0 border border-border bg-zinc-100 p-1" style={{ boxShadow: shadow }}>
                    <Image
                      src={techItemLogos[m.name]}
                      alt={m.name}
                      fill
                      sizes="36px"
                      className="object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                )}
                <span className="font-mono text-[10px] uppercase tracking-wider text-foreground font-semibold">{m.name}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Specs row as horizontal badges */}
      <div className="mt-4 flex flex-wrap gap-3">
        {section.specs.map((spec, i) => (
          <motion.div
            key={spec.label}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 + i * 0.08 }}
            className="flex items-center gap-2 border border-border px-4 py-2 font-mono text-xs"
            style={{ boxShadow: shadow }}
          >
            <span className="text-muted-foreground">{spec.label}</span>
            <span className="text-foreground font-bold">{spec.value}</span>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
