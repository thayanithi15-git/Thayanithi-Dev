"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

import { askGemini } from "@/app/assistant/actions"

interface ChatMessage {
  sender: "user" | "system"
  text: string
}

export function AIAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { sender: "system", text: "AI Portfolio Assistant initialized. Systems online." },
    { sender: "system", text: "How can I help you explore Thayanithi's profile?" }
  ])
  const [input, setInput] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages, isProcessing])

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
    return "Query parsed. Thayanithi S is a Software Development Engineer specializing in Fullstack, Mobile App engineering, and Cloud-native architectures. If you have specific inquiries, feel free to email thayanithi2006s@gmail.com."
  }

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isProcessing) return

    setMessages((prev) => [...prev, { sender: "user", text: textToSend }])
    setInput("")
    setIsProcessing(true)

    try {
      // Try calling Gemini first
      const reply = await askGemini(textToSend)
      if (reply) {
        setMessages((prev) => [...prev, { sender: "system", text: reply.trim() }])
      } else {
        // Fallback to local mock response
        const localReply = getAIResponse(textToSend)
        setMessages((prev) => [...prev, { sender: "system", text: localReply }])
      }
    } catch (err) {
      console.error("Gemini action failed:", err)
      const localReply = getAIResponse(textToSend)
      setMessages((prev) => [...prev, { sender: "system", text: localReply }])
    } finally {
      setIsProcessing(false)
    }
  }

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
            <span className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase font-bold text-foreground tracking-wider">
              System Agent Interface v1.0.0
            </span>
          </div>
          <span className="text-[8px] text-muted-foreground/50">// STATE: OPERATIONAL</span>
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
          <span className="text-[9px] uppercase tracking-wider text-muted-foreground block mb-2 font-bold">Suggested Inquiries:</span>
          <div className="flex flex-wrap gap-2">
            {suggestions.map((sug) => (
              <button
                key={sug}
                onClick={() => handleSend(sug)}
                disabled={isProcessing}
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
            placeholder="Ask a question about Thayanithi's profile..."
            disabled={isProcessing}
            className="flex-1 bg-background border border-border/60 rounded-sm px-3 py-1.5 text-xs text-foreground focus:border-foreground focus:outline-none placeholder-muted-foreground/40 disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={isProcessing || !input.trim()}
            className="border border-foreground bg-foreground text-background text-xs font-bold px-4 py-1.5 hover:bg-transparent hover:text-foreground transition-colors duration-200 cursor-pointer disabled:opacity-50 rounded-sm"
          >
            EXECUTE
          </button>
        </div>
      </div>
    </motion.section>
  )
}
