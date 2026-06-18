export interface TechSection {
  id: string
  number: string
  title: string
  subtitle: string
  description: string
  ascii: string
  specs: { label: string; value: string }[]
  commands: string[]
}

export const techSections: TechSection[] = [
  {
    id: "kernel-systems",
    number: "01",
    title: "About Me",
    subtitle: "Systems & Logic",
    description:
      "Software Development Engineer specializing in Fullstack web platforms, cross-platform mobile apps, and scalable backend architectures. Deeply passionate about raw logic, performance optimization, and translating complex IT requirements into clean, state-of-the-art software systems.",
    ascii: `
    ┌──────────────────────────────────────────┐
    │  THAYANITHI S - SOFTWARE ENGINEER       │
    │  ┌──────────────────┐ ┌────────────────┐ │
    │  │ FULLSTACK WEB    │ │ MOBILE APPS    │ │
    │  │ Next.js/React.js │ │ React Native   │ │
    │  └────────┬─────────┘ └────────┬───────┘ │
    │           │                    │         │
    │  ┌────────┴────────────────────┴───────┐ │
    │  │ BACKEND ARCHITECT & DATABASES       │ │
    │  │ Node.js, Go, MongoDB, PostgreSQL, GCP│ │
    │  └─────────────────────────────────────┘ │
    └──────────────────────────────────────────┘`,
    specs: [
      { label: "Location", value: "Namakkal, Tamil Nadu, India" },
      { label: "Email", value: "thayanithi2006s@gmail.com" },
      { label: "Focus", value: "Fullstack, Mobile, Backend Architecture" },
      { label: "Motto", value: "The best way to predict the future is to create it." },
    ],
    commands: [
      "$ whoami",
      "Thayanithi S - Software Development Engineer",
      "$ locate --region",
      "Namakkal, Tamil Nadu, India",
      "$ cat bio.txt",
      "Fueled by ∞ cups of coffee & passion for code.",
    ],
  },
  {
    id: "network-topologies",
    number: "02",
    title: "Tech Stack",
    subtitle: "Distributed Connectivity",
    description:
      "Mapping the tech stack nodes. Representing languages, frameworks, state management, databases, ORMs, cloud infrastructure, and development tools that link my engineering environment together.",
    ascii: `
    [Languages] ─────────────── [Frameworks]
         │                           │
         ├───────[TypeScript]────────┼─────── [Next.js / React]
         ├───────[JavaScript]────────┼─────── [React Native / Flutter]
         ├───────[C / Java]──────────┼─────── [Node.js / Express]
         │                           │
    [Databases] ─────────────── [Cloud & Tools]
         │                           │
         ├───────[PostgreSQL]────────┼─────── [Google Cloud / BigQuery]
         └───────[MongoDB]───────────└─────── [Git / GitHub / REST APIs]`,
    specs: [
      { label: "Languages", value: "TypeScript, JavaScript, C, Java, Python" },
      { label: "Frameworks", value: "Next.js, React.js, React Native, Vue, Flutter" },
      { label: "Databases & ORMs", value: "MongoDB, MySQL, PostgreSQL, Prisma, Sequelize" },
      { label: "Cloud & DevTools", value: "Google Cloud, BigQuery, Git, GitHub, REST APIs, Postman" },
    ],
    commands: [
      "$ tech-topology --scan",
      "Scanning active developer modules...",
      "TypeScript [100%] Next.js [100%] React Native [90%] MongoDB [95%] GCP [85%]",
      "$ git --version",
      "git version 2.43.0",
    ],
  },
  {
    id: "distributed-ledger",
    number: "03",
    title: "Experience",
    subtitle: "Consensus & Timeline",
    description:
      "Professional history ledger. Tracking technical milestones, platform engineering, and high-performance product deployments. Click on the blocks below to inspect roles, timelines, and key outcomes.",
    ascii: `
     EQREV (Jan-Dec 2025)     Crayon'd (Sep 24-Apr 25)
    ┌──────────────────────┐  ┌──────────────────────┐
    │ Role: Software Eng   │─>│ Role: Software Eng   │
    │ Focus: SaaS & Q-Comm │  │ Focus: React & APIs  │
    │ Tech: React, Zustand │  │ Tech: Node, Express  │
    └──────────────────────┘  └──────────────────────┘
               │                         │
               └─────────> Thinkuni ─────┘
                           (Sep 25 - Jan 26)
                           Role: Frontend Engineer`,
    specs: [
      { label: "EQREV", value: "Software Engineer | Jan 2025 – Dec 2025" },
      { label: "Crayon'd", value: "Software Engineer | Sep 2024 – Apr 2025" },
      { label: "Thinkuni", value: "Software Engineer | Sept 2025 – Jan 2026" },
      { label: "Total Tenure", value: "1.5+ Years Product Engineering" },
    ],
    commands: [
      "$ ledger query --experience",
      "Retrieving cryptographic proof of employment...",
      "EQREV: Engineered SaaS platform for Zepto, Blinkit, Instamart. Pin code analytics.",
      "Crayon'd: Developed 2+ client products. Scalable Express APIs. 20% faster delivery.",
      "Thinkuni: Vue.js dashboards. Interactive learning visualizations.",
    ],
  },
  {
    id: "compiler-design",
    number: "04",
    title: "Education",
    subtitle: "Language & Theory",
    description:
      "Academic compilation at Bannari Amman Institute of Technology, translating computer science theory into solid engineering capabilities and practical architecture skills.",
    ascii: `
    Bannari Amman Institute of Technology
    (2023 - 2027) ──> B.E. Computer Science and Engineering
                         │
                  CGPA Compilation
                         │
                 ┌───────┴───────┐
                 │ Current CGPA  │
                 │ ┌──┬──┬──┐    │
                 │ │8.│2 │  │    │
                 │ └──┴──┴──┘    │
                 └───────────────┘`,
    specs: [
      { label: "Institution", value: "Bannari Amman Institute of Technology" },
      { label: "Major", value: "Computer Science and Engineering" },
      { label: "Timeline", value: "2023 - 2027" },
      { label: "CGPA / 12th", value: "8.2 CGPA | 12th Grade: 92.38%" },
    ],
    commands: [
      "$ compile --degree",
      "Degree: B.E. Computer Science and Engineering",
      "$ compile --marks",
      "CGPA: 8.2/10.0 | HSC: 92.38%",
      "$ compile --courses",
      "Data Structures, DBMS, OS, Distributed Systems, Software Engineering",
    ],
  },
  {
    id: "graphics-pipelines",
    number: "05",
    title: "Certifications & Achievements",
    subtitle: "Rendering output",
    description:
      "Competitive achievements, community contributions, and technical certifications. Translating continuous learning into visual proof of capability.",
    ascii: `
    Community Rankings ──> LeetCode & GitHub
                             │
                      Hackathon Projects
                             │
                      Open Source Contributions
                             │
                      ┌──────┴──────┐
                      │ Credentials │
                      │ ┌──┬──┬──┐  │
                      │ │✓ │✓ │✓ │  │
                      │ └──┴──┴──┘  │
                      └─────────────┘`,
    specs: [
      { label: "Competitive Coding", value: "LeetCode & HackerRank Developer Profiles" },
      { label: "Hackathons", value: "Top rankings in local & state hackathons" },
      { label: "Certifications", value: "Google Cloud, Fullstack React, Node.js Architectures" },
      { label: "Open Source", value: "Active contributor to developer tools & templates" },
    ],
    commands: [
      "$ pipeline --verify --credentials",
      "Active certifications verified: OK",
      "$ pipeline --dev-profiles",
      "GitHub: thayanithi15 | LinkedIn: thayanithi15",
    ],
  },
  {
    id: "logic-synthesis",
    number: "06",
    title: "Core Engineering",
    subtitle: "Digital design & optimization",
    description:
      "Synthesizing scalable features and standardizing clean architectures. Optimizing API response times, secure authentication, and complex data collection mechanisms.",
    ascii: `
        REST APIs ──┐
                    ├──[SECURE]──┐
        JWT Auth  ──┘            │
                                 ├──[SYNTHESIZED CORE]──> Production Ready
        Web Scraping──┐          │
                      ├──[TEST]──┘
        BDD Testing ──┘
 
    Synthesis Matrix:
    REST JWT Scraping BDD | Production Status
    1    1   0        0   | Active API
    1    1   1        1   | Robust Enterprise Platform`,
    specs: [
      { label: "APIs & Services", value: "REST APIs, Web Scraping, JWT Auth" },
      { label: "Testing Methods", value: "BDD Testing, Unit and Integration Suites" },
      { label: "Performance", value: "Under 100ms API response latency" },
      { label: "Security Mode", value: "Role-Based Access Control, JWT, SSL" },
    ],
    commands: [
      "$ synth --optimize --apis",
      "Optimized express routes, query latency, database indexing.",
      "$ simulate --testing-suite",
      "BDD tests passed [100% success rate]",
      "$ security-check --jwt-auth",
      "HS256 signature validation: SECURE",
    ],
  },
  {
    id: "concurrency-models",
    number: "07",
    title: "High Performance Architectures",
    subtitle: "Parallel systems",
    description:
      "Designing responsive interfaces and high-throughput backends. Coordinating non-blocking asynchronous event loops, reactive states, and cross-platform native thread handling.",
    ascii: `
    Next.js CSR/SSR ──┐         ┌── React Native Threads
                      │         │
    Node.js EventLoop ┼──[ENG]──┼── Express APIs
                      │    │    │
    Zustand Store     ──┘    │    └── GCP Microservices
                           │
                     ┌─────┴─────┐
                     │ Parallel  │
                     │ Execution │
                     │ [|||||||] │
                     └───────────┘`,
    specs: [
      { label: "Web Concurrency", value: "Next.js SSR, React Concurrent Rendering" },
      { label: "State Hydration", value: "Zustand, Redux, Context Providers" },
      { label: "Async Runtimes", value: "Node.js cluster, asynchronous worker threads" },
      { label: "Mobile Threading", value: "React Native Bridge, Native Modules" },
    ],
    commands: [
      "$ runtime --inspect --concurrency",
      "Analyzing active state changes and event streams...",
      "Zustand store operational, atomic state updates: 0ms lag",
      "$ performance-test --load 5000rps",
      "Node.js cluster workload distribution: STABLE",
    ],
  },
  {
    id: "hardware-abstraction",
    number: "08",
    title: "Featured Projects",
    subtitle: "Interface & Products",
    description:
      "The portfolio registry. Direct access to production-ready SaaS dashboards, secure machine portals, community networks, and developer tools built with cutting-edge tech stacks.",
    ascii: `
    ┌──────────────────────────────────────────┐
    │     THAYANITHI S - FEATURED PROJECTS     │
    ├──────────────────────────────────────────┤
    │     EQ REV - QUICK COMMERCE ANALYTICS    │
    ├──────────────────────────────────────────┤
    │     CNC VAULT - SECURE CONTROL HUB       │
    ├──────────────────────────────────────────┤
    │     BITLINKS - COMMUNITY NETWORK         │
    ├──────────────────────────────────────────┤
    │     DEV RANK - DEVELOPER RANKING         │
    └──────────────────────────────────────────┘`,
    specs: [
      { label: "EQ REV", value: "React.js, Chart.js, Recharts, Tailwind CSS, Hero UI, Zustand" },
      { label: "CNC Vault", value: "Next.js, TypeScript, Node.js, Express.io, MongoDB, GCP, shadcn/ui" },
      { label: "Bitlinks", value: "Next.js, Framer Motion, Tailwind CSS, TypeScript, Vercel" },
      { label: "Dev Rank", value: "Next.js, Rapid API, Data Scraping, Tailwind CSS, TypeScript" },
    ],
    commands: [
      "$ hal query --device eqrev",
      "EQ REV: https://app.eqrev.com/",
      "$ hal query --device cnc-vault",
      "CNC Vault: https://cnc-machines.vercel.app/",
      "$ hal query --device bitlinks",
      "Bitlinks: https://bitlinks.bitsathy.ac.in/",
      "$ hal query --device dev-rank",
      "Dev Rank: GitHub / LeetCode ranking dashboard",
    ],
  },
]

export const navLinks = techSections.map((s) => ({
  id: s.id,
  number: s.number,
  title: s.title,
}))
