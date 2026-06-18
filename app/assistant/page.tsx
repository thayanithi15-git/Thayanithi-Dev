"use client"

import { AIAssistant } from "@/components/ascii-hub/ai-assistant"
import { Navigation } from "@/components/ascii-hub/navigation"
import { Footer } from "@/components/ascii-hub/footer"
import Link from "next/link"

export default function AssistantPage() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <Link 
            href="/"
            className="font-mono text-xs text-muted-foreground hover:text-foreground hover:underline transition-all duration-200 mb-6 inline-flex items-center gap-1.5 cursor-pointer"
          >
            {"<-"} RETURN TO HUB SYSTEM
          </Link>
          <AIAssistant />
        </div>
      </main>

      <Footer />
    </div>
  )
}
