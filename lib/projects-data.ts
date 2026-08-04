import { StaticImageData } from "next/image"
import bitlinks1Img from "@/assets/projects/BITLINKS/BITLINKS_1.png"
import bitlinks2Img from "@/assets/projects/BITLINKS/BITLINKS_2.png"

import cnc1Img from "@/assets/projects/CNC/CNC_1.png"
import cnc2Img from "@/assets/projects/CNC/CNC_2.png"
import cnc3Img from "@/assets/projects/CNC/CNC_3.png"
import cnc4Img from "@/assets/projects/CNC/CNC_4.png"
import cnc5Img from "@/assets/projects/CNC/CNC_5.png"
import cnc6Img from "@/assets/projects/CNC/CNC_6.png"

import devrank1Img from "@/assets/projects/DEVRANK/DEVRANK_1.png"
import devrank2Img from "@/assets/projects/DEVRANK/DEVRANK_2.png"
import devrank3Img from "@/assets/projects/DEVRANK/DEVRANK_3.png"
import devrank4Img from "@/assets/projects/DEVRANK/DEVRANK_4.png"
import devrank5Img from "@/assets/projects/DEVRANK/DEVRANK_5.png"
import devrank6Img from "@/assets/projects/DEVRANK/DEVRANK_6.png"

import eqrev1Img from "@/assets/projects/EQREV/EQREV_1.png"

import progressiq1Img from "@/assets/projects/PROGRESSIQ/PROGRESSIQ_1.png"
import progressiq2Img from "@/assets/projects/PROGRESSIQ/PROGRESSIQ_2.png"
import progressiq3Img from "@/assets/projects/PROGRESSIQ/PROGRESSIQ_3.png"
import progressiq4Img from "@/assets/projects/PROGRESSIQ/PROGRESSIQ_4.png"
import progressiq5Img from "@/assets/projects/PROGRESSIQ/PROGRESSIQ_5.png"
import progressiq6Img from "@/assets/projects/PROGRESSIQ/PROGRESSIQ_6.png"

export interface ProjectMetric {
  label: string
  value: string
  description: string
}

export interface TechCategory {
  category: string
  items: string[]
}

export interface ProjectFeature {
  title: string
  description: string
  codeSnippet?: string
}

export interface ProjectDetail {
  slug: string
  assetPrefix?: string
  level: string
  name: string
  tagline: string
  category: string
  timeline: string
  role: string
  status: string
  url: string
  githubUrl?: string
  shortDesc: string
  fullDescription: string
  problemStatement: string
  solutionOverview: string
  image: StaticImageData
  gallery?: StaticImageData[]
  metrics: ProjectMetric[]
  keyFeatures: ProjectFeature[]
  techStack: TechCategory[]
  architectureAscii: string
  terminalLogs: string[]
}

export const projectsData: Record<string, ProjectDetail> = {
  "cnc-vault": {
    slug: "cnc-vault",
    assetPrefix: "CNC",
    level: "PROJ_04",
    name: "CNC VAULT",
    tagline: "INDUSTRIAL CNC MACHINERY CONTROL HUB & SECURE PROGRAM VAULT",
    category: "Industrial IoT / Machine Control Hub",
    timeline: "2024 – 2025",
    role: "Full Stack Developer",
    status: "PRODUCTION_ONLINE",
    url: "https://cnc-machines.vercel.app/",
    shortDesc: "Secure access to centralized machine programs, PLC logic, and configuration management for industrial CNC machinery. Improved operational efficiency by 70%.",
    fullDescription: "CNC Vault is an industrial-grade cloud management platform built to centralize, version-control, and secure G-code machine programs and PLC logic parameters across manufacturing plants. Designed for precision engineering facilities, CNC Vault replaces error-prone USB transfers with encrypted, audited cloud distribution.",
    problemStatement: "Manufacturing facilities suffer from machine program version mismatches, unauthorized G-code modifications, machine downtime during transfers, and lack of revision history.",
    solutionOverview: "Engineered a web application with Next.js, Express.io, MongoDB, and GCP that maintains cryptographic hashes of machine code, enforces strict machine-operator permission matrices, and streamlines program deployments.",
    image: cnc1Img,
    gallery: [cnc1Img, cnc2Img, cnc3Img, cnc4Img, cnc5Img, cnc6Img],
    metrics: [
      { label: "Operational Efficiency", value: "+70%", description: "Reduction in setup & program retrieval time" },
      { label: "Machine Downtime", value: "-45%", description: "Eliminated program mismatch machine crashes" },
      { label: "Machine Compatibility", value: "Universal", description: "Supports Fanuc, Siemens, Haas & Heidenhain G-code" },
      { label: "Security Encryption", value: "AES-256", description: "Encrypted program storage & hash audit trails" }
    ],
    keyFeatures: [
      {
        title: "G-Code Version Control",
        description: "Complete revision tracking for NC and PLC programs with side-by-side diff viewers and instant rollbacks."
      },
      {
        title: "Role-Based Machine Assignment",
        description: "Granular authorization matrix ensuring operators can only execute verified, engineer-approved program hashes."
      },
      {
        title: "Machine Status & Maintenance Alerting",
        description: "Live dashboard tracking machine availability, active program assignments, and scheduled maintenance windows."
      },
      {
        title: "Cryptographic Code Verification",
        description: "SHA-256 hash checks verifying that file contents delivered to machine terminals have not been corrupted."
      }
    ],
    techStack: [
      { category: "Web Stack", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "shadcn/ui", "Lucide Icons"] },
      { category: "Backend Systems", items: ["Node.js", "Express.io", "GCP Compute Engine", "REST API Layer"] },
      { category: "Database & Storage", items: ["MongoDB Atlas", "GridFS Binary Vault", "AES File Encryption"] },
      { category: "DevOps & Cloud", items: ["Google Cloud Platform", "Vercel", "GitHub Actions CI/CD"] }
    ],
    architectureAscii: `
 ┌────────────────────────────────────────────────────────────────────────┐
 │                        CNC VAULT ARCHITECTURE                          │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Industrial Control Web UI (Next.js + TypeScript + shadcn/ui)         │
 │  ├── G-Code Viewer & Code Diff Engine                                 │
 │  └── Machine Allocation Dashboard                                     │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ (HTTPS REST + Hash Verification)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Express.io Backend Service & Secure Hash Verification Vault          │
 │  ├── Encryption Engine: AES-256 G-Code File Cipher                    │
 │  ├── Audit Log Engine: Operator Action & Hash Tracker                 │
 │  └── Access Controller: Role & Machine ID RBAC                       │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Industrial Storage & Cloud Infrastructure                            │
 │  ├── MongoDB Atlas (Machine Profiles, Operator Logs, Schemas)         │
 │  └── GCP Cloud Storage (Encrypted G-Code & PLC Logic Backups)          │
 └────────────────────────────────────────────────────────────────────────┘`,
    terminalLogs: [
      "$ cnc-vault status --machines",
      "[SYS_HEALTH] All 12 CNC Milling & Turning Centers Online.",
      "$ cnc-vault program verify --id NC_PART_8892 --hash sha256",
      "[HASH_CHECK] Computed: e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      "[HASH_CHECK] Match Status: VERIFIED (100% Integrity)",
      "$ cnc-vault audit --latest",
      "[AUDIT_LOG] Operator #402 loaded NC_PART_8892 to Haas VF-2 SS",
      "[SUCCESS] CNC Machine Vault operational."
    ]
  },
  "progress-iq": {
    slug: "progress-iq",
    assetPrefix: "PROGRESSIQ",
    level: "PROJ_03",
    name: "PROGRESS IQ",
    tagline: "REAL-TIME ACTIVITY MONITORING & TEAM ANALYTICS PLATFORM",
    category: "Real-time Monitoring / Enterprise Analytics",
    timeline: "2025 – Present",
    role: "Lead Fullstack & Systems Engineer",
    status: "PRODUCTION_ONLINE",
    url: "https://progress-iq.vercel.app/",
    shortDesc: "Monitor daily activities and task updates instantly across teams with live sync. Features AI-driven insights to measure productivity, role-based access control, and centralized collaboration workspace.",
    fullDescription: "Progress IQ is a high-performance, real-time activity monitoring and team analytics dashboard designed to eliminate visibility bottlenecks in distributed development and operations teams. Built with Next.js, Socket.io, and AI-driven data aggregation models, Progress IQ tracks daily tasks, operational metrics, and team output in real time.",
    problemStatement: "Distributed teams often suffer from fragmented reporting, asynchronous communication delays, and lack of real-time visibility into project velocity and team throughput.",
    solutionOverview: "Engineered a unified monitoring engine featuring WebSocket-based live telemetry sync, automated AI productivity summary reports, and granular role-based access control (RBAC) to ensure operational clarity without micro-management.",
    image: progressiq1Img,
    gallery: [
      progressiq1Img,
      progressiq2Img,
      progressiq3Img,
      progressiq4Img,
      progressiq5Img,
      progressiq6Img,
    ],
    metrics: [
      { label: "Live Telemetry Sync", value: "< 50ms", description: "Real-time event propagation delay" },
      { label: "Productivity Gains", value: "+35%", description: "Reported team task completion rate improvement" },
      { label: "Active Roles Managed", value: "Multi-Tier", description: "Admin, Manager, Developer & Auditor RBAC" },
      { label: "Data Integrity", value: "99.9%", description: "Automated audit trail & state snapshot synchronization" }
    ],
    keyFeatures: [
      {
        title: "Real-Time WebSocket Sync",
        description: "Instant bi-directional state synchronization across client sessions using Socket.io and optimized pub-sub handlers."
      },
      {
        title: "AI-Powered Velocity Insights",
        description: "Intelligent analytics engine that aggregates project telemetry to calculate productivity trends and workload bottlenecks."
      },
      {
        title: "Role-Based Access Control (RBAC)",
        description: "Secure permission hierarchy specifying workspace visibility, project mutation rights, and telemetry reporting access."
      },
      {
        title: "Centralized Workspace Hub",
        description: "Unified interface for tracking tasks, sprint progress, operational activity logs, and real-time developer status updates."
      }
    ],
    techStack: [
      { category: "Frontend Framework", items: ["Next.js 14 (App Router)", "TypeScript", "Tailwind CSS", "Framer Motion", "Zustand"] },
      { category: "Backend & Realtime", items: ["Node.js", "Express.js", "Socket.io Engine", "REST Endpoints"] },
      { category: "Database & Storage", items: ["MongoDB Atlas", "Mongoose ORM", "Redis Caching Layer"] },
      { category: "AI & Infrastructure", items: ["Vercel Edge Platform", "AI Analytics API", "JWT Verification"] }
    ],
    architectureAscii: `
 ┌────────────────────────────────────────────────────────────────────────┐
 │                        PROGRESS IQ ARCHITECTURE                        │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Client Web Application (Next.js 14 + React 18 + Tailwind CSS)        │
 │  ├── State Management: Zustand Atomic Store                             │
 │  └── Realtime Socket Listener: Socket.io Client                        │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ (WSS / HTTPS APIs)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Node.js API Server & Socket Cluster Engine                            │
 │  ├── Middleware: JWT Auth & RBAC Guard                                 │
 │  ├── Worker Threads: AI Analytics Aggregator                           │
 │  └── Socket Pub/Sub: Redis Event Router                                │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Persistent Storage & Cache Tier                                       │
 │  ├── MongoDB Atlas (User Schemas, Project Telemetry, Logs)            │
 │  └── Redis Cache (Active Connections & Realtime State Snapshots)       │
 └────────────────────────────────────────────────────────────────────────┘`,
    terminalLogs: [
      "$ progress-iq status --node-cluster",
      "[SYS_INFO] Cluster Status: 4 Workers Operational",
      "[SYS_INFO] Active Socket Connections: 1,420 active threads",
      "$ progress-iq telemetry --verify-latency",
      "[LATENCY_CHECK] Avg Ping: 32ms | Packet Loss: 0.00%",
      "$ progress-iq ai-engine --analyze-sprint",
      "[AI_METRICS] Velocity index: 94.2% | Bottlenecks detected: 0",
      "[SUCCESS] Realtime monitoring system running at peak efficiency."
    ]
  },
  "eq-rev": {
    slug: "eq-rev",
    assetPrefix: "EQREV",
    level: "PROJ_02",
    name: "EQ REV",
    tagline: "QUICK COMMERCE ANALYTICS PLATFORM FOR D2C BRANDS",
    category: "SaaS Platform / E-Commerce Intelligence",
    timeline: "Jan 2025 – Dec 2025",
    role: "Software Engineer (Fullstack & Data)",
    status: "PRODUCTION_ONLINE",
    url: "https://app.eqrev.com/",
    shortDesc: "EQREV specializes in scaling brands across Quick Commerce platforms (Zepto, Blinkit, Instamart). Provides pin code-level insights, inventory tracking, and revenue dashboards.",
    fullDescription: "EQ REV is an enterprise SaaS analytics platform engineered specifically for D2C brands scaling on instant quick-commerce platforms like Zepto, Blinkit, and Swiggy Instamart. The system ingests and processes granular location data, enabling store managers and founders to analyze sales performance down to individual pin codes and warehouse fulfillment centers across India.",
    problemStatement: "Brands selling on Quick Commerce platforms face complete dark spots regarding hyper-local demand, pin-code inventory stockouts, and regional channel analytics.",
    solutionOverview: "Built a multi-tenant analytics engine with interactive Chart.js/Recharts data visualizations, automated BigQuery data processing pipelines, OTP authentication, and responsive Hero UI dashboards.",
    image: eqrev1Img,
    gallery: [eqrev1Img],
    metrics: [
      { label: "Retail Stores Analyzed", value: "1,000+", description: "Hyper-local store pin codes tracked in real-time" },
      { label: "Platforms Integrated", value: "3 Major Q-Comm", description: "Zepto, Blinkit & Swiggy Instamart" },
      { label: "Key Enterprise Clients", value: "Mee Mee, Ramraj", description: "Adopted by top D2C consumer product brands" },
      { label: "Query Throughput", value: "10M+ rows/sec", description: "BigQuery powered data aggregation pipelines" }
    ],
    keyFeatures: [
      {
        title: "Hyper-Local Pin Code Insights",
        description: "Interactive heatmaps and data grids mapping store performance and demand patterns to exact regional postal codes."
      },
      {
        title: "Multi-Platform Aggregation",
        description: "Unified analytics dashboard comparing revenue velocity, SKU performance, and stockouts across Zepto, Blinkit, and Instamart."
      },
      {
        title: "Automated Stockout Alerting",
        description: "Smart inventory monitoring that flags low-stock warehouses before replenishment failure affects revenue."
      },
      {
        title: "Role-Based Brand Portal",
        description: "Multi-tenant portal featuring custom dashboard views for brand executives, category managers, and regional leads."
      }
    ],
    techStack: [
      { category: "Frontend Stack", items: ["React.js", "Chart.js", "Recharts", "Tailwind CSS", "Hero UI", "Zustand"] },
      { category: "Backend Architecture", items: ["Node.js", "Express.js", "REST APIs", "Cloudflare Workers"] },
      { category: "Database & Data Warehouse", items: ["Google BigQuery", "MongoDB Atlas", "PostgreSQL", "Prisma ORM"] },
      { category: "Infrastructure & Security", items: ["Google Cloud Platform (GCP)", "Vercel Enterprise", "JWT / OTP Auth"] }
    ],
    architectureAscii: `
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         EQ REV SAAS ARCHITECTURE                       │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Brand Analytics Portal (React.js + Hero UI + Chart.js / Recharts)     │
 │  ├── Pin Code Data Grid & Filter Controls                             │
 │  └── Zustand Hydrated State Store                                      │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ (Secure REST / JWT APIs)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Express / Node.js Microservices Layer                                 │
 │  ├── Auth Engine: OTP Verification & Session Guard                      │
 │  ├── Data Pipeline: Cloudflare Router + Rate Limiter                   │
 │  └── Aggregator: BigQuery SQL Pipeline Worker                          │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Data Analytics Engine                                                 │
 │  ├── Google BigQuery (Multi-Million Sales Row Storage & Pin Code SQL) │
 │  └── MongoDB Atlas (User Profiles, Brand Configs, Alert Rules)        │
 └────────────────────────────────────────────────────────────────────────┘`,
    terminalLogs: [
      "$ eqrev-cli query --brand meemee --region south-zone",
      "[DATA_INGEST] Ingesting pin-code data streams for 1,250 dark stores...",
      "$ eqrev-cli analytics --platform blinkit --skus all",
      "[AGGREGATION] BigQuery executed query across 8.4M records in 180ms.",
      "$ eqrev-cli stockout-check --threshold 10%",
      "[WARN] 4 pin codes in Bengaluru showing stockout risk within 2 hours.",
      "[SUCCESS] Brand analytics portal initialized & active."
    ]
  },
  "bitlinks": {
    slug: "bitlinks",
    assetPrefix: "BITLINKS",
    level: "PROJ_01",
    name: "BITLINKS",
    tagline: "COLLEGE COMMUNITY NETWORK & COLLABORATIVE WORKSPACE PORTAL",
    category: "Community Network / Campus Platform",
    timeline: "2024 – 2025",
    role: "Fullstack Creator & Architect",
    status: "PRODUCTION_ONLINE",
    url: "https://bitlinks.bitsathy.ac.in/",
    shortDesc: "Modern community portal featuring smooth animations, optimized speed, responsive design, and collaborative workspaces for campus students and developer communities.",
    fullDescription: "Bitlinks is a student community and networking portal crafted for Bannari Amman Institute of Technology (BIT). The platform connects student developers, project teams, club networks, and academic resources through a streamlined, highly responsive digital ecosystem featuring fluid Framer Motion micro-interactions.",
    problemStatement: "Fragmented campus communication across multiple messaging groups led to missed event announcements, lost technical project opportunities, and difficult team recruitment.",
    solutionOverview: "Built a centralized web portal with Next.js, Framer Motion, and Tailwind CSS offering quick resource links, developer profile showcases, event calendars, and collaborative club workspaces.",
    image: bitlinks1Img,
    gallery: [bitlinks1Img, bitlinks2Img],
    metrics: [
      { label: "Community Engagement", value: "Campus Wide", description: "Serving student developers & academic clubs" },
      { label: "Lighthouse Performance", value: "98 / 100", description: "Optimized Vercel edge build load times" },
      { label: "UI Motion Score", value: "60 FPS", description: "Butter-smooth Framer Motion animation pipeline" },
      { label: "Mobile Responsiveness", value: "100%", description: "Flawless viewports on mobile devices & tablets" }
    ],
    keyFeatures: [
      {
        title: "Collaborative Project Hub",
        description: "Dedicated directory for student open-source projects, team recruitment, and skill matching."
      },
      {
        title: "Fluid Framer Motion UI",
        description: "Custom animation system providing modern transitions, micro-interactions, and visual polish."
      },
      {
        title: "Centralized Campus Resources",
        description: "Curated directory of development resources, hackathon portals, course notes, and club schedules."
      },
      {
        title: "Dark / Light Mode Aesthetic",
        description: "System-aware theme management adhering to modern engineering design standards."
      }
    ],
    techStack: [
      { category: "Core Framework", items: ["Next.js (App Router)", "TypeScript", "React.js"] },
      { category: "Styling & Motion", items: ["Tailwind CSS", "Framer Motion", "Lucide React"] },
      { category: "Deployment", items: ["Vercel Edge Platform", "Domain DNS Integration"] }
    ],
    architectureAscii: `
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         BITLINKS ARCHITECTURE                          │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Campus Portal UI (Next.js App Router + TypeScript + Tailwind)        │
 │  ├── Interactive Component Registry & Animated Routes                  │
 │  └── Framer Motion Orchestration Engine                                │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ (Client Side Navigation)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Vercel Edge Network Infrastructure                                    │
 │  ├── Edge SSR & Static Asset Delivery                                  │
 │  └── Cached Resource Routers                                           │
 └────────────────────────────────────────────────────────────────────────┘`,
    terminalLogs: [
      "$ bitlinks-cli build --prod",
      "[BUILD_SUCCESS] Compiled static routes in 1.4s.",
      "$ bitlinks-cli audit --performance",
      "[LIGHTHOUSE] Performance: 98 | Accessibility: 100 | SEO: 95",
      "[SUCCESS] Bitlinks portal online."
    ]
  },
  "dev-rank": {
    slug: "dev-rank",
    assetPrefix: "DEVRANK",
    level: "PROJ_00",
    name: "DEV RANK",
    tagline: "DEVELOPER RANKING & PROFILE AGGREGATOR PLATFORM",
    category: "Developer Tools / Portfolio Analytics",
    timeline: "2024 – 2025",
    role: "Lead Developer",
    status: "PRODUCTION_ONLINE",
    url: "http://dev-rank.vercel.app/",
    githubUrl: "https://github.com/thayanithi15-git",
    shortDesc: "Developer Ranking Platform. Connects coding profiles (GitHub, LeetCode) to compute and display rankings in developer communities, helping recruiters discover top talent.",
    fullDescription: "Dev Rank is an AI-powered developer profile aggregation and ranking platform. By integrating external APIs and web scraping routines, Dev Rank synthesizes developer activity across GitHub, LeetCode, and coding platforms into unified engineering rank scores, enabling peer comparison and talent discovery.",
    problemStatement: "Recruiters and community leads lack a single objective metric to compare a developer's real-world code contributions alongside algorithmic problem-solving skills.",
    solutionOverview: "Constructed a profile parser and ranking engine with Next.js, Rapid API, and automated web scrapers that computes normalized rank metrics based on commit history, repository stars, and LeetCode problem difficulties.",
    image: devrank1Img,
    gallery: [
      devrank1Img,
      devrank2Img,
      devrank3Img,
      devrank4Img,
      devrank5Img,
      devrank6Img,
    ],
    metrics: [
      { label: "Profile Sources", value: "GitHub & LeetCode", description: "Aggregated coding metrics" },
      { label: "Ranking Algorithm", value: "Weighted Index", description: "Balances commits, stars, & problem difficulty" },
      { label: "Scraping Latency", value: "< 1.2s", description: "Fast asynchronous API fetch handlers" },
      { label: "User Profiles", value: "Community Scale", description: "Ranking developer profiles seamlessly" }
    ],
    keyFeatures: [
      {
        title: "Multi-Platform Profile Fetcher",
        description: "Asynchronous data collectors gathering public metrics from GitHub repositories and LeetCode profile APIs."
      },
      {
        title: "Weighted Dev Rank Score",
        description: "Custom scoring formula calculating overall developer tier by combining code frequency, star count, and solved problem difficulty."
      },
      {
        title: "Leaderboard & Search Matrix",
        description: "Filterable community leaderboards enabling instant searching by stack, ranking tier, or institution."
      },
      {
        title: "Visual Badge Generator",
        description: "Embeddable SVG cards displaying rank metrics for developer README profiles."
      }
    ],
    techStack: [
      { category: "Frontend Stack", items: ["Next.js (App Router)", "TypeScript", "Tailwind CSS", "Recharts"] },
      { category: "Data Ingestion", items: ["Rapid API", "Custom Data Scraping Engine", "REST Endpoints"] },
      { category: "Backend & Storage", items: ["Node.js", "Express API", "MongoDB Atlas"] },
      { category: "Deployment", items: ["Vercel Edge Engine"] }
    ],
    architectureAscii: `
 ┌────────────────────────────────────────────────────────────────────────┐
 │                         DEV RANK ARCHITECTURE                          │
 ├────────────────────────────────────────────────────────────────────────┤
 │  Developer Ranking Portal (Next.js + TypeScript + Tailwind)            │
 │  ├── Leaderboard Table & Search Filtering Matrix                      │
 │  └── Realtime Profile Card Viewers                                     │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │ (API Calls)
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Data Collector & Ranking Calculation Engine                          │
 │  ├── GitHub API Collector (Commits, Stars, PRs, Repos)                │
 │  ├── LeetCode API Scraper (Easy, Medium, Hard Solved Counts)          │
 │  └── DevScore Evaluator: Weighted Multi-Factor Algorithm               │
 └───────────────────────────────────┬────────────────────────────────────┘
                                     │
 ┌───────────────────────────────────▼────────────────────────────────────┐
 │  Storage & Cache                                                       │
 │  └── MongoDB Atlas (Rankings Cache & Historical Score Logs)            │
 └────────────────────────────────────────────────────────────────────────┘`,
    terminalLogs: [
      "$ dev-rank fetch --user thayanithi15-git",
      "[FETCH] GitHub Repos: 45 | Total Stars: 28 | Commits: 2,100+",
      "$ dev-rank fetch --leetcode thayanithi15",
      "[FETCH] Problems Solved: 300+ (Easy: 120, Med: 155, Hard: 25)",
      "$ dev-rank calculate-tier --user thayanithi15-git",
      "[SCORE_EVAL] Calculated DevScore: 945 / 1000 [TIER: EXPERT]",
      "[SUCCESS] Dev Rank engine online."
    ]
  }
};
