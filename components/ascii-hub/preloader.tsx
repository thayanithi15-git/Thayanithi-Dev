"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0)
  const [logs, setLogs] = useState<string[]>([])
  
  const diagnosticScript = [
    { threshold: 0, text: "INIT SYSTEM BOOT STRAP..." },
    { threshold: 12, text: "[ OK ] LOADED KERNEL SYSTEM MODULES" },
    { threshold: 28, text: "[ OK ] SYNCED DISTRIBUTED TENURE LEDGER" },
    { threshold: 45, text: "[ OK ] SYNTHESIZED LOGIC API ROUTERS" },
    { threshold: 60, text: "[ OK ] GRAPHICS PIPELINES STABILIZED" },
    { threshold: 75, text: "[ OK ] PARALLEL THREAD HYDRATION COMPLETE" },
    { threshold: 90, text: "[ OK ] SECURING ACCESS CONTROL LAYERS" },
    { threshold: 98, text: "BOOT SUCCESSFUL. READY FOR DEPLOYMENT." }
  ]

  useEffect(() => {
    const duration = 2200 // 2.2 seconds total load
    const intervalTime = 40
    const step = 100 / (duration / intervalTime)

    const timer = setInterval(() => {
      setProgress((prev) => {
        const next = Math.min(100, prev + step)
        if (next === 100) {
          clearInterval(timer)
          setTimeout(onComplete, 400) // Call onComplete slightly after hitting 100%
        }
        return next
      })
    }, intervalTime)

    return () => clearInterval(timer)
  }, [onComplete])

  useEffect(() => {
    // Add logs dynamically as progress passes thresholds
    diagnosticScript.forEach((log) => {
      if (progress >= log.threshold && !logs.includes(log.text)) {
        setLogs((prev) => [...prev, log.text])
      }
    })
  }, [progress, logs])

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ 
        opacity: 0, 
        y: -120,
        transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] } 
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#090b0d] text-foreground font-mono px-4 select-none"
    >
      {/* Scanline overlay */}
      <div className="animate-scanline pointer-events-none absolute inset-0 z-10 h-[2px] w-full bg-foreground/5" />

      {/* Grid Overlay background */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
        backgroundImage: `linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)`,
        backgroundSize: '30px 30px'
      }} />

      <div className="relative z-20 flex flex-col items-start w-full max-w-lg gap-6">
        {/* Large Retro ASCII Logo - Spells THAYANITHI S */}
        <pre className="text-[5px] sm:text-[7px] md:text-[8px] lg:text-[9px] leading-[6px] sm:leading-[8px] md:leading-[9px] text-foreground font-bold w-full select-none text-center">
{`████████╗██╗  ██╗ █████╗ ██╗   ██╗ █████╗ ███╗   ██╗██╗████████╗██╗  ██╗██╗     ███████╗
╚══██╔══╝██║  ██║██╔══██╗╚██╗ ██╔╝██╔══██╗████╗  ██║██║╚══██╔══╝██║  ██║██║     ██╔════╝
   ██║   ███████║███████║ ╚████╔╝ ███████║██╔██╗ ██║██║   ██║   ███████║██║     ███████╗
   ██║   ██╔══██║██╔══██║  ╚██╔╝  ██╔══██║██║╚██╗██║██║   ██║   ██╔══██║██║     ╚════██║
   ██║   ██║  ██║██║  ██║   ██║   ██║  ██║██║ ╚████║██║   ██║   ██║  ██║██║     ███████║
   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝   ╚═╝   ╚═╝  ╚═╝╚═╝     ╚══════╝`}
        </pre>

        {/* Boot Terminal Logs Box */}
        <div className="w-full border border-border/80 bg-[#0d0f12]/95 p-4 min-h-[160px] flex flex-col justify-start gap-1 rounded-sm shadow-[0_0_24px_rgba(255,255,255,0.02)]">
          {logs.map((log, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.15 }}
              className="text-[9px] sm:text-[10px] text-neutral-300"
            >
              {log}
            </motion.div>
          ))}
          {progress < 100 && (
            <div className="flex items-center gap-1.5 text-[10px]">
              <span className="text-foreground font-bold select-none">&gt;</span>
              <span className="w-1.5 h-3 bg-foreground animate-pulse" />
            </div>
          )}
        </div>

        {/* Progress bar container */}
        <div className="w-full flex flex-col gap-2">
          <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold">
            <span>SYS_BOOT_PERCENT: {Math.round(progress)}%</span>
            <span>FREQ: 4.88 GHz</span>
          </div>
          <div className="h-4 w-full border border-border/80 bg-[#0d0f12] p-0.5 rounded-sm relative overflow-hidden">
            <motion.div
              className="h-full bg-foreground"
              style={{ width: `${progress}%` }}
              transition={{ ease: "easeOut" }}
            />
            {/* Horizontal progress indicators */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none mix-blend-difference font-mono text-[9px] text-white font-bold select-none">
              {progress < 100 ? "LOADING HARDWARE ABSTRACTION SYSTEMS" : "SYSTEM DEPLOYED"}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
