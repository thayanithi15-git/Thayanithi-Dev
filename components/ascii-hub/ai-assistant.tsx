"use client"

import { useState, useRef, useEffect } from "react"
import { motion } from "framer-motion"

import { askAssistant } from "@/app/assistant/actions"

interface ChatMessage {
  sender: "user" | "system"
  text: string
}

interface QueryRecord {
  query: string
  timestamp: number
}

const REST_DURATION_MS = 2 * 60 * 1000 // 2 minutes (120,000 ms)
const TWO_MINUTES_MS = 2 * 60 * 1000
const MAX_DUPLICATE_COUNT = 2 // More than 2 times means attempt 3+ triggers 2-min rest
const MAX_QUERIES_IN_2_MIN = 5 // Asking continuously (5 queries in 2 mins) triggers rest

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "system", text: "AI Portfolio Assistant initialized. Systems online." },
    { sender: "system", text: "How can I help you explore Thayanithi's profile?" }
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cooldownUntil, setCooldownUntil] = useState<number | null>(null)
  const [cooldownSeconds, setCooldownSeconds] = useState<number>(0)
  const [queryHistory, setQueryHistory] = useState<QueryRecord[]>([])

  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Restore active cooldown and query history from localStorage on mount
  useEffect(() => {
    try {
      const storedUntil = localStorage.getItem("portfolio_ai_cooldown_until")
      if (storedUntil) {
        const until = parseInt(storedUntil, 10)
        if (until > Date.now()) {
          setCooldownUntil(until)
          setCooldownSeconds(Math.ceil((until - Date.now()) / 1000))
        } else {
          localStorage.removeItem("portfolio_ai_cooldown_until")
        }
      }

      const storedHistory = localStorage.getItem("portfolio_ai_query_history")
      if (storedHistory) {
        setQueryHistory(JSON.parse(storedHistory))
      }
    } catch (e) {
      console.error("Failed to restore AI assistant rate limit state:", e)
    }
  }, [])

  // Live countdown timer interval
  useEffect(() => {
    if (!cooldownUntil) {
      setCooldownSeconds(0)
      return
    }

    const updateTimer = () => {
      const remaining = Math.ceil((cooldownUntil - Date.now()) / 1000)
      if (remaining <= 0) {
        setCooldownUntil(null)
        setCooldownSeconds(0)
        try {
          localStorage.removeItem("portfolio_ai_cooldown_until")
        } catch (e) {}
      } else {
        setCooldownSeconds(remaining)
      }
    }

    updateTimer()
    const interval = setInterval(updateTimer, 1000)
    return () => clearInterval(interval)
  }, [cooldownUntil])

  // Scroll chat window to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isProcessing, cooldownSeconds])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const suggestions = [
    "Tell me about BITLINKS",
    "What technologies does Thayanithi know?",
    "Tell me about PROGRESS IQ",
    "Where is Thayanithi located?"
  ]

  const getAIResponse = (query: string): string => {
    const q = query.toLowerCase()
    if (q.includes("bitlinks")) {
      return "BITLINKS is a modern College Community Networking Platform engineered with Next.js, Framer Motion, TypeScript, and Vercel. It is built to facilitate real-time resource sharing, student group collaborations, and streamlined campus communications."
    }
    if (q.includes("technology") || q.includes("technologies") || q.includes("know") || q.includes("stack") || q.includes("skills")) {
      return "Thayanithi's core tech stack includes: Frontend & UI (React.js, Next.js, Vue.js, Tailwind CSS, Framer Motion, Zustand), Mobile (React Native, Flutter), Backend & API (Node.js, Express.js, JWT, RESTful architectures), Databases (MongoDB, PostgreSQL, MySQL), and Cloud (Google Cloud Platform, BigQuery)."
    }
    if (q.includes("progress iq") || q.includes("progressiq")) {
      return "PROGRESS IQ is a real-time monitoring and team analytics platform. It features Socket.io live synchronization, role-based access control, AI-driven insights to measure productivity, and a centralized workspace for administrators, mentors, and students."
    }
    if (q.includes("location") || q.includes("located") || q.includes("where") || q.includes("live")) {
      return "Thayanithi is based in Namakkal, Tamil Nadu, India."
    }
    if (q.includes("eqrev") || q.includes("eq rev")) {
      return "EQREV is a quick-commerce SaaS analytics dashboard engineered with React.js, Chart.js, Recharts, Hero UI, and Zustand. It provides pin code-level brand scaling insights for Zepto, Blinkit, and Instamart."
    }
    if (q.includes("cnc")) {
      return "CNC VAULT is an industrial CNC machinery control hub built with Next.js, TypeScript, Express.io, MongoDB, and GCP, providing secure access to machine programs and PLC logic configuration."
    }
    return "Query parsed. Thayanithi S is a Software Development & Infra Engineer specializing in Fullstack, Mobile App engineering, and Cloud-native architectures. If you have specific inquiries, feel free to email thayanithi2006s@gmail.com."
  }

  const triggerCooldown = (until: number, reason: string) => {
    setCooldownUntil(until)
    const initialRemaining = Math.ceil((until - Date.now()) / 1000)
    setCooldownSeconds(initialRemaining)
    try {
      localStorage.setItem("portfolio_ai_cooldown_until", until.toString())
    } catch (e) {}

    setMessages((prev) => [
      ...prev,
      {
        sender: "system",
        text: `[RATE LIMIT TRIGGERED] ${reason} System agent is taking a 2-minute cooling break (${formatTime(
          initialRemaining
        )}). Please wait before querying again.`
      }
    ])
  }

  const checkRateLimit = (newQuery: string): boolean => {
    const now = Date.now()
    const normalized = newQuery.trim().toLowerCase()

    // Filter queries within the last 2 minutes
    const recentQueries = queryHistory.filter((q) => now - q.timestamp <= TWO_MINUTES_MS)

    // 1. Check duplicate count for the same question
    const sameQuestionCount = recentQueries.filter((q) => q.query === normalized).length

    // Asking the same question more than 2 times (attempt 3+) triggers 2-min rest
    if (sameQuestionCount >= MAX_DUPLICATE_COUNT) {
      const until = now + REST_DURATION_MS
      triggerCooldown(until, "You have asked the same question more than 2 times.")
      return true
    }

    // 2. Check continuous rapid queries over 2 minutes
    if (recentQueries.length >= MAX_QUERIES_IN_2_MIN - 1) {
      const until = now + REST_DURATION_MS
      triggerCooldown(until, "Continuous queries detected over a 2-minute window.")
      return true
    }

    // Record this query in history
    const updatedHistory = [...recentQueries, { query: normalized, timestamp: now }]
    setQueryHistory(updatedHistory)
    try {
      localStorage.setItem("portfolio_ai_query_history", JSON.stringify(updatedHistory))
    } catch (e) {}

    return false
  }

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isProcessing || cooldownSeconds > 0) return

    // Evaluate rate limits
    const isRateLimited = checkRateLimit(textToSend)
    if (isRateLimited) {
      setInput("")
      return
    }

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }])
    setInput("")
    setIsProcessing(true)

    try {
      // Call primary assistant server action
      const reply = await askAssistant(textToSend)
      if (reply) {
        setMessages((prev) => [...prev, { sender: "system", text: reply.trim() }])
      } else {
        // Fallback to local response
        const localReply = getAIResponse(textToSend)
        setMessages((prev) => [...prev, { sender: "system", text: localReply }])
      }
    } catch (err) {
      console.error("Assistant action failed:", err)
      const localReply = getAIResponse(textToSend)
      setMessages((prev) => [...prev, { sender: "system", text: localReply }])
    } finally {
      setIsProcessing(false)
    }
  }

  const isLocked = isProcessing || cooldownSeconds > 0

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-7xl px-4 py-12 lg:px-8 lg:py-16"
    >
      <div className="mb-6 flex flex-col gap-3">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm text-muted-foreground">{"//"}</span>
          <div className="h-[1px] w-12 bg-border" />
          <span className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
            Copilot Core
          </span>
        </div>
        <h2 className="font-pixel-line text-3xl font-bold tracking-tight text-foreground md:text-5xl">
          AI Portfolio Assistant
        </h2>
        <p className="max-w-prose font-mono text-xs leading-relaxed text-muted-foreground">
          Query the local system agent for insights on projects, certifications, stack competencies, and background details.
        </p>
      </div>

      <div className="border border-border bg-secondary/5 font-mono" style={{ boxShadow: "rgba(14, 63, 126, 0.04) 0px 0px 0px 1px" }}>
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-border bg-secondary/15 px-4 py-2.5">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                cooldownSeconds > 0 ? "bg-amber-500 animate-ping" : "bg-green-500 animate-pulse"
              }`}
            />
            <span className="text-[10px] uppercase font-bold text-foreground tracking-wider">
              System Agent Interface v1.0.0
            </span>
          </div>
          <span
            className={`text-[8px] font-bold ${
              cooldownSeconds > 0 ? "text-amber-400 animate-pulse" : "text-muted-foreground/50"
            }`}
          >
            {cooldownSeconds > 0
              ? `// STATE: COOLING DOWN (${formatTime(cooldownSeconds)})`
              : "// STATE: OPERATIONAL"}
          </span>
        </div>

        {/* Chat History Panel */}
        <div ref={chatContainerRef} className="h-64 overflow-y-auto p-4 space-y-3 bg-background/40 flex flex-col">
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex flex-col max-w-[85%] text-xs ${
                msg.sender === "user" ? "self-end items-end" : "self-start items-start"
              }`}
            >
              <span className="text-[8px] text-muted-foreground/60 mb-0.5 uppercase tracking-wider">
                {msg.sender === "user" ? "visitor_user" : "system_agent"}
              </span>
              <div
                className={`p-2.5 rounded-sm border ${
                  msg.sender === "user"
                    ? "bg-foreground text-background border-foreground"
                    : msg.text.startsWith("[RATE LIMIT TRIGGERED]")
                    ? "bg-amber-500/10 text-amber-300 border-amber-500/40"
                    : "bg-secondary/20 text-muted-foreground border-border/60"
                }`}
              >
                {msg.text}
              </div>
            </motion.div>
          ))}

          {isProcessing && (
            <div className="self-start items-start flex flex-col">
              <span className="text-[8px] text-muted-foreground/60 mb-0.5 uppercase tracking-wider">system_agent</span>
              <div className="p-2.5 rounded-sm border bg-secondary/10 border-border/40 text-muted-foreground text-xs flex items-center gap-1">
                <span>Thinking</span>
                <span className="animate-pulse">...</span>
              </div>
            </div>
          )}
        </div>

        {/* Suggestion list */}
        <div className="border-t border-border/40 bg-secondary/5 px-4 py-3">
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-2 font-bold">
            Suggested Inquiries:
          </span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSend(sug)}
                disabled={isLocked}
                className="text-[9px] px-2 py-1 border border-border/60 text-muted-foreground bg-background/50 hover:border-foreground hover:text-foreground hover:bg-secondary/10 transition-all duration-150 rounded-sm cursor-pointer disabled:opacity-50"
              >
                {sug}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="border-t border-border bg-secondary/10 p-3 flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend(input)
            }}
            placeholder={
              cooldownSeconds > 0
                ? `System resting... available in ${formatTime(cooldownSeconds)}`
                : "Ask a question about Thayanithi's profile..."
            }
            disabled={isLocked}
            className="flex-1 bg-background border border-border/60 rounded-sm px-3 py-1.5 text-xs text-foreground focus:border-foreground focus:outline-none placeholder-muted-foreground/40 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isLocked || !input.trim()}
            className="border border-foreground bg-foreground text-background text-xs font-bold px-4 py-1.5 hover:bg-transparent hover:text-foreground transition-colors duration-200 cursor-pointer disabled:opacity-50 rounded-sm"
          >
            {cooldownSeconds > 0 ? `RESTING (${formatTime(cooldownSeconds)})` : "EXECUTE"}
          </button>
        </div>
      </div>
    </motion.section>
  )
}
