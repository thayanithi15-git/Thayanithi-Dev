"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowUp, Bot } from "lucide-react"
import Link from "next/link"

export function FloatingControls() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 300) {
        setIsVisible(true)
      } else {
        setIsVisible(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="fixed bottom-6 right-6 z-50 flex flex-col gap-3.5 font-mono"
        >
          {/* AI Assistant Button */}
          <Link
            href="/assistant"
            className="flex items-center justify-center w-12 h-12 border border-green-500/40 bg-background/95 text-green-500 rounded-full shadow-lg backdrop-blur transition-all duration-200 hover:bg-green-600 hover:text-white hover:border-green-600 hover:scale-110 cursor-pointer"
            title="Launch AI Assistant"
          >
            <Bot size={20} className="animate-pulse" />
          </Link>

          {/* Scroll to Top Button */}
          <button
            onClick={scrollToTop}
            className="flex items-center justify-center w-12 h-12 border border-border bg-background/95 text-muted-foreground rounded-full shadow-lg backdrop-blur transition-all duration-200 hover:bg-foreground hover:text-background hover:border-foreground hover:scale-110 cursor-pointer"
            aria-label="Scroll to top"
            title="Scroll to Top"
          >
            <ArrowUp size={20} />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
