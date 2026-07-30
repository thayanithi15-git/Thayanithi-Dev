"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Navigation } from "@/components/ascii-hub/navigation"
import { Footer } from "@/components/ascii-hub/footer"
import { 
  ArrowLeft, 
  Tv, 
  Globe, 
  Compass, 
  Cpu, 
  Eye, 
  Calendar,
  User,
  Send
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

interface Visitor {
  id: string
  name: string
  country: string
  city: string
  device: string
  timestamp: string
}

interface StatsData {
  totalViews: number
  devices: { name: string; value: number }[]
  browsers: { name: string; value: number }[]
  os: { name: string; value: number }[]
  countries: { country: string; count: number }[]
  dailyViews: { date: string; count: number }[]
  recentVisitors: Visitor[]
}

const COLORS = ["var(--color-blue-500, #3b82f6)", "var(--color-emerald-500, #10b981)", "var(--color-amber-500, #f59e0b)", "var(--color-purple-500, #8b5cf6)", "var(--color-pink-500, #ec4899)"]

export default function StatsPage() {
  const [data, setData] = useState<StatsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [visitorName, setVisitorName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const fetchStats = () => {
    fetch("/api/views")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch analytics")
        return res.json()
      })
      .then((stats) => {
        setData(stats)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchStats()
    if (typeof window !== "undefined") {
      const savedName = localStorage.getItem("portfolio_visitor_name") || ""
      setVisitorName(savedName)
    }
  }, [])

  const handleRegisterName = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!visitorName.trim() || isSubmitting) return

    setIsSubmitting(true)
    try {
      if (typeof window !== "undefined") {
        localStorage.setItem("portfolio_visitor_name", visitorName)
      }
      
      const res = await fetch("/api/views", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: visitorName,
          referrer: typeof document !== "undefined" ? document.referrer : "Direct"
        })
      })

      if (res.ok) {
        setVisitorName("")
        fetchStats()
      }
    } catch (err) {
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <Navigation />
      
      <main className="flex-1 py-12">
        <div className="mx-auto max-w-7xl px-4 lg:px-8 space-y-8 font-mono">
          
          {/* Back button & Title */}
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
                Active connection to MongoDB
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
                  {loading ? "..." : data?.totalViews}
                </p>
              </div>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center space-y-4">
              <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="text-xs text-muted-foreground uppercase tracking-widest">
                Querying MongoDB metrics...
              </p>
            </div>
          ) : error || !data ? (
            <div className="border border-destructive/30 bg-destructive/10 p-6 rounded text-center space-y-4">
              <p className="text-destructive font-bold uppercase tracking-wider">Database Fetch Failure</p>
              <p className="text-xs text-muted-foreground">{error || "No data returned."}</p>
            </div>
          ) : (
            <div className="space-y-8">
              
              {/* Name Register form */}
              <div className="border border-border bg-secondary/5 p-4 rounded">
                <form onSubmit={handleRegisterName} className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                  <div className="space-y-1 text-center sm:text-left">
                    <h3 className="text-xs font-bold uppercase tracking-widest flex items-center gap-1.5 justify-center sm:justify-start">
                      <User size={14} className="text-blue-500" /> Register Your Visit Name
                    </h3>
                    <p className="text-[10px] text-muted-foreground">
                      Let your footprint be stored in the database registry.
                    </p>
                  </div>
                  <div className="flex w-full sm:w-auto gap-2">
                    <input
                      type="text"
                      value={visitorName}
                      onChange={(e) => setVisitorName(e.target.value)}
                      placeholder="Enter name (e.g. John Doe)..."
                      className="flex-1 sm:w-64 bg-background border border-border rounded px-3 py-1.5 text-xs text-foreground focus:border-foreground focus:outline-none"
                    />
                    <button
                      type="submit"
                      disabled={isSubmitting || !visitorName.trim()}
                      className="border border-foreground bg-foreground text-background text-xs font-bold px-4 py-1.5 hover:bg-transparent hover:text-foreground transition-colors duration-200 cursor-pointer disabled:opacity-50 rounded"
                    >
                      {isSubmitting ? "..." : <Send size={12} />}
                    </button>
                  </div>
                </form>
              </div>

              {/* Charts grid */}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                
                {/* Daily Activity Chart */}
                <div className="md:col-span-2 border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Calendar size={16} className="text-blue-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Daily Footprints (Last 14 Days)</h2>
                  </div>
                  <div className="h-64 w-full">
                    {data.dailyViews.length > 0 ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={data.dailyViews} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                          <defs>
                            <linearGradient id="colorCount" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="var(--foreground)" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="var(--foreground)" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <XAxis 
                            dataKey="date" 
                            stroke="currentColor" 
                            className="text-muted-foreground opacity-60"
                            fontSize={9} 
                            tickLine={false} 
                            tickFormatter={(str) => {
                              const date = new Date(str)
                              return date.toLocaleDateString(undefined, { month: "short", day: "numeric" })
                            }}
                          />
                          <YAxis stroke="currentColor" className="text-muted-foreground opacity-60" fontSize={9} tickLine={false} />
                          <Tooltip 
                            contentStyle={{ backgroundColor: "var(--background)", borderColor: "var(--border)", color: "var(--foreground)", fontFamily: "monospace", fontSize: 11 }}
                            labelFormatter={(label) => `Date: ${label}`}
                          />
                          <Area type="monotone" dataKey="count" name="Views" stroke="var(--foreground)" strokeWidth={2} fillOpacity={1} fill="url(#colorCount)" />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : (
                      <div className="h-full flex items-center justify-center text-xs text-muted-foreground">
                        No footprint activity recorded yet.
                      </div>
                    )}
                  </div>
                </div>

                {/* Locations List */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Globe size={16} className="text-emerald-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Top Locations</h2>
                  </div>
                  <div className="space-y-3.5 max-h-64 overflow-y-auto pr-1">
                    {data.countries.map((item, index) => {
                      const percentage = data.totalViews > 0 ? Math.round((item.count / data.totalViews) * 100) : 0
                      return (
                        <div key={item.country} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span className="text-muted-foreground flex items-center gap-1.5">
                              <span className="text-[10px] opacity-40">#{index + 1}</span>
                              {item.country}
                            </span>
                            <span className="font-bold">{item.count} ({percentage}%)</span>
                          </div>
                          <div className="h-1 bg-border rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-foreground rounded-full transition-all duration-500" 
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

                {/* Devices */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Tv size={16} className="text-indigo-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Devices</h2>
                  </div>
                  <div className="h-48 relative flex items-center justify-center">
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

                {/* Browsers */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Compass size={16} className="text-amber-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Browsers</h2>
                  </div>
                  <div className="h-48 relative flex items-center justify-center">
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

                {/* Operating Systems */}
                <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4">
                  <div className="flex items-center gap-2 text-foreground">
                    <Cpu size={16} className="text-pink-500" />
                    <h2 className="text-xs font-bold uppercase tracking-widest">Operating Systems</h2>
                  </div>
                  <div className="h-48 relative flex items-center justify-center">
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

              {/* Recent Visitor Registry Table */}
              <div className="border border-border bg-secondary/5 p-4 sm:p-6 rounded space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold uppercase tracking-widest">Recent Visitor Registry</h3>
                  <span className="text-[10px] text-muted-foreground uppercase tracking-widest">
                    Page {currentPage} of {data.recentVisitors.length > 0 ? Math.ceil(data.recentVisitors.length / itemsPerPage) : 1}
                  </span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-border text-muted-foreground">
                        <th className="py-2.5 font-bold uppercase">Name</th>
                        <th className="py-2.5 font-bold uppercase">Location</th>
                        <th className="py-2.5 font-bold uppercase">Device</th>
                        <th className="py-2.5 font-bold uppercase">Page Path</th>
                        <th className="py-2.5 font-bold uppercase text-right">Timestamp</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentVisitors
                        .slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)
                        .map((v) => (
                          <tr key={v.id} className="border-b border-border/50 hover:bg-secondary/10">
                            <td className="py-2.5 font-bold text-foreground">{v.name}</td>
                            <td className="py-2.5 text-muted-foreground">
                              {v.city}, {v.country}
                            </td>
                            <td className="py-2.5">
                              <span className="border border-border/60 px-1.5 py-0.5 text-[9px] uppercase tracking-wider rounded">
                                {v.device}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <code className="text-[10px] text-blue-400 bg-secondary/20 px-1.5 py-0.5 rounded">
                                {v.path || "/"}
                              </code>
                            </td>
                            <td className="py-2.5 text-right text-muted-foreground">
                              {new Date(v.timestamp).toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      {data.recentVisitors.length === 0 && (
                        <tr>
                          <td colSpan={5} className="py-8 text-center text-muted-foreground">
                            No registry records found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Pagination Controls */}
                {data.recentVisitors.length > itemsPerPage && (
                  <div className="flex items-center justify-between border-t border-border/40 pt-4 text-xs font-mono">
                    <button
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="border border-border px-3 py-1 hover:bg-secondary/20 disabled:opacity-30 disabled:hover:bg-transparent transition-all rounded text-[10px] uppercase cursor-pointer"
                    >
                      {"<- PREV"}
                    </button>
                    <span className="text-[10px] text-muted-foreground">
                      SHOWING {Math.min((currentPage - 1) * itemsPerPage + 1, data.recentVisitors.length)} - {Math.min(currentPage * itemsPerPage, data.recentVisitors.length)} OF {data.recentVisitors.length} RECORDS
                    </span>
                    <button
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, Math.ceil(data.recentVisitors.length / itemsPerPage)))}
                      disabled={currentPage >= Math.ceil(data.recentVisitors.length / itemsPerPage)}
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
