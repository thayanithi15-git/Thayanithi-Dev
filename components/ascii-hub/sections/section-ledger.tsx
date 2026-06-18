"use client"

import { motion } from "framer-motion"
import { useState } from "react"
import type { TechSection } from "@/lib/sections-data"
import Image from "next/image"

import eqrevDark from "@/assets/exp/eqrevDark.png"
import eqrevLight from "@/assets/exp/eqrevLight.png"
import crayondLogo from "@/assets/exp/crayond.png"
import thinkuniLogo from "@/assets/exp/thinkuni.svg"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 03: DISTRIBUTED LEDGER
  Style: Horizontal scrolling block-chain visualization.
  Each block is a clickable card. Center-stage hero.
  Newspaper-column text layout for description.
*/

const blocks = [
  {
    company: "EQREV",
    role: "Software Engineer",
    timeline: "Jan 2025 – Dec 2025",
    type: "Hybrid",
    hash: "EQREV-TX01",
    prev: "GENESIS-00",
    height: 1021,
    logoDark: eqrevDark,
    logoLight: eqrevLight,
    details: [
      "Engineered a SaaS platform for Zepto, Blinkit, and Instamart with pin code-level insights across 1,000+ stores in India.",
      "Adopted by leading D2C brands like Mokobara and Lifelong, delivering a complete frontend experience from landing page to full platform.",
      "Enabled data-driven product and inventory strategies that optimized overall performance."
    ]
  },
  {
    company: "Crayon’d",
    role: "Software Engineer",
    timeline: "Sep 2024 – Apr 2025",
    type: "Sathy, Erode",
    hash: "CRAYOND-TX02",
    prev: "EQREV-TX01",
    height: 1022,
    logoDark: crayondLogo,
    logoLight: crayondLogo,
    details: [
      "Developed 2+ client-facing products with responsive React UIs and scalable Node.js/Express APIs, achieving 20% faster feature delivery.",
      "Crafted modular design, optimized API integrations, coding standards, and Git workflows.",
      "Enhanced code maintainability, team efficiency, and deployment speed."
    ]
  },
  {
    company: "Thinkuni",
    role: "Software Engineer",
    timeline: "Sept 2025 – Jan 2026",
    type: "Remote",
    hash: "THINKUNI-TX03",
    prev: "CRAYOND-TX02",
    height: 1023,
    logoDark: thinkuniLogo,
    logoLight: thinkuniLogo,
    details: [
      "Developed frontend components and modules focused on interactive learning and data visualization.",
      "Improved user engagement and learning outcomes through innovative UI solutions.",
      "Built Vue.js components for enhanced learning analytics dashboards."
    ]
  }
]

function BlockCard({ block, index, isSelected, onSelect }: {
  block: typeof blocks[0]
  index: number
  isSelected: boolean
  onSelect: () => void
}) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: 0.15 + index * 0.1 }}
      onClick={onSelect}
      className={`group relative flex w-56 flex-shrink-0 flex-col border p-4 text-left font-mono transition-all duration-300 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none ${
        isSelected
          ? "border-foreground bg-foreground text-background"
          : "border-border bg-background text-foreground hover:border-foreground"
      }`}
      style={{ boxShadow: shadow }}
    >
      <div className="flex items-start justify-between w-full mb-2">
        <span className={`text-[10px] uppercase tracking-wider ${isSelected ? "text-background/50" : "text-muted-foreground"}`}>
          {block.timeline}
        </span>
        <div className={`relative h-7 w-7 shrink-0 bg-zinc-100 p-0.5 rounded-sm overflow-hidden ${
          isSelected ? "border-0" : "border border-border"
        }`} style={{ boxShadow: isSelected ? "none" : shadow }}>
          <Image
            src={block.logoDark}
            alt={block.company}
            fill
            sizes="28px"
            className="object-contain"
          />
        </div>
      </div>
      <span className={`text-sm font-bold ${isSelected ? "text-background" : "text-foreground"}`}>
        {block.company}
      </span>
      <span className={`text-[10px] ${isSelected ? "text-background/70" : "text-muted-foreground"}`}>
        {block.role}
      </span>
      <div className="mt-3 flex flex-col gap-1 text-[10px]">
        <div className="flex justify-between">
          <span className={isSelected ? "text-background/50" : "text-muted-foreground"}>Location</span>
          <span>{block.type}</span>
        </div>
        <div className="flex justify-between">
          <span className={isSelected ? "text-background/50" : "text-muted-foreground"}>Block</span>
          <span>#{block.height}</span>
        </div>
      </div>
      {/* Chain connector */}
      {index < blocks.length - 1 && (
        <div className="absolute -right-6 top-1/2 hidden -translate-y-1/2 items-center md:flex" aria-hidden="true">
          <div className="h-px w-6 bg-border" />
          <div className="h-0 w-0 border-y-[3px] border-l-[5px] border-y-transparent border-l-border" />
        </div>
      )}
    </motion.button>
  )
}

export function SectionLedger({ section }: { section: TechSection }) {
  const [selectedBlock, setSelectedBlock] = useState(0)

  return (
    <div className="py-20 lg:py-32">
      {/* Full-width top bar with number + title */}
      <div className="mx-auto max-w-7xl px-4 lg:px-8">
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="flex items-end gap-6"
        >
          <span className="font-pixel-line text-7xl font-bold leading-none text-foreground/[0.08] md:text-9xl">
            {section.number}
          </span>
          <div className="pb-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{section.subtitle}</span>
            <h2 className="font-pixel-line text-3xl font-bold text-foreground md:text-5xl">
              {section.title}
            </h2>
          </div>
        </motion.div>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
          className="mt-8 max-w-4xl font-mono text-sm leading-relaxed text-muted-foreground"
        >
          {section.description} Each career milestone is represented as a verified ledger block.
        </motion.p>
      </div>

      {/* Horizontal scrolling chain */}
      <div className="mt-12 overflow-x-auto">
        <div className="mx-auto flex w-max items-center gap-6 px-8 pb-4">
          {blocks.map((block, i) => (
            <BlockCard
              key={block.hash}
              block={block}
              index={i}
              isSelected={selectedBlock === i}
              onSelect={() => setSelectedBlock(i)}
            />
          ))}
        </div>
      </div>

      {/* Selected block detail + specs */}
      <div className="mx-auto mt-8 max-w-7xl px-4 lg:px-8">
        <div className="grid gap-4 md:grid-cols-2">
          {/* Block detail panel */}
          <motion.div
            key={selectedBlock}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="border border-border p-6"
            style={{ boxShadow: shadow }}
          >
            <div className="flex items-center justify-between border-b border-border pb-4">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-foreground" />
                <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">Ledger inspector</span>
              </div>
              <div className="relative h-7 w-7 border border-border bg-zinc-100 p-0.5 rounded-sm overflow-hidden" style={{ boxShadow: shadow }}>
                <Image
                  src={blocks[selectedBlock].logoDark}
                  alt={blocks[selectedBlock].company}
                  fill
                  sizes="28px"
                  className="object-contain"
                />
              </div>
            </div>
            <div className="mt-4 flex flex-col gap-3 font-mono text-xs">
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Company</span>
                <span className="font-bold text-foreground">{blocks[selectedBlock].company}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Role</span>
                <span className="font-bold text-foreground">{blocks[selectedBlock].role}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Timeline</span>
                <span className="text-foreground">{blocks[selectedBlock].timeline}</span>
              </div>
              <div className="flex justify-between border-b border-border pb-2">
                <span className="text-muted-foreground">Location</span>
                <span className="text-foreground">{blocks[selectedBlock].type}</span>
              </div>
              <div className="mt-2 text-muted-foreground">
                <span className="font-bold text-foreground block mb-2">Key Accomplishments:</span>
                <ul className="list-disc pl-4 space-y-1 text-[11px] leading-relaxed">
                  {blocks[selectedBlock].details.map((detail, idx) => (
                    <li key={idx}>{detail}</li>
                  ))}
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Specs as vertical meter */}
          <div className="flex flex-col gap-3">
            {section.specs.map((spec, i) => (
              <motion.div
                key={spec.label}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                className="flex items-center gap-4 border border-border p-4"
                style={{ boxShadow: shadow }}
              >
                <div className="flex h-10 w-10 items-center justify-center bg-foreground font-mono text-xs font-bold text-background">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{spec.label}</div>
                  <div className="font-mono text-sm font-bold text-foreground">{spec.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
