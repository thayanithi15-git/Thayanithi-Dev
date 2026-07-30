"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navigation } from "@/components/ascii-hub/navigation"
import { Footer } from "@/components/ascii-hub/footer"
import { FloatingControls } from "@/components/ascii-hub/floating-controls"
import { Terminal, Home, RefreshCw } from "lucide-react"

interface TerminalLine {
  type: "system" | "error" | "success" | "info"
  text: string
}

export default function NotFound() {
  const [lines, setLines] = useState<TerminalLine[]>([])
  const [isScanning, setIsScanning] = useState(false)
  const [currentPath, setCurrentPath] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentPath(window.location.pathname)
    }

    const sequence: { delay: number; line: TerminalLine }[] = [
      { delay: 200, line: { type: "system", text: "SYSTEM BOOT: v1.0.0-x86_64" } },
      { delay: 500, line: { type: "info", text: `Scanning memory address space for node...` } },
      { delay: 1000, line: { type: "error", text: "ERROR: 404 - SECTOR_NOT_FOUND" } },
      { delay: 1300, line: { type: "error", text: "Address resolution failed. Target node is unregistered." } },
      { delay: 1700, line: { type: "system", text: "--------------------------------------------------" } },
      { delay: 2000, line: { type: "info", text: "Host OS: monochrome-kernel v1.0.0" } },
      { delay: 2200, line: { type: "success", text: "Recommendation: Execute command 'cd /' or run diagnostics." } },
    ]

    sequence.forEach(({ delay, line }) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line])
      }, delay)
    })
  }, [])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [lines])

  const runDiagnostics = () => {
    if (isScanning) return
    setIsScanning(true)
    setLines((prev) => [
      ...prev,
      { type: "system", text: "" },
      { type: "info", text: "$ run diagnostics --verbose" },
    ])

    const steps = [
      { text: "Initializing deep system probe...", type: "system" as const },
      { text: "Checking memory registers... OK", type: "success" as const },
      { text: "Verifying router and gateway nodes... OK", type: "success" as const },
      { text: "Scanning database cluster connection... OK", type: "success" as const },
      { text: "Locating caffeine reserves... [WARNING: Reserves low]", type: "info" as const },
      { text: "Diagnostic Result: Core infrastructure is 100% operational.", type: "success" as const },
      { text: "Conclusion: Only the requested path does not exist.", type: "info" as const },
    ]

    steps.forEach((step, index) => {
      setTimeout(() => {
        setLines((prev) => [...prev, { type: step.type, text: step.text }])
        if (index === steps.length - 1) {
          setIsScanning(false)
        }
      }, (index + 1) * 600)
    })
  }

  const asciiArt = `
██╗  ██╗ ██████╗ ██╗  ██╗
██║  ██║██╔═████╗██║  ██║
███████║██║██╔██║███████║
╚════██║████╔╝██║╚════██║
     ██║╚██████╔╝     ██║
     ╚═╝ ╚═════╝      ╚═╝
  `

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col font-mono">
      <Navigation />

      <main className="flex-grow flex items-center justify-center px-4 py-12 md:py-24">
        <div className="max-w-3xl w-full flex flex-col gap-8">
          
          {/* Header/Glitch effect */}
          <div className="text-center flex flex-col items-center">
            <motion.pre 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-foreground text-xs md:text-sm font-bold leading-none select-none overflow-x-auto max-w-full font-mono whitespace-pre text-left md:text-center"
            >
              {asciiArt}
            </motion.pre>
            <motion.h1 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 text-xl md:text-2xl font-bold tracking-tight text-foreground font-pixel-line uppercase"
            >
              Sector Not Found
            </motion.h1>
            <p className="text-xs text-muted-foreground mt-2 max-w-md">
              The sector at <code className="bg-secondary/40 px-1.5 py-0.5 border border-border text-foreground">{currentPath || "/invalid-path"}</code> could not be located in this directory.
            </p>
          </div>

          {/* Terminal Diagnostics Panel */}
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="border border-border rounded-none shadow-md overflow-hidden bg-background"
          >
            {/* Terminal Header */}
            <div className="flex items-center justify-between border-b border-border bg-muted/20 px-4 py-2">
              <div className="flex items-center gap-1.5">
                <div className="h-2 w-2 rounded-full bg-destructive-foreground" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                <div className="h-2 w-2 rounded-full bg-muted-foreground/10" />
              </div>
              <span className="text-[10px] text-muted-foreground tracking-widest uppercase">
                404_DIAGNOSTICS.SH
              </span>
              <Terminal size={12} className="text-muted-foreground" />
            </div>

            {/* Terminal Logs */}
            <div 
              ref={scrollRef}
              className="h-64 md:h-72 overflow-y-auto p-4 flex flex-col gap-1.5 bg-secondary/10 select-text scrollbar-thin"
            >
              {lines.map((line, idx) => (
                <div 
                  key={idx} 
                  className={`text-xs md:text-sm leading-relaxed ${
                    line.type === "error" 
                      ? "text-destructive-foreground font-semibold" 
                      : line.type === "success" 
                      ? "text-foreground font-bold brightness-125" 
                      : line.type === "info" 
                      ? "text-muted-foreground" 
                      : "text-foreground opacity-90"
                  }`}
                >
                  {line.text}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-xs md:text-sm text-foreground">
                <span className="animate-pulse">█</span>
              </div>
            </div>
          </motion.div>

          {/* Interactive Actions */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link 
              href="/"
              className="w-full sm:w-auto px-6 py-2.5 bg-foreground text-background font-mono text-xs uppercase tracking-wider font-semibold border border-foreground hover:bg-background hover:text-foreground transition-all duration-200 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
            >
              <Home size={14} />
              Return to Base (Home)
            </Link>
            
            <button
              onClick={runDiagnostics}
              disabled={isScanning}
              className={`w-full sm:w-auto px-6 py-2.5 bg-transparent text-foreground border border-border font-mono text-xs uppercase tracking-wider font-semibold hover:bg-foreground hover:text-background hover:border-foreground transition-all duration-200 flex items-center justify-center gap-2 focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none ${
                isScanning ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              <RefreshCw size={14} className={isScanning ? "animate-spin" : ""} />
              {isScanning ? "Scanning..." : "Run Diagnostics"}
            </button>
          </div>

        </div>
      </main>

      <Footer />
      <FloatingControls />
    </div>
  )
}
