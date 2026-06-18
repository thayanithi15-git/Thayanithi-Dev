"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState } from "react"
import type { TechSection } from "@/lib/sections-data"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

const learningStages = [
  {
    name: "FOUNDATION",
    label: "Programming Foundations & Logic",
    code: `class ProgrammingFoundations {
  constructor() {
    this.languages = ["C", "Java"];
    this.competencies = [
      "Algorithmic Thinking",
      "Control Flow & Loops",
      "Problem Solving Techniques"
    ];
    this.status = "COMPILED";
  }
}`,
    desc: "Built base mathematical logic, learned structured algorithmic programming via C/Java, and compiled base problem-solving workflows."
  },
  {
    name: "CORE_CS",
    label: "Computer Science Core",
    code: `class ComputerScienceCore {
  constructor() {
    this.keySubjects = [
      "Data Structures & Algorithms",
      "Database Management Systems",
      "Operating Systems"
    ];
    this.skills = [
      "Memory Management",
      "ACID Transactions & Indexing",
      "Process Scheduling & IPC"
    ];
  }
}`,
    desc: "Mastered fundamental structures (Trees, Graphs, Queues), studied ACID properties, database normalization/indexing, and kernel scheduling."
  },
  {
    name: "FRONTEND",
    label: "Frontend Systems & UI Engineering",
    code: `class FrontendEngineering {
  constructor() {
    this.techStack = ["React.js", "Next.js", "TypeScript"];
    this.styling = ["Tailwind CSS", "Framer Motion", "Shadcn UI"];
    this.focus = [
      "State Management (Zustand)",
      "Server-Side Rendering (SSR)",
      "Responsive Fluid Layouts"
    ];
  }
}`,
    desc: "Engineered responsive and performant user interfaces, built global state flows, and optimized SEO and client-side rendering capabilities."
  },
  {
    name: "BACKEND",
    label: "Backend Architecture & Service Logic",
    code: `class BackendArchitecture {
  constructor() {
    this.runtimes = ["Node.js", "Express.js"];
    this.apis = ["RESTful APIs", "JWT Authentication", "Web Scraping"];
    this.focus = [
      "Scalable API Routing",
      "Database Integrations (Mongo/SQL)",
      "Latency & Query Optimization"
    ];
  }
}`,
    desc: "Designed high-throughput REST APIs, structured routing logic, secured routes via JSON Web Tokens, and parsed data streams."
  },
  {
    name: "CLOUDSYS",
    label: "Cloud Infrastructures & Scale",
    code: `class CloudAndScale {
  constructor() {
    this.cloudPlatform = ["Google Cloud Platform (GCP)", "BigQuery"];
    this.paradigms = ["Distributed Systems", "Microservices"];
    this.focus = [
      "Cloud Deployment & Routing",
      "Container Virtualization",
      "Data Warehouse Analytics"
    ];
  }
}`,
    desc: "Deployed microservices, studied distributed consensus models, and managed large-scale analytical datasets on Google Cloud Platform."
  }
]


const timelineMilestones = [
  {
    year: "2023",
    title: "Academic Beginnings",
    subtitle: "Bannari Amman Institute of Tech",
    description: "Started B.E. CSE, building core programming logic via C and Java.",
    type: "EDU",
    badge: "CSE Major"
  },
  {
    year: "2024",
    title: "Software Engineer Intern",
    subtitle: "Crayon'd (Sep 24 – Apr 25)",
    description: "Developed client products with responsive React and Express APIs.",
    type: "EXP",
    badge: "Internship"
  },
  {
    year: "2024",
    title: "Launched BITLINKS",
    subtitle: "Community Network Platform",
    description: "Designed a community networking platform for students.",
    type: "PROJECT",
    badge: "Next.js"
  },
  {
    year: "2025",
    title: "Software Engineer",
    subtitle: "EQREV (Jan 25 – Dec 25)",
    description: "Engineered quick-commerce SaaS dashboards for Zepto, Blinkit & Instamart.",
    type: "EXP",
    badge: "SaaS Engine"
  },
  {
    year: "2025",
    title: "Sakthi Hackathon Finalist",
    subtitle: "24h National Level Hackathon",
    description: "Designed systems under 24-hr constraints with exceptional problem solving.",
    type: "AWARD",
    badge: "Finalist"
  },
  {
    year: "2026",
    title: "Frontend Developer",
    subtitle: "Thinkuni (Sep 25 – Jan 26)",
    description: "Built Vue.js learning analytics and interactive dashboards.",
    type: "EXP",
    badge: "Interactive UI"
  }
]

export function SectionCompiler({ section }: { section: TechSection }) {
  const [activeStage, setActiveStage] = useState(0)
  const [hoveredMilestone, setHoveredMilestone] = useState<number | null>(null)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  return (
    <div ref={ref} className="mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
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
        <div className="flex-1 pb-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">{section.subtitle}</span>
          </div>
          <h2 className="mt-2 font-pixel-line text-3xl font-bold text-foreground md:text-5xl">
            {section.title}
          </h2>
          <p className="mt-4 max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground">{section.description}</p>
        </div>
      </motion.div>

      {/* IDE-like panel */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6, delay: 0.15 }}
        className="overflow-hidden border border-border"
        style={{ boxShadow: shadow }}
      >
        {/* CSS Keyframes for infinite marquee */}
        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 8px)); }
          }
        `}</style>

        <div className="flex flex-col w-full">
          {/* Top Section: Academic Details + Learnings Tabs */}
          <div className="flex flex-col w-full">
            {/* College & CGPA Details Header */}
            <div className="border-b border-border bg-secondary/20 p-4 font-mono text-xs flex flex-col sm:flex-row justify-between gap-3 items-start sm:items-center">
              <div>
                <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Institution</span>
                <span className="font-bold text-foreground text-xs sm:text-sm">Bannari Amman Institute of Technology</span>
              </div>
              <div className="flex gap-4 flex-wrap">
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Major</span>
                  <span className="font-bold text-foreground">CSE</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">Overall CGPA</span>
                  <span className="font-bold text-foreground text-xs sm:text-sm">8.2 / 10.0</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[9px] uppercase tracking-wider">12th Grade</span>
                  <span className="font-bold text-foreground text-xs sm:text-sm">92.38%</span>
                </div>
              </div>
            </div>

            {/* Tab bar */}
            <div className="flex overflow-x-auto border-b border-border bg-background">
              {learningStages.map((stage, i) => (
                <button
                  key={stage.name}
                  onClick={() => setActiveStage(i)}
                  className={`flex items-center gap-2 border-r border-border px-4 py-3 font-mono text-xs transition-colors duration-200 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none ${
                    activeStage === i
                      ? "bg-foreground text-background"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  <span className="text-[9px] opacity-60">{String(i + 1).padStart(2, "0")}</span>
                  <span className="whitespace-nowrap">{stage.name}</span>
                </button>
              ))}
            </div>

            {/* Code pane */}
            <div className="border-b border-border flex flex-col bg-background">
              <div className="flex items-center justify-between border-b border-border px-4 py-2 bg-secondary/10">
                <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
                  {learningStages[activeStage]?.label}
                </span>
                <span className="font-mono text-[10px] text-muted-foreground">
                  Stage {activeStage + 1}/{learningStages.length}
                </span>
              </div>
              
              <div className="flex-col lg:grid lg:grid-rows-3 min-h-[300px]">
                {/* Editor code area */}
                <motion.div
                  key={activeStage}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="p-6 font-mono text-[11px] leading-relaxed text-foreground/95 lg:row-span-2 overflow-auto"
                >
                  <pre className="flex">
                    {/* Line numbers */}
                    <span className="select-none text-muted-foreground/30 mr-4 text-right">
                      {learningStages[activeStage].code.split("\n").map((_, idx) => (
                        <span key={idx} className="block w-4">{idx + 1}</span>
                      ))}
                    </span>
                    <code>{learningStages[activeStage].code}</code>
                  </pre>
                </motion.div>

                {/* Explanation area */}
                <div className="border-t border-border p-4 bg-secondary/5 flex flex-col gap-2 font-mono text-xs justify-end lg:row-span-1">
                  <div className="flex items-center gap-1.5 text-muted-foreground text-[10px] uppercase tracking-wider">
                    <span className="inline-block h-1 w-1 bg-foreground" />
                    <span>Learning Insights</span>
                  </div>
                  <p className="text-muted-foreground leading-relaxed text-[11px]">
                    {learningStages[activeStage].desc}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Section: Developer Story Timeline as Infinite Horizontal Scroll */}
          <div className="p-6 bg-secondary/10 flex flex-col gap-4 overflow-hidden w-full">
            <div className="flex items-center justify-between border-b border-border pb-3 mb-2">
              <div className="flex items-center gap-2">
                <div className="h-1.5 w-1.5 bg-foreground animate-pulse" />
                <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-foreground">Developer Story</span>
              </div>
              <span className="font-mono text-[9px] text-muted-foreground/60">// INFINITE TIMELINE STREAM (HOVER TO PAUSE)</span>
            </div>

            {/* Scrolling Row */}
            <div className="relative w-full overflow-hidden select-none py-2">
              {/* Fade filters */}
              <div className="absolute inset-y-0 left-0 w-8 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none" />
              <div className="absolute inset-y-0 right-0 w-8 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none" />

              <div 
                className="flex gap-4 w-max animate-[marquee_45s_linear_infinite] hover:[animation-play-state:paused]"
                style={{
                  display: "flex",
                  gap: "16px",
                  width: "max-content",
                }}
              >
                {/* First Set */}
                {timelineMilestones.map((milestone, idx) => (
                  <div
                    key={`m1-${idx}`}
                    className="w-[280px] shrink-0 border border-border/60 bg-background/60 text-foreground p-4 rounded-sm hover:border-foreground transition-all duration-300 relative"
                  >
                    <div className="flex items-center justify-between mb-1.5 font-mono text-[9px]">
                      <span className="font-bold px-1.5 py-0.5 rounded-sm bg-secondary/80 text-muted-foreground">{milestone.year}</span>
                      <span className="uppercase tracking-wider font-bold text-muted-foreground/80">[{milestone.type}]</span>
                    </div>

                    <h4 className="font-bold text-xs font-mono">{milestone.title}</h4>
                    <p className="text-[10px] font-mono font-medium text-muted-foreground mt-0.5">{milestone.subtitle}</p>
                    
                    <p className="mt-2 text-[10px] font-mono leading-relaxed text-muted-foreground/90">
                      {milestone.description}
                    </p>
                  </div>
                ))}
                {/* Duplicated Set for Seamless Loop */}
                {timelineMilestones.map((milestone, idx) => (
                  <div
                    key={`m2-${idx}`}
                    className="w-[280px] shrink-0 border border-border/60 bg-background/60 text-foreground p-4 rounded-sm hover:border-foreground transition-all duration-300 relative"
                  >
                    <div className="flex items-center justify-between mb-1.5 font-mono text-[9px]">
                      <span className="font-bold px-1.5 py-0.5 rounded-sm bg-secondary/80 text-muted-foreground">{milestone.year}</span>
                      <span className="uppercase tracking-wider font-bold text-muted-foreground/80">[{milestone.type}]</span>
                    </div>

                    <h4 className="font-bold text-xs font-mono">{milestone.title}</h4>
                    <p className="text-[10px] font-mono font-medium text-muted-foreground mt-0.5">{milestone.subtitle}</p>
                    
                    <p className="mt-2 text-[10px] font-mono leading-relaxed text-muted-foreground/90">
                      {milestone.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
