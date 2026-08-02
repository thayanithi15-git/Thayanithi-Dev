"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navigation } from "@/components/ascii-hub/navigation"
import { Footer } from "@/components/ascii-hub/footer"
import { VisitorFilterBar } from "@/components/ascii-hub/visitor-filter-bar"
import { 
  ArrowLeft, 
  Tv, 
  Globe, 
  Compass, 
  Cpu, 
  Eye, 
  Calendar,
  User,
  Search,
  Filter,
  CheckCircle2,
  LogOut,
  RefreshCw,
  X,
  MapPin,
  Smartphone
} from "lucide-react"
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts"

declare global {
  interface Window {
    google?: any
  }
}

interface Visitor {
  id: string
  name: string
  email?: string
  picture?: string
  country: string
  city: string
  device: string
  timestamp: string
  path?: string
  registered?: boolean
}

interface StatsData {
  totalViews: number
  devices: { name: string; value: number }[]
  browsers: { name: string; value: number }[]
  os: { name: string; value: number }[]
  countries: { country: string; count: number }[]
  dailyViews: { date: string; count: number }[]
  recentVisitors: Visitor[]
  period: string
  pagination: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  filters: {
    locations: string[]
    devices: string[]
  }
}

const COLORS = [
  "var(--color-blue-500, #3b82f6)",
  "var(--color-emerald-500, #10b981)",
  "var(--color-amber-500, #f59e0b)",
  "var(--color-purple-500, #8b5cf6)",
  "var(--color-pink-500, #ec4899)"
]

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [registerStatus, setRegisterStatus] = useState<{ success?: boolean; message?: string } | null>(null)
  
  // Current user verified profile state
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; picture: string } | null>(null)

  // Footprint chart period tab state ('day' | 'week' | 'month' | 'year')
  const [selectedPeriod, setSelectedPeriod] = useState<"day" | "week" | "month" | "year">("day")

  // Visitor table filter states
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedLocation, setSelectedLocation] = useState("ALL")
  const [selectedDevice, setSelectedDevice] = useState("ALL")
  const [startDate, setStartDate] = useState("")
  const [endDate, setEndDate] = useState("")
  const [currentPage, setCurrentPage] = useState(1)

  const googleBtnRef = useRef<HTMLDivElement>(null)
  const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || "821719664741-m65tgj321g34020ocio31fi89dpvhlq5.apps.googleusercontent.com"

  // Fetch metrics from API based on period, search filters, and page
  const fetchStats = useCallback(async () => {
    try {
      setLoading(true)
      const params = new URLSearchParams()
      params.set("period", selectedPeriod)
      params.set("page", currentPage.toString())
      params.set("limit", "8")

      if (searchQuery.trim()) params.set("search", searchQuery.trim())
      if (selectedLocation && selectedLocation !== "ALL") params.set("location", selectedLocation)
      if (selectedDevice && selectedDevice !== "ALL") params.set("device", selectedDevice)
      if (startDate) params.set("startDate", startDate)
      if (endDate) params.set("endDate", endDate)

      const res = await fetch(`/api/views?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch analytics metrics")
      const stats = await res.json()
      setData(stats)
      setError(null)
    } catch (err: any) {
      setError(err.message || "Failed to load metrics")
    } finally {
      setLoading(false)
    }
  }, [selectedPeriod, searchQuery, selectedLocation, selectedDevice, startDate, endDate, currentPage])

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  // Check saved visitor credentials in local storage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("portfolio_user_name")
      const savedEmail = localStorage.getItem("portfolio_user_email")
      const savedPicture = localStorage.getItem("portfolio_user_picture")
      if (savedName && savedEmail) {
        setUserProfile({ name: savedName, email: savedEmail, picture: savedPicture || "" })
      }
    }
  }, [])

  // Handle Google Sign-In response
  const handleGoogleSignInResponse = useCallback(async (response: any) => {
    if (!response.credential) return
    setIsSubmitting(true)
    setRegisterStatus(null)

    try {
      const res = await fetch("/api/views/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          credential: response.credential,
          path: typeof window !== "undefined" ? window.location.pathname : "/stats"
        })
      })

      const resData = await res.json()

      if (res.ok && resData.success) {
        const profile = {
          name: resData.name,
          email: resData.email,
          picture: resData.picture || ""
        }
        setUserProfile(profile)
        if (typeof window !== "undefined") {
          localStorage.setItem("portfolio_user_name", resData.name)
          localStorage.setItem("portfolio_user_email", resData.email)
          localStorage.setItem("portfolio_user_picture", resData.picture || "")
        }
        setRegisterStatus({ success: true, message: "Footprint registered & verified with Google!" })
        fetchStats()
      } else {
        setRegisterStatus({ success: false, message: resData.error || "Google Sign-In registration failed." })
      }
    } catch (err: any) {
      setRegisterStatus({ success: false, message: err.message || "Registration error occurred." })
    } finally {
      setIsSubmitting(false)
    }
  }, [fetchStats])

  // Helper to trigger Google OAuth Popup window (works reliably on production domains)
  const triggerOAuthPopup = useCallback(() => {
    if (typeof window === "undefined") return
    const redirectUri = window.location.origin + window.location.pathname
    const nonce = Math.random().toString(36).substring(2)
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${encodeURIComponent(googleClientId)}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=id_token` +
      `&scope=${encodeURIComponent("openid email profile")}` +
      `&nonce=${nonce}` +
      `&prompt=select_account`

    const width = 500
    const height = 650
    const left = (window.innerWidth - width) / 2 + window.screenX
    const top = (window.innerHeight - height) / 2 + window.screenY

    window.open(
      authUrl,
      "GoogleSignInPopup",
      `width=${width},height=${height},top=${top},left=${left},scrollbars=yes,status=yes`
    )
  }, [googleClientId])

  const handleManualGoogleSignIn = useCallback(() => {
    if (typeof window === "undefined") return

    let promptTriggered = false
    if (window.google?.accounts?.id) {
      try {
        window.google.accounts.id.prompt((notification: any) => {
          if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log("Google GIS One Tap suppressed on production:", notification.getNotDisplayedReason?.() || notification.getSkippedReason?.())
            triggerOAuthPopup()
          }
        })
        promptTriggered = true
      } catch (err) {
        console.warn("Google GIS prompt warning:", err)
      }
    }

    if (!promptTriggered) {
      triggerOAuthPopup()
    }
  }, [triggerOAuthPopup])

  // Handle OAuth Popup hash / postMessage token response
  useEffect(() => {
    if (typeof window === "undefined") return

    // Check URL hash for id_token from OAuth popup redirect
    const hash = window.location.hash
    if (hash && hash.includes("id_token=")) {
      const params = new URLSearchParams(hash.substring(1))
      const idToken = params.get("id_token")

      if (idToken) {
        if (window.opener && window.opener !== window) {
          try {
            window.opener.postMessage({ type: "GOOGLE_ID_TOKEN", credential: idToken }, "*")
            window.close()
            return
          } catch (e) {
            console.error("Failed to postMessage to opener:", e)
          }
        }

        window.history.replaceState(null, "", window.location.pathname)
        handleGoogleSignInResponse({ credential: idToken })
      }
    }

    // Listen for postMessage from popup window
    const handleMessage = (event: MessageEvent) => {
      if (event.data && event.data.type === "GOOGLE_ID_TOKEN" && event.data.credential) {
        handleGoogleSignInResponse({ credential: event.data.credential })
      }
    }

    window.addEventListener("message", handleMessage)
    return () => window.removeEventListener("message", handleMessage)
  }, [handleGoogleSignInResponse])

  // Initialize Google Identity Services Script
  useEffect(() => {
    if (!googleClientId) return

    const loadGoogleScript = () => {
      if (typeof window === "undefined" || !window.google?.accounts?.id) return
      try {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSignInResponse,
          auto_select: false,
          cancel_on_tap_outside: true
        })

        if (googleBtnRef.current && !userProfile) {
          googleBtnRef.current.innerHTML = ""
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: "filled_dark",
            size: "large",
            type: "standard",
            shape: "rectangular",
            text: "continue_with",
            logo_alignment: "left",
            width: 260
          })
        }
      } catch (err) {
        console.error("Google GIS error:", err)
      }
    }

    if (typeof window !== "undefined" && window.google?.accounts?.id) {
      loadGoogleScript()
    } else if (typeof window !== "undefined") {
      const existingScript = document.getElementById("google-gsi-script")
      if (!existingScript) {
        const script = document.createElement("script")
        script.id = "google-gsi-script"
        script.src = "https://accounts.google.com/gsi/client"
        script.async = true
        script.defer = true
        script.onload = loadGoogleScript
        document.head.appendChild(script)
      } else {
        existingScript.addEventListener("load", loadGoogleScript)
        if (window.google?.accounts?.id) {
          loadGoogleScript()
        }
      }
    }
  }, [googleClientId, userProfile, handleGoogleSignInResponse, loading])

  const handleSignOut = () => {
    setUserProfile(null)
    setRegisterStatus(null)
    if (typeof window !== "undefined") {
      localStorage.removeItem("portfolio_user_name")
      localStorage.removeItem("portfolio_user_email")
      localStorage.removeItem("portfolio_user_picture")
    }
    // Re-render Google Sign-in button
    setTimeout(() => {
      if (typeof window !== "undefined" && window.google?.accounts?.id && googleBtnRef.current) {
        googleBtnRef.current.innerHTML = ""
        window.google.accounts.id.renderButton(googleBtnRef.current, {
          theme: "filled_dark",
          size: "large",
          type: "standard",
          shape: "rectangular",
          text: "continue_with",
          logo_alignment: "left",
          width: 260
        })
      }
    }, 100)
  }

  const resetFilters = () => {
    setSearchQuery("")
    setSelectedLocation("ALL")
    setSelectedDevice("ALL")
    setStartDate("")
    setEndDate("")
    setCurrentPage(1)
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between w-full max-w-full overflow-x-hidden">
      <Navigation />
      
      <main className="flex-1 py-12 w-full max-w-full overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8 font-mono w-full max-w-full overflow-x-hidden">
          
          {/* Back button & Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-6">
            <div className="space-y-1">
              <Link 
                href="/"
                className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors uppercase tracking-wider mb-2"
              >
                <ArrowLeft size={12} /> BACK TO CONSOLE
              </Link>
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight flex items-center gap-2.5">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping inline-block" />
                SYSTEM METRICS & ANALYTICS
              </h1>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Active connection to MongoDB Registry
              </p>
            </div>
            
            {/* Total Counter Badge */}
            <div className="border border-border bg-secondary/10 px-6 py-3 rounded flex items-center gap-4 sm:self-start">
              <div className="p-2 rounded bg-secondary text-foreground">
                <Eye size={20} />
              </div>
              <div>
                <p className="text-[10px] text-muted-foreground uppercase tracking-widest leading-none">Total Views</p>
                <p className="text-xl font-bold mt-1 leading-none">
                  {loading && !data ? "..." : data?.totalViews || 0}
                </p>
              </div>
            </div>
          </div>

          {/* Google Sign-In / Verified Footprint Registration Card */}
          <div className="border border-border bg-secondary/5 p-5 rounded space-y-3 w-full max-w-full overflow-hidden">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 w-full">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                    <User size={15} className="text-blue-500" /> Register Your Visit Name
                  </h3>
                  <span className="text-[9px] uppercase tracking-wider px-2 py-0.5 rounded border border-blue-500/40 text-blue-400 bg-blue-500/10 font-bold">
                    Optional
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Optional step: If you are interested, verify your footprint via Google Sign-In to display your name and profile picture in the database registry.
                </p>
              </div>

              {userProfile ? (
                /* Verified User Card */
                <div className="flex items-center gap-3 bg-secondary/20 border border-emerald-500/30 px-4 py-2.5 rounded w-full md:w-auto justify-between max-w-full overflow-hidden">
                  <div className="flex items-center gap-3 min-w-0 overflow-hidden">
                    {userProfile.picture ? (
                      <img 
                        src={userProfile.picture} 
                        alt={userProfile.name} 
                        className="w-9 h-9 rounded-full border border-border object-cover flex-shrink-0" 
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {userProfile.name.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="min-w-0 overflow-hidden">
                      <div className="flex items-center gap-1.5 truncate">
                        <span className="text-xs font-bold text-foreground truncate">{userProfile.name}</span>
                        <CheckCircle2 size={13} className="text-emerald-400 flex-shrink-0" />
                      </div>
                      <span className="text-[10px] text-muted-foreground block truncate">{userProfile.email}</span>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    title="Switch Account"
                    className="text-xs text-muted-foreground hover:text-destructive transition-colors p-1 rounded border border-border/50 hover:border-destructive/50 flex-shrink-0"
                  >
                    <LogOut size={13} />
                  </button>
                </div>
              ) : (
                /* Theme-matching Custom Google Sign-In Button Container */
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto max-w-full overflow-hidden">
                  <div 
                    onClick={handleManualGoogleSignIn}
                    className="relative group overflow-hidden rounded border border-border bg-secondary/20 hover:bg-secondary/50 hover:border-foreground/40 transition-all duration-200 px-4 py-2 flex items-center gap-2.5 cursor-pointer shadow-sm min-w-[210px] justify-center"
                  >
                    {/* Theme styled visible button content */}
                    <svg className="w-4 h-4 flex-shrink-0" viewBox="0 0 24 24">
                      <path fill="#EA4335" d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z" />
                      <path fill="#4285F4" d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z" />
                      <path fill="#FBBC05" d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 10.8 0 12s.7 2.3 1.9 4.7l3.7-2.9z" />
                      <path fill="#34A853" d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16c1.8 3.7 5.6 7 10.1 7z" />
                    </svg>
                    <span className="font-mono text-xs font-bold text-foreground tracking-wider uppercase select-none">
                      VERIFY WITH GOOGLE
                    </span>

                    {/* Transparent Native Google iframe overlay */}
                    <div 
                      ref={googleBtnRef} 
                      className="google-overlay-btn absolute inset-0 cursor-pointer overflow-hidden flex items-center justify-center pointer-events-auto z-10 opacity-0"
                      title="Verify footprint with Google"
                    />
                  </div>

                  {isSubmitting && (
                    <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-mono">
                      <RefreshCw size={13} className="animate-spin text-blue-400" /> Verifying Token...
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Status alert message */}
            {registerStatus && (
              <div className={`text-xs p-2.5 rounded border ${registerStatus.success ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-300" : "border-destructive/40 bg-destructive/10 text-destructive"}`}>
                {registerStatus.message}
              </div>
            )}
          </div>

          {loading && !data ? (
            <div className="py-20 text-center space-y-4 w-full max-w-full overflow-hidden flex flex-col items-center justify-center">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Querying MongoDB metrics & footprints...
              </p>
            </div>
          ) : error || !data ? (
            <div className="border border-destructive/30 bg-destructive/10 p-6 rounded text-center space-y-4">
              <p className="text-destructive font-bold uppercase tracking-wider">Database Fetch Failure</p>
              <p className="text-xs text-muted-foreground">{error || "No data returned."}</p>
            </div>
          ) : (
            <div className="space-y-8 w-full max-w-full overflow-x-hidden">
              
              {/* Footprints & Distribution Charts */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 w-full max-w-full">
                
                {/* Daily / Timeframe Footprints Chart */}
                <div className="md:col-span-2 border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4 min-w-0 overflow-hidden">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/40 pb-3 min-w-0">
                    <div className="flex items-center gap-2 text-foreground">
                      <Calendar size={16} className="text-blue-500 flex-shrink-0" />
                      <h2 className="text-xs font-bold uppercase tracking-widest truncate">
                        Footprints Analytics ({selectedPeriod.toUpperCase()}-WISE)
                      </h2>
                    </div>

                    {/* Timeframe Period Tabs: Day, Week, Month, Year */}
                    <div className="flex items-center gap-1 bg-secondary/20 p-1 rounded border border-border/60 max-w-full overflow-x-auto">
                      {(["day", "week", "month", "year"] as const).map((tab) => (
                        <button
                          key={tab}
                          onClick={() => {
                            setSelectedPeriod(tab)
                            setCurrentPage(1)
                          }}
                          className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded transition-colors whitespace-nowrap ${
                            selectedPeriod === tab
                              ? "bg-foreground text-background shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          {tab === "day" ? "Day Wise" : tab === "week" ? "Week Wise" : tab === "month" ? "Month Wise" : "Year Wise"}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="h-64 w-full min-w-0 overflow-hidden">
                    {data.dailyViews.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.dailyViews} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.15}/>
                              <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            stroke="currentColor" 
                            className="text-muted-foreground opacity-60"
                            fontSize={9} 
                            tickLine={false} 
                          />
                          <YAxis stroke="currentColor" className="text-muted-foreground opacity-60" fontSize={9} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: 11 }}
                            labelFormatter={(label) => `Period (${selectedPeriod}): ${label}`}
                          />
                          <Area type="monotone" dataKey="count" name="Visits" stroke="var(--foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        No footprint activity recorded for this period.
                      </div>
                    )}
                  </div>
                </div>

                {/* Locations List */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 text-foreground">
                    <Globe size={16} className="text-emerald-500 flex-shrink-0" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Top Locations</h2>
                  </div>
                  <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                    {data.countries.map((item, index) => {
                      const percentage = data.totalViews > 0 ? Math.round((item.count / data.totalViews) * 100) : 0
                      return (
                        <div key={item.country} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1.5 truncate">
                              <span className="text-[10px] opacity-40">#{index + 1}</span>
                              <span className="truncate">{item.country}</span>
                            </span>
                            <span className="font-bold flex-shrink-0">{item.count} ({percentage}%)</span>
                          </div>
                          <div className="h-1 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                              style={{ width: `${percentage}%` }}
                            />
                          </div>
                        </div>
                      )
                    })}
                    {data.countries.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-8">No location data captured.</p>
                    )}
                  </div>
                </div>

                {/* Devices Chart */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 text-foreground">
                    <Tv size={16} className="text-indigo-500 flex-shrink-0" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Devices</h2>
                  </div>
                  <div className="h-48 relative flex items-center justify-center min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.devices}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={6}
                        >
                          {data.devices.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: 11 }} 
                          itemStyle={{ color: "var(--foreground)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 flex-wrap text-[11px]">
                    {data.devices.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                        <span className="text-muted-foreground">{item.name}:</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Browsers Chart */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 text-foreground">
                    <Compass size={16} className="text-amber-500 flex-shrink-0" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Browsers</h2>
                  </div>
                  <div className="h-48 relative flex items-center justify-center min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.browsers}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={6}
                        >
                          {data.browsers.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 1) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: 11 }} 
                          itemStyle={{ color: "var(--foreground)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 flex-wrap text-[11px]">
                    {data.browsers.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[(index + 1) % COLORS.length] }} />
                        <span className="text-muted-foreground">{item.name}:</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Operating Systems Chart */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4 min-w-0 overflow-hidden">
                  <div className="flex items-center gap-2 text-foreground">
                    <Cpu size={16} className="text-pink-500 flex-shrink-0" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Operating Systems</h2>
                  </div>
                  <div className="h-48 relative flex items-center justify-center min-w-0 overflow-hidden">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={data.os}
                          cx="50%"
                          cy="50%"
                          innerRadius={55}
                          outerRadius={75}
                          paddingAngle={3}
                          dataKey="value"
                          stroke="none"
                          cornerRadius={6}
                        >
                          {data.os.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[(index + 2) % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: 11 }} 
                          itemStyle={{ color: "var(--foreground)" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="flex justify-center gap-4 flex-wrap text-[11px]">
                    {data.os.map((item, index) => (
                      <div key={item.name} className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-sm" style={{ backgroundColor: COLORS[(index + 2) % COLORS.length] }} />
                        <span className="text-muted-foreground">{item.name}:</span>
                        <span className="font-bold">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Recent Visitor Registry Table & API Filters */}
              <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-5 min-w-0 overflow-hidden">
                
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/50 pb-4">
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                      <User size={15} className="text-blue-500 flex-shrink-0" /> Recent Visitor Registry
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Filtered results fetched directly via MongoDB API query.
                    </p>
                  </div>

                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    Page {data.pagination.page} of {data.pagination.totalPages} ({data.pagination.total} Records Found)
                  </span>
                </div>

                {/* API Filter Bar Component */}
                <VisitorFilterBar
                  searchQuery={searchQuery}
                  setSearchQuery={(val) => {
                    setSearchQuery(val)
                    setCurrentPage(1)
                  }}
                  selectedLocation={selectedLocation}
                  setSelectedLocation={(val) => {
                    setSelectedLocation(val)
                    setCurrentPage(1)
                  }}
                  selectedDevice={selectedDevice}
                  setSelectedDevice={(val) => {
                    setSelectedDevice(val)
                    setCurrentPage(1)
                  }}
                  startDate={startDate}
                  setStartDate={(val) => {
                    setStartDate(val)
                    setCurrentPage(1)
                  }}
                  endDate={endDate}
                  setEndDate={(val) => {
                    setEndDate(val)
                    setCurrentPage(1)
                  }}
                  onReset={resetFilters}
                  locations={data.filters?.locations || []}
                />

                {/* Table */}
                <div className="overflow-x-auto w-full max-w-full">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2.5 font-bold uppercase min-w-[200px]">Visitor Profile & Email</th>
                        <th className="py-2.5 font-bold uppercase">Location</th>
                        <th className="py-2.5 font-bold uppercase">Device</th>
                        <th className="py-2.5 font-bold uppercase">Page Path</th>
                        <th className="py-2.5 font-bold uppercase text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentVisitors.map((v) => (
                        <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/10 transition-colors">
                          
                          {/* Column 1: Profile Photo, Name, and Email */}
                          <td className="py-3 pr-4">
                            <div className="flex items-center gap-3">
                              {v.picture ? (
                                <img 
                                  src={v.picture} 
                                  alt={v.name} 
                                  className="w-8 h-8 rounded-full border border-border object-cover flex-shrink-0"
                                />
                              ) : (
                                <div className="w-8 h-8 rounded-full bg-secondary border border-border text-foreground flex items-center justify-center font-bold text-xs flex-shrink-0 uppercase">
                                  {v.name ? v.name.charAt(0) : "A"}
                                </div>
                              )}
                              <div className="space-y-0.5">
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-foreground">{v.name}</span>
                                  {v.registered && (
                                     <span title="Google Verified Visitor" className="inline-flex items-center">
                                       <CheckCircle2 size={12} className="text-emerald-400" />
                                     </span>
                                  )}
                                </div>
                                {v.email ? (
                                  <p className="text-[10px] text-muted-foreground">{v.email}</p>
                                ) : (
                                  <p className="text-[9px] text-muted-foreground/60 italic">Anonymous Visit</p>
                                )}
                              </div>
                            </div>
                          </td>

                          {/* Location */}
                          <td className="py-3 text-muted-foreground">
                            {v.city}, {v.country}
                          </td>

                          {/* Device */}
                          <td className="py-3">
                            <span className="border border-border/60 px-2 py-0.5 text-[9px] uppercase tracking-wider rounded bg-secondary/10">
                              {v.device}
                            </span>
                          </td>

                          {/* Path */}
                          <td className="py-3">
                            <code className="text-[10px] text-blue-400 bg-secondary/20 px-1.5 py-0.5 rounded">
                              {v.path || "/"}
                            </code>
                          </td>

                          {/* Timestamp */}
                          <td className="py-3 text-right text-muted-foreground text-[11px]">
                            {new Date(v.timestamp).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                      
                      {data.recentVisitors.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-12 text-center text-muted-foreground">
                            No visitor records found matching your filter criteria.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {data.pagination.totalPages > 1 && (
                  <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs font-mono">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="border border-border px-3 py-1 hover:bg-secondary/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all rounded text-[10px] uppercase cursor-pointer"
                    >
                      {"<- PREV"}
                    </button>
                    <span className="text-[10px] text-muted-foreground">
                      PAGE {data.pagination.page} OF {data.pagination.totalPages}
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, data.pagination.totalPages))}
                      disabled={currentPage >= data.pagination.totalPages}
                      className="border border-border px-3 py-1 hover:bg-secondary/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all rounded text-[10px] uppercase cursor-pointer"
                    >
                      {"NEXT ->"}
                    </button>
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </main>

      <Footer />
    </div>
  )
}
