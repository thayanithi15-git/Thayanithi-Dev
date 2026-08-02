"use client"

import { useState, useRef, useEffect, type KeyboardEvent } from "react"
import { motion } from "framer-motion"

const COMMANDS: Record<string, string[]> = {
  help: [
    "Available commands:",
    "  help       - Show this message",
    "  whoami     - Brief SDE bio",
    "  about      - Profile summary of Thayanithi S",
    "  education  - College, CGPA & academic details",
    "  stack      - Show core technology stack",
    "  experience - List work history milestones",
    "  projects   - Show list of featured projects",
    "  contact    - Email, location & get in touch",
    "  social     - Social handles and web profiles",
    "  system     - Inspect terminal OS specifications",
    "  clear      - Clear terminal",
  ],
  whoami: [
    "Thayanithi S",
    "--------------------------------------------------",
    "Systems & Logic Engineer. Fueled by coffee & passion for raw code.",
    "Active domains: Fullstack, Mobile Apps, Backend Architecture",
    "Status: OPERATIONAL | Location: Tamil Nadu, India",
  ],
  about: [
    "Thayanithi S - SDE & Infra Engineer",
    "Specializing in Fullstack web platforms, cross-platform mobile apps,",
    "and robust database architectures. Deeply focused on translation of",
    "logical workflows into high-performance product designs.",
  ],
  education: [
    "Bannari Amman Institute of Technology (2023 - 2027)",
    "--------------------------------------------------",
    "Degree:      B.E. Computer Science and Engineering",
    "CGPA:        8.2 / 10.0",
    "HSC (12th):  92.38%",
  ],
  stack: [
    "Languages:   TypeScript, JavaScript, C, Java, Python",
    "Frontend:    Next.js, React.js, Vue.js, Tailwind CSS, Framer Motion",
    "Mobile:      React Native, Flutter",
    "Backend:     Node.js, Express.js, Fastify, REST APIs, JWT Auth",
    "Databases:   MongoDB, PostgreSQL, MySQL, Prisma, Sequelize",
    "Cloud:       Google Cloud (GCP), BigQuery",
    "Dev Tools:   Git, GitHub, VS Code, Postman, Web Scraping",
  ],
  experience: [
    "Software Engineer at EQREV       - Jan 2025 – Dec 2025 (SaaS & Q-Comm)",
    "Software Engineer at Crayon'd     - Sep 2024 – Apr 2025 (React & Express APIs)",
    "Software Engineer at Thinkuni      - Sept 2025 – Jan 2026 (Vue Learning Dashboards)",
  ],
  projects: [
    "EQ REV    - Quick Commerce Analytics (https://app.eqrev.com/)",
    "CNC Vault - Secure Control Hub (https://cnc-machines.vercel.app/)",
    "Bitlinks  - College Community Network (https://bitlinks.bitsathy.ac.in/)",
    "Dev Rank  - Developer Ranking Platform (http://dev-rank.vercel.app/)",
  ],
  contact: [
    "Reach out via standard systems channels:",
    "  Email:      thayanithi2006s@gmail.com",
    "  Location:   Namakkal, Tamil Nadu, India",
  ],
  social: [
    "Web Profiles & Registries:",
    "  GitHub:     https://github.com/thayanithi15-git",
    "  LinkedIn:   https://linkedin.com/in/thayanithi15",
  ],
  system: [
    "Host OS:     monochrome-kernel v1.0.0-x86_64",
    "Uptime:      34120.45s",
    "Shell:       mono-sh v1.0",
    "Memory:      1.24 GB / 8.00 GB (Active Allocation)",
    "API Latency: 42ms (Operational)",
  ],
}

interface TerminalLine {
  type: "input" | "output" | "v0"
  content: string
}

export function PseudoTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: "output", content: 'Welcome to Monochrome Hub Terminal v1.0.0' },
    { type: "output", content: 'Type "help" for available commands.' },
    { type: "output", content: "" },
  ])
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const processCommand = (cmd: string) => {
    const trimmed = cmd.trim().toLowerCase()
    const baseLines: TerminalLine[] = [
      ...lines,
      { type: "input", content: `$ ${cmd}` },
    ]

    if (trimmed === "clear") {
      setLines([])
      setInput("")
      return
    }

    if (trimmed === "v0") {
      setLines([...baseLines, { type: "output", content: "" }])
      setInput("")
      const v0Lines = COMMANDS["v0"]
      if (v0Lines) {
        v0Lines.forEach((line, i) => {
          setTimeout(() => {
            setLines((prev) => [...prev, { type: "v0", content: line }])
          }, i * 80)
        })
      } else {
        setLines((prev) => [...prev, { type: "output", content: "v0 command offline." }])
      }
      return
    }

    const newLines: TerminalLine[] = [...baseLines]
    const response = COMMANDS[trimmed]
    if (response) {
      response.forEach((line) => {
        newLines.push({ type: "output", content: line })
      })
    } else if (trimmed === "") {
      // do nothing
    } else {
      newLines.push({ type: "output", content: `command not found: ${trimmed}` })
      newLines.push({ type: "output", content: 'Type "help" for available commands.' })
    }

    newLines.push({ type: "output", content: "" })
    setLines(newLines)
    setInput("")
  }

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      processCommand(input)
    }
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24"
    >
      <div className="mb-8 flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground">{">"}</span>
          <div className="h-[1px] w-12 bg-border" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Interactive
          </span>
        </div>
        <h2 className="font-pixel-line text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          Terminal
        </h2>
        <p className="max-w-prose font-mono text-sm leading-relaxed text-muted-foreground">
          Explore the system. Type commands to interact with the ASCII Hub.
        </p>
      </div>

      <div
        className="border border-border"
        onClick={() => inputRef.current?.focus()}
        role="application"
        aria-label="Interactive pseudo-terminal"
      >
        {/* Terminal header */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-2.5">
          <div className="h-2.5 w-2.5 bg-foreground" />
          <div className="h-2.5 w-2.5 bg-muted-foreground/50" />
          <div className="h-2.5 w-2.5 bg-muted-foreground/30" />
          <span className="ml-2 font-mono text-xs text-muted-foreground">
            monochrome-hub ~ interactive
          </span>
        </div>

        {/* Terminal body */}
        <div
          ref={scrollRef}
          className="h-80 overflow-y-auto bg-secondary/20 p-4"
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={`font-mono text-xs leading-relaxed break-all whitespace-pre-wrap max-w-full overflow-hidden ${
                line.type === "input"
                  ? "text-foreground"
                  : line.type === "v0"
                  ? "text-foreground brightness-125"
                  : "text-muted-foreground"
              }`}
            >
              {line.content || "\u00A0"}
            </div>
          ))}

          {/* Input line */}
          <div className="relative flex items-center font-mono text-xs text-foreground">
            <span className="mr-1">{"$"}</span>
            <span>{input}</span>
            <span className="animate-blink">{"█"}</span>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="absolute inset-0 h-full w-full cursor-default border-none bg-transparent opacity-0 outline-none"
              aria-label="Terminal input"
              autoComplete="off"
              autoCorrect="off"
              spellCheck={false}
            />
          </div>
        </div>
      </div>
    </motion.section>
  )
}
