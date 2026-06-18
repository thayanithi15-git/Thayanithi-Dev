"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"

export function ShutdownManager() {
  const [isShuttingDown, setIsShuttingDown] = useState(false)
  const [logs, setLogs] = useState<string[]>([])
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const handleShutdown = () => {
      setIsShuttingDown(true)
    }

    window.addEventListener("trigger-shutdown", handleShutdown)
    return () => {
      window.removeEventListener("trigger-shutdown", handleShutdown)
    }
  }, [])

  useEffect(() => {
    if (!isShuttingDown) return

    const shutdownLogs = [
      "[  OK  ] Stopped target Graphical Interface.",
      "[  OK  ] Stopped target Multi-User System.",
      "[  OK  ] Stopped target Login Service.",
      "[  OK  ] Stopped User Manager for UID 1000.",
      "[  OK  ] Stopped System Logging Service.",
      "[  OK  ] Stopped D-Bus System Message Bus.",
      "[  OK  ] Stopped WPA Supplicant.",
      "[  OK  ] Stopped Network Manager.",
      "[  OK  ] Stopped SSH Daemon.",
      "[  OK  ] Stopped target Network.",
      "[  OK  ] Stopped target Local File Systems.",
      "[  OK  ] Unmounted /run/user/1000.",
      "[  OK  ] Stopped target Swaps.",
      "[  OK  ] Stopped target Cryptography.",
      "[  OK  ] Reached target Unmount All Filesystems.",
      "[  OK  ] Stopped target Local File Systems (Pre).",
      "[  OK  ] Stopped Create Static Device Nodes in /dev.",
      "[  OK  ] Stopped Create System Users.",
      "[  OK  ] Stopped Remount Root and Kernel File Systems.",
      "[  OK  ] Reached target Shutdown.",
      "[  OK  ] Reached target Final Step.",
      "Sending SIGTERM to remaining processes...",
      "Sending SIGKILL to remaining processes...",
      "Unmounting file systems.",
      "Deactivating swaps.",
      "Powering off."
    ]

    let currentLine = 0
    const interval = setInterval(() => {
      if (currentLine < shutdownLogs.length) {
        setLogs((prev) => [...prev, shutdownLogs[currentLine]])
        currentLine++
      } else {
        clearInterval(interval)
        setIsFinished(true)
        // Try closing the tab
        setTimeout(() => {
          try {
            window.close()
          } catch (e) {
            console.error("Browser blocked window.close():", e)
          }
        }, 1000)
      }
    }, 120) // Print line every 120ms for systemd speed feel

    return () => clearInterval(interval)
  }, [isShuttingDown])

  if (!isShuttingDown) return null

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black text-green-500 font-mono text-xs md:text-sm p-4 overflow-y-auto select-none pointer-events-auto"
      >
        <div className="max-w-4xl mx-auto flex flex-col min-h-screen justify-end pb-8">
          <div className="space-y-1">
            {logs.map((log, idx) => {
              const isOk = log.startsWith("[  OK  ]")
              if (isOk) {
                return (
                  <div key={idx} className="flex gap-2">
                    <span className="text-green-500 font-bold shrink-0">[  OK  ]</span>
                    <span className="text-gray-300">{log.replace("[  OK  ]", "").trim()}</span>
                  </div>
                )
              }
              return (
                <div key={idx} className="text-red-400 font-bold">
                  {log}
                </div>
              )
            })}
            
            {isFinished && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-6 border-t border-green-900 pt-4 text-green-400"
              >
                <div className="font-bold uppercase tracking-widest animate-pulse">
                  *** SYSTEM HALTED ***
                </div>
                <div className="text-[10px] text-gray-500 mt-2">
                  (If the tab did not close automatically, you may close it manually.)
                </div>
                <div className="flex items-center gap-1 mt-4">
                  <span>sh-5.2#</span>
                  <span className="w-2 h-4 bg-green-500 animate-pulse inline-block" />
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  )
}
