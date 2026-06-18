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
