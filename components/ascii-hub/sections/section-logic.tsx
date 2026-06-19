"use client"

import { motion, useInView } from "framer-motion"
import { useRef, useState, useEffect } from "react"
import type { TechSection } from "@/lib/sections-data"

const shadow = "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px, rgba(42, 51, 69, 0.04) 0px 1px 1px -0.5px, rgba(42, 51, 70, 0.04) 0px 3px 3px -1.5px, rgba(42, 51, 70, 0.04) 0px 6px 6px -3px, rgba(14, 63, 126, 0.04) 0px 12px 12px -6px, rgba(14, 63, 126, 0.04) 0px 24px 24px -12px"

/*
  SECTION 06: LOGIC SYNTHESIS
  Style: Blueprint / schematic. Grid paper background.
  Interactive truth table where you can toggle inputs.
  Gate diagram rendered with CSS.
  Totally different feel: structured, precise, engineering-drawing look.
*/



interface ContributionDay {
  date: string
  count: number
  level: number
  color: string
}

function ContributionHeatmap() {
  const [days, setDays] = useState<ContributionDay[]>([])
  const [loading, setLoading] = useState(true)
  const [totalYear, setTotalYear] = useState<Record<string, number>>({})
  const [repoCount, setRepoCount] = useState<number | null>(null)
  const [followers, setFollowers] = useState<number | null>(null)

  useEffect(() => {
    // Fetch contributions
    fetch("https://github-contributions-api.jogruber.de/v4/thayanithi15-git")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.contributions) {
          // Sort contributions chronologically since the API groups by years in descending order
          const sorted = data.contributions.sort(
            (a: any, b: any) => a.date.localeCompare(b.date)
          )
          const todayStr = new Date().toISOString().split("T")[0] // e.g. "2026-06-18"
          const pastContributions = sorted.filter((day: any) => day.date <= todayStr)
          const lastYear = pastContributions.slice(-364) // Get last 52 weeks (364 days) up to today
          setDays(lastYear)
          setTotalYear(data.total || {})
        }
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error fetching contributions:", err)
        setLoading(false)
      })

    // Fetch user details from GitHub REST API
    fetch("https://api.github.com/users/thayanithi15-git")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          if (data.public_repos !== undefined) setRepoCount(data.public_repos)
          if (data.followers !== undefined) setFollowers(data.followers)
        }
      })
      .catch((err) => console.error("Error fetching github user details:", err))
  }, [])

  const getMockContributions = () => {
    const startDate = new Date()
    startDate.setDate(startDate.getDate() - 363) // 364 days ago
    
    return Array.from({ length: 364 }).map((_, idx) => {
      const currentDate = new Date(startDate.getTime() + idx * 24 * 60 * 60 * 1000)
      
      const yyyy = currentDate.getFullYear()
      const mm = String(currentDate.getMonth() + 1).padStart(2, '0')
      const dd = String(currentDate.getDate()).padStart(2, '0')
      
      const row = idx % 7
      const col = Math.floor(idx / 7)
      const count = Math.max(0, Math.floor(Math.sin((row + col) * 0.5) * 2 + Math.cos(col * 0.8) * 2 + 2))
      const level = count > 4 ? 4 : count
      const colors = ["#161b22", "#0e4429", "#006d32", "#26a641", "#39d353"] // Dark mode theme
      
      return {
        date: `${yyyy}-${mm}-${dd}`,
        count,
        level,
        color: colors[level]
      }
    })
  }

  const displayedDays = days.length > 0 ? days : getMockContributions()

  // Safe helper to extract month index without Timezone/Date parsing anomalies
  const getMonthFromDateStr = (dateStr: string) => {
    const parts = dateStr.split("-")
    if (parts.length < 2) return 0
    return parseInt(parts[1], 10) - 1 // 0-indexed month
  }

  // Generate 52 column labels for months
  const monthLabels = Array.from({ length: 52 }).map((_, weekIdx) => {
    const dayIdx = weekIdx * 7
    if (dayIdx >= displayedDays.length) return ""
    
    const dateStr = displayedDays[dayIdx].date
    const currentMonthIdx = getMonthFromDateStr(dateStr)
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[currentMonthIdx] || ""
    
    if (weekIdx === 0) return month
    
    const prevDayIdx = (weekIdx - 1) * 7
    const prevDateStr = displayedDays[prevDayIdx].date
    const prevMonthIdx = getMonthFromDateStr(prevDateStr)
    
    if (currentMonthIdx !== prevMonthIdx) {
      return month
    }
    return ""
  })

  // Calculate sum of contributions over the last 364 days
  const totalInPeriod = displayedDays.reduce((acc, curr) => acc + curr.count, 0)

  return (
    <div className="border border-border p-6" style={{ boxShadow: shadow }}>
      {/* Title bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-border pb-4 mb-4 gap-4">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 bg-foreground animate-pulse" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground font-bold">
            GitHub Contributions — github.com/thayanithi15-git
          </span>
        </div>
        <div className="font-mono text-[9px] text-muted-foreground/60">// LIVE STREAM MATRIX</div>
      </div>

      <div className="flex flex-col gap-6">
        {/* Heatmap Grid Section */}
        <div className="overflow-x-auto w-full py-2 bg-secondary/5 border border-border/40 p-4">
          <div className="w-max mx-auto font-sans">
            {/* Month Header Row */}
            <div className="grid grid-cols-[36px_repeat(52,_minmax(12px,_1fr))] gap-1 mb-1 text-[9px] text-muted-foreground/70 select-none">
              <div /> {/* spacing offset for weekdays label column */}
              {monthLabels.map((label, idx) => (
                <div key={idx} className="w-3 text-left">
                  {label}
                </div>
              ))}
            </div>

            {/* Grid with Weekdays list next to it */}
            <div className="flex gap-2">
              <div className="flex flex-col justify-between py-1 text-[9px] text-muted-foreground/70 select-none w-7 text-right pr-1 font-mono">
                <div>&nbsp;</div>
                <div>Mon</div>
                <div>&nbsp;</div>
                <div>Wed</div>
                <div>&nbsp;</div>
                <div>Fri</div>
                <div>&nbsp;</div>
              </div>

              {/* Heatmap cells */}
              <div className="grid grid-rows-7 grid-flow-col gap-1 w-max">
                {displayedDays.map((day, idx) => {
                  // Map shades robustly using the contribution level (0 to 4)
                  // Level 0/count 0 represents no contributions (same bg as container empty cells)
                  let cellColor = "#161b22";
                  if (day.count > 0) {
                    if (day.level === 1) cellColor = "#0e4429";
                    else if (day.level === 2) cellColor = "#006d32";
                    else if (day.level === 3) cellColor = "#26a641";
                    else if (day.level === 4) cellColor = "#39d353";
                    else cellColor = day.color || "#0e4429"; // Fallback
                  }

                  return (
                    <motion.div
                      key={day.date + idx}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: (idx % 7 + Math.floor(idx / 7)) * 0.001 }}
                      className="w-3 h-3 rounded-sm cursor-pointer hover:ring-1 hover:ring-foreground transition-all"
                      style={{ backgroundColor: cellColor }}
                      title={`${day.date}: ${day.count} contributions`}
                    />
                  )
                })}
              </div>
            </div>

            {/* Bottom info: count details links & Less/More scale */}
            <div className="flex items-center justify-between mt-3 text-[10px] text-muted-foreground/80 px-1 font-mono">
              <a 
                href="https://docs.github.com/en/account-and-profile/setting-up-and-managing-your-github-profile/managing-contribution-settings-on-your-profile/why-are-my-contributions-not-showing-up-on-my-profile"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline hover:text-foreground transition-all duration-200"
              >
                Learn how we count contributions
              </a>
              <div className="flex items-center gap-1.5 select-none">
                <span>Less</span>
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#161b22" }} />
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#0e4429" }} />
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#006d32" }} />
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#26a641" }} />
                <div className="h-3 w-3 rounded-sm" style={{ backgroundColor: "#39d353" }} />
                <span>More</span>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs w-full">
          {/* Card 1: Contributions */}
          <div className="border border-border/60 p-4 bg-secondary/5 flex flex-col justify-between" style={{ boxShadow: shadow }}>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Total Activity</span>
              <h4 className="text-2xl font-bold text-foreground mt-2">{totalInPeriod.toLocaleString()}+</h4>
              <p className="text-[10px] text-muted-foreground mt-1">Contributions in the last year</p>
            </div>
            <div className="border-t border-border/40 pt-3 mt-4 flex justify-between text-[10px] text-muted-foreground">
              <span>2025: {totalYear["2025"] || "1,656"}</span>
              <span>2026: {totalYear["2026"] || "200"}</span>
            </div>
          </div>

          {/* Card 2: Repositories */}
          <div className="border border-border/60 p-4 bg-secondary/5 flex flex-col justify-between" style={{ boxShadow: shadow }}>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Repositories</span>
              <h4 className="text-2xl font-bold text-foreground mt-2">{repoCount !== null ? repoCount : "22"}+</h4>
              <p className="text-[10px] text-muted-foreground mt-1">Active developer repositories</p>
            </div>
            <div className="border-t border-border/40 pt-3 mt-4 flex justify-between text-[10px] text-muted-foreground">
              <span>Open Source: 100%</span>
              <span>Followers: {followers !== null ? followers : "18"}</span>
            </div>
          </div>

          {/* Card 3: Pull Requests */}
          <div className="border border-border/60 p-4 bg-secondary/5 flex flex-col justify-between" style={{ boxShadow: shadow }}>
            <div>
              <span className="text-[9px] uppercase tracking-wider text-muted-foreground">Pull Requests & Commits</span>
              <h4 className="text-2xl font-bold text-foreground mt-2">84+ PRs</h4>
              <p className="text-[10px] text-muted-foreground mt-1">SaaS & feature merges completed</p>
            </div>
            <div className="border-t border-border/40 pt-3 mt-4 flex justify-between text-[10px] text-muted-foreground">
              <span>Avg response: &lt;2 hrs</span>
              <span>Status: Active SDE</span>
            </div>
          </div>
        </div>

        {/* New Animated GitHub Telemetry Monitor */}
        <GithubPulseMonitor 
          displayedDays={displayedDays} 
          totalInPeriod={totalInPeriod} 
          repoCount={repoCount} 
          followers={followers} 
        />
      </div>
    </div>
  )
}

interface GithubPulseMonitorProps {
  displayedDays: ContributionDay[]
  totalInPeriod: number
  repoCount: number | null
  followers: number | null
}

function GithubPulseMonitor({ displayedDays, totalInPeriod, repoCount, followers }: GithubPulseMonitorProps) {
  const [terminalLogs, setTerminalLogs] = useState<string[]>([])
  const [scanIndex, setScanIndex] = useState(0)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  
  // Group 364 days into 52 weeks
  const weeksData: number[] = []
  for (let i = 0; i < displayedDays.length; i += 7) {
    const week = displayedDays.slice(i, i + 7)
    const sum = week.reduce((acc, curr) => acc + curr.count, 0)
    weeksData.push(sum)
  }
  
  const maxVal = Math.max(...weeksData, 1)
  
  // Helper to extract month and year of a given week index
  const getWeekDetails = (idx: number) => {
    const startDay = displayedDays[idx * 7]
    if (!startDay) return { month: "", year: "" }
    
    const parts = startDay.date.split("-")
    if (parts.length < 3) return { month: "", year: "" }
    
    const year = parts[0]
    const monthIdx = parseInt(parts[1], 10) - 1
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
    const month = monthNames[monthIdx] || ""
    
    return { month, year }
  }
  
  // Calculate SVG dimensions
  const svgWidth = 600
  const svgHeight = 120
  const paddingX = 20
  const paddingY = 15
  
  const points = weeksData.map((val, idx) => {
    const x = paddingX + (idx / (weeksData.length - 1)) * (svgWidth - paddingX * 2)
    const y = svgHeight - paddingY - (val / maxVal) * (svgHeight - paddingY * 2)
    return { x, y, val }
  })
  
  const pathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x} ${p.y}`).join(' ')
  
  // Simulated telemetry sequence
  useEffect(() => {
    const templates = [
      `[sys] established telemetry link to github.com/thayanithi15-git...`,
      `[query] compiled ${displayedDays.length} days of activity data`,
      `[metrics] payload verified: total_contributions=${totalInPeriod}`,
      `[metrics] query complete: active_repos=${repoCount ?? 22} followers=${followers ?? 18}`,
      `[logic] computed high-density contribution wave vector`,
      `[telemetry] latency check: 42ms (connection status: OPTIMAL)`,
      `[security] gpg signature verification: PASS`,
      `[event] git push origin dev --status=clean`,
      `[sys] memory stack allocation stable: dev-cluster-1`,
    ]
    
    setTerminalLogs([templates[0]])
    
    let logIdx = 1
    const interval = setInterval(() => {
      setTerminalLogs(prev => {
        const next = [...prev, templates[logIdx % templates.length]]
        if (next.length > 5) next.shift() // Keep only last 5 lines
        return next
      })
      logIdx++
    }, 3200)
    
    return () => clearInterval(interval)
  }, [displayedDays.length, totalInPeriod, repoCount, followers])

  // Track scanning index
  useEffect(() => {
    const interval = setInterval(() => {
      setScanIndex(prev => (prev + 1) % weeksData.length)
    }, 110)
    return () => clearInterval(interval)
  }, [weeksData.length])

  return (
    <div className="border border-border/60 p-5 bg-secondary/5 mt-2 flex flex-col gap-4 font-mono text-xs w-full" style={{ boxShadow: shadow }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border/40 pb-2">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-ping" />
          <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground font-bold">
            Real-time GitHub Activity Spectrum
          </span>
        </div>
        <span className="text-[8px] text-muted-foreground/60">// CORE ENGINEERING PULSE</span>
      </div>

      {/* SVG Oscilloscope Graph */}
      <div className="relative border border-border/40 p-2 bg-background/50 overflow-hidden rounded-sm select-none">
        {/* Background Grids */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)`,
            backgroundSize: '20px 20px'
          }} />
        </div>

        {/* Scanline Sweep */}
        <motion.div 
          className="absolute top-0 bottom-0 w-[2px] bg-emerald-500/80 shadow-[0_0_8px_#10b981] pointer-events-none"
          animate={{ x: ["-2%", "102%"] }}
          transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
        />

        {/* Hover Tooltip Info Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div 
            className="absolute bg-background/95 border border-emerald-500/70 p-2 font-mono text-[9px] text-emerald-400 pointer-events-none rounded-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.5)] z-20 flex flex-col gap-0.5"
            style={{
              left: `${(points[hoveredIndex].x / svgWidth) * 100}%`,
              top: `${(points[hoveredIndex].y / svgHeight) * 100 - 20}%`,
              transform: 'translate(-50%, -100%)',
              transition: 'left 0.1s ease-out, top 0.1s ease-out'
            }}
          >
            <div className="font-bold border-b border-emerald-500/30 pb-0.5 mb-1 text-[8px] uppercase tracking-widest text-neutral-300">
              {getWeekDetails(hoveredIndex).month} {getWeekDetails(hoveredIndex).year} | WK {(hoveredIndex + 1).toString().padStart(2, '0')}
            </div>
            <div className="flex items-center gap-1.5">
              <span className="h-1 w-1 bg-emerald-500 rounded-full" />
              <span>ACTV: <span className="font-bold text-white">{weeksData[hoveredIndex]}</span> CONTRIBS</span>
            </div>
            <div className="flex items-center gap-1.5 text-[8px] text-neutral-400">
              <span className="h-1 w-1 bg-neutral-600 rounded-full" />
              <span>DENSITY: {((weeksData[hoveredIndex] / maxVal) * 100).toFixed(0)}% MAX</span>
            </div>
          </div>
        )}

        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-32 text-foreground">
          <defs>
            <linearGradient id="cyan-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#0e4429" />
              <stop offset="50%" stopColor="#26a641" />
              <stop offset="100%" stopColor="#39d353" />
            </linearGradient>
          </defs>

          {/* Dotted threshold lines */}
          <line x1={paddingX} y1={svgHeight / 2} x2={svgWidth - paddingX} y2={svgHeight / 2} stroke="currentColor" strokeWidth="1" strokeDasharray="3 6" className="opacity-25" />
          <line x1={paddingX} y1={svgHeight / 4} x2={svgWidth - paddingX} y2={svgHeight / 4} stroke="currentColor" strokeWidth="1" strokeDasharray="1 9" className="opacity-15" />
          <line x1={paddingX} y1={(svgHeight * 3) / 4} x2={svgWidth - paddingX} y2={(svgHeight * 3) / 4} stroke="currentColor" strokeWidth="1" strokeDasharray="1 9" className="opacity-15" />

          {/* Vertical Guide Line on Hover */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <line
              x1={points[hoveredIndex].x}
              y1={paddingY}
              x2={points[hoveredIndex].x}
              y2={svgHeight - paddingY}
              stroke="rgba(16, 185, 129, 0.4)"
              strokeWidth="1.5"
              strokeDasharray="2 3"
            />
          )}

          {/* Activity curve */}
          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#cyan-glow)"
            strokeWidth="2"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          />

          {/* Glow effect blur duplicate */}
          <path
            d={pathD}
            fill="none"
            stroke="#26a641"
            strokeWidth="4"
            className="opacity-20 blur-[2px]"
          />

          {/* Glowing peaks/nodes */}
          {points.map((p, idx) => {
            const isScanning = Math.abs(idx - scanIndex) < 3
            if (p.val === 0) return null
            return (
              <circle
                key={idx}
                cx={p.x}
                cy={p.y}
                r={isScanning ? 4.5 : 2}
                className={`${isScanning ? 'fill-emerald-400 stroke-white stroke-1' : 'fill-emerald-600/80'} transition-all duration-150`}
              />
            )
          })}

          {/* Glowing marker dot at hovered index */}
          {hoveredIndex !== null && points[hoveredIndex] && (
            <g>
              <circle
                cx={points[hoveredIndex].x}
                cy={points[hoveredIndex].y}
                r={6.5}
                className="fill-emerald-400/30 stroke-emerald-400 stroke-[1.5px] animate-ping"
              />
              <circle
                cx={points[hoveredIndex].x}
                cy={points[hoveredIndex].y}
                r={4}
                className="fill-white stroke-emerald-500 stroke-[2px]"
              />
            </g>
          )}

          {/* Transparent hit boxes for mouse interactions */}
          {points.map((p, idx) => {
            const triggerWidth = (svgWidth - paddingX * 2) / (weeksData.length - 1)
            return (
              <rect
                key={`trigger-${idx}`}
                x={p.x - triggerWidth / 2}
                y={0}
                width={triggerWidth}
                height={svgHeight}
                fill="transparent"
                className="cursor-crosshair pointer-events-all"
                onMouseEnter={() => setHoveredIndex(idx)}
                onMouseLeave={() => setHoveredIndex(null)}
              />
            )
          })}
        </svg>

        {/* HUD Overlay text */}
        <div className="absolute top-2 left-3 flex gap-4 text-[8px] font-bold tracking-widest text-emerald-500/80 uppercase">
          <div>CH_1: STABLE_ACTV</div>
          <div>SWEEP: 52_WKS</div>
          <div>GAIN: {(maxVal/10).toFixed(1)}x</div>
        </div>

        <div className="absolute bottom-2 right-3 text-[8px] text-muted-foreground/60 font-mono">
          SCAN Wk: {(scanIndex + 1).toString().padStart(2, '0')} / 52 | VALUE: {weeksData[scanIndex] || 0}
        </div>
      </div>

      {/* Terminal Live telemetry log stream */}
      <div className="border border-border/40 bg-[#090b0d] p-3 rounded-sm font-mono text-[10px] min-h-[110px] flex flex-col gap-1 justify-end shadow-inner">
        {terminalLogs.map((log, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.15 }}
            className="flex items-center gap-1.5 select-none"
          >
            <span className="text-emerald-500 font-bold select-none">&gt;</span>
            <span className={log.includes('[sys]') ? 'text-sky-400' : log.includes('[metrics]') ? 'text-emerald-400' : 'text-neutral-400'}>
              {log}
            </span>
          </motion.div>
        ))}
        <div className="flex items-center gap-1">
          <span className="text-emerald-500 font-bold">&gt;</span>
          <span className="w-1.5 h-3 bg-emerald-400 animate-pulse" />
        </div>
      </div>
    </div>
  )
}

export function SectionLogic({ section }: { section: TechSection }) {
  return (
    <div className="relative mx-auto max-w-7xl px-4 py-20 lg:px-8 lg:py-32">
      {/* Blueprint grid background */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.03]" aria-hidden="true">
        <div
          className="h-full w-full"
          style={{
            backgroundImage: `
              linear-gradient(currentColor 1px, transparent 1px),
              linear-gradient(90deg, currentColor 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      {/* Header with ghost number and blueprint stamp look */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative mb-12 flex items-start gap-6"
      >
        <span className="font-pixel-line text-7xl font-bold leading-none text-foreground/[0.08] md:text-9xl">
          {section.number}
        </span>
        <div className="flex-1 pt-2">
          <div className="inline-block py-2">
            <span className="font-mono text-xs text-muted-foreground">{section.subtitle}</span>
            <h2 className="font-pixel-line text-3xl font-bold text-foreground md:text-5xl">{section.title}</h2>
          </div>
          <p className="mt-6 max-w-2xl font-mono text-xs leading-relaxed text-muted-foreground">{section.description}</p>
        </div>
      </motion.div>

      <div className="flex flex-col gap-6 w-full">
        {/* GitHub Contributions Heatmap & Stats (Full Width) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.15 }}
          className="w-full"
        >
          <ContributionHeatmap />
        </motion.div>
      </div>
    </div>
  )
}
