"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Github, Twitter, Linkedin, ArrowUp } from "lucide-react"
import Link from "next/link"

const ASCII_LOGO = `
 ████████╗███████╗
 ╚══██╔══╝██╔════╝
    ██║   ███████╗
    ██║   ╚════██║
    ██║   ███████║
    ╚═╝   ╚══════╝`

const socialLinks = [
  { name: "GitHub", icon: Github, href: "https://github.com/thayanithi15-git" },
  { name: "LinkedIn", icon: Linkedin, href: "https://www.linkedin.com/in/thayanithi15" },
  { name: "Twitter / X", icon: Twitter, href: "https://x.com/Thayanithi887" },
  { name: "Instagram", icon: Github, href: "https://www.instagram.com/thayanithi_15" },
]

export function Footer() {
  const [totalViews, setTotalViews] = useState<number | null>(null)

  useEffect(() => {
    let isTracked = false
    if (!isTracked) {
      const storedName = typeof window !== "undefined" ? localStorage.getItem("portfolio_visitor_name") || "Anonymous" : "Anonymous"

      fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          referrer: typeof document !== "undefined" ? document.referrer : "Direct",
          name: storedName,
          path: typeof window !== "undefined" ? window.location.pathname : "/"
        })
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.success && typeof data.totalViews === "number") {
            setTotalViews(data.totalViews)
          }
        })
        .catch((err) => console.error("Error logging view:", err))
      isTracked = true
    }
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="border-t border-border">
      <div className="mx-auto max-w-7xl px-4 py-16 lg:px-8 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-3">
          {/* ASCII Logo & Quote */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <pre
              className="font-mono text-[8px] leading-[10px] text-foreground/40 md:text-[10px] md:leading-[12px]"
              aria-label="Monochrome Hub ASCII logo"
              role="img"
            >
              {ASCII_LOGO}
            </pre>
            <div className="mt-4 font-mono text-xs leading-relaxed text-muted-foreground">
              <p className="italic">"The best way to predict the future is to create it."</p>
              <p className="mt-1 font-bold text-foreground flex text-end w-full flex items-end justify-end mr-20">- Peter Drucker</p>
              <p className="mt-3 text-[11px]">Fueled by ∞ cups of coffee & passion for code</p>
            </div>
          </motion.div>

          {/* Social Grid & Contact */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
              Connect & Contact
            </span>
            <div className="mb-4 font-mono text-xs text-muted-foreground">
              <p>Namakkal, Tamil Nadu, India</p>
              <p className="mt-1"><a href="mailto:thayanithi2006s@gmail.com" className="hover:text-foreground">thayanithi2006s@gmail.com</a></p>
            </div>
            <div className="flex flex-col gap-2">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-3 py-2 font-mono text-sm text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none"
                >
                  <link.icon size={14} />
                  <span>{link.name}</span>
                  <span className="ml-auto opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                    {"->"}
                  </span>
                </a>
              ))}
            </div>
          </motion.div>

          {/* Meta & Back to top */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col justify-between"
          >
            <div>
              <span className="mb-4 block font-mono text-xs uppercase tracking-widest text-muted-foreground">
                Domain Stack
              </span>
              <div className="flex flex-wrap gap-2">
                {["Next.js", "React Native", "Node.js", "Express.io", "MongoDB", "GCP", "Tailwind"].map(
                  (tech) => (
                    <span
                      key={tech}
                      className="border border-border px-2 py-1 font-mono text-[10px] text-muted-foreground"
                    >
                      {tech}
                    </span>
                  )
                )}
              </div>
            </div>

            <button
              onClick={scrollToTop}
              className="mt-8 flex items-center gap-2 self-start font-mono text-xs text-muted-foreground transition-all duration-200 hover:text-foreground focus-visible:ring-2 focus-visible:ring-foreground focus-visible:outline-none lg:self-end"
              aria-label="Back to top"
            >
              <ArrowUp size={12} />
              <span>BACK TO TOP</span>
            </button>
          </motion.div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 sm:flex-row">
          <span className="font-mono text-[10px] text-muted-foreground">
            {"// "} Thayanithi S &mdash; {new Date().getFullYear()}
          </span>
          <div className="flex gap-6 items-center flex-wrap justify-center">
            <Link
              href="/stats"
              className="font-mono text-[10px] text-blue-400 hover:text-blue-300 hover:underline transition-all duration-200 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer focus:outline-none border border-blue-900/50 bg-blue-950/20 px-2 py-1 rounded"
              title="View Portfolio Analytics"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
              Stats: {totalViews !== null ? `${totalViews} Views` : "Loading..."}
            </Link>
            <Link
              href="/assistant"
              className="font-mono text-[10px] text-foreground hover:underline transition-all duration-200 uppercase tracking-wider flex items-center gap-1.5 cursor-pointer focus:outline-none"
              title="Launch AI Assistant"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              AI Assistant
            </Link>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent("trigger-shutdown"))}
              className="font-mono text-[10px] text-red-500 hover:text-red-400 hover:underline transition-all duration-200 uppercase tracking-wider cursor-pointer flex items-center gap-1.5 focus:outline-none"
              title="Shutdown System"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
              shutdown -h now
            </button>
          </div>
          <span className="font-mono text-[10px] text-muted-foreground">
            Built with Next.js, Typescript, and Node.js.
          </span>
        </div>
      </div>
    </footer>
  )
}
