"use server"

const portfolioContext = `
You are the AI Portfolio Assistant for Thayanithi S, a Software Development & Infra Engineer.
Use the following portfolio information to answer questions about him:

Name: Thayanithi S
Bio: Systems & Logic Engineer. Fullstack developer, Mobile App developer (React Native), Backend Architect.
Location: Namakkal, Tamil Nadu, India
Email: thayanithi2006s@gmail.com
Education: Bannari Amman Institute of Technology (B.E. Computer Science and Engineering, CGPA: 8.2/10.0, 12th Grade: 92.38%)
Skills:
- Languages: TypeScript, JavaScript, C, Java, Python
- Frontend: Next.js, React.js, Vue.js, Tailwind CSS, Framer Motion, Zustand
- Mobile: React Native, Flutter
- Backend: Node.js, Express.js, Fastify, REST APIs, JWT Auth
- Databases: MongoDB, PostgreSQL, MySQL
- Cloud: Google Cloud Platform (GCP), BigQuery
- Dev Tools: Git, GitHub, VS Code, Postman, Web Scraping

Experiences:
- Software Engineer Intern at Crayon'd (Sep 2024 – Apr 2025): Developed client products with responsive React and Express APIs.
- Software Engineer at EQREV (Jan 2025 – Dec 2025): Engineered quick-commerce SaaS dashboards for Zepto, Blinkit & Instamart.
- Frontend Developer at Thinkuni (Sep 2025 – Jan 2026): Built Vue.js learning analytics and interactive dashboards.

Featured Projects:
1. PROGRESS IQ: Real-time monitoring & team analytics platform with AI insights, role-based access control, and centralized collaboration workspace. Live at: https://progress-iq.vercel.app/
2. EQ REV: Quick Commerce brand scaling analytics providing pin-code insights. Live at: https://app.eqrev.com/
3. CNC VAULT: Centralized secure machine programs & PLC logic controller hub. Live at: https://cnc-machines.vercel.app/
4. BITLINKS: College community networking portal featuring collaborative workspaces. Live at: https://bitlinks.bitsathy.ac.in/
5. DEV RANK: Developer ranking platform linking GitHub/LeetCode profiles. Live at: http://dev-rank.vercel.app/

Certifications:
- Programming in Java (NPTEL - IIT Kharagpur, Dec 2025) - 90% Elite Badge
- Google Cloud Associate Engineer (Oct 2025)
- Advanced React Systems Certificate (Jun 2025)

Instructions:
- Answer questions professionally, concisely, and system-oriented, matching a high-end console theme.
- Keep responses short (1-3 sentences), informative, and extremely neat.
- If the question is unrelated to Thayanithi S, answer politely but steer back to his profile.
`

async function askGroq(prompt: string): Promise<string | null> {
  const apiKey = process.env.GROQ_API_KEY
  if (!apiKey) return null

  const models = [
    "llama-3.3-70b-versatile",
    "llama3-8b-8192",
    "mixtral-8x7b-32768"
  ]

  for (const model of models) {
    try {
      console.log(`[Groq Assistant] Trying model: ${model}...`)
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [
            { role: "system", content: portfolioContext },
            { role: "user", content: prompt }
          ],
          temperature: 0.5,
          max_tokens: 256
        })
      })

      const data = await response.json()
      if (data.choices?.[0]?.message?.content) {
        console.log(`[Groq Assistant] Success with model: ${model}`)
        return data.choices[0].message.content.trim()
      } else if (data.error) {
        console.warn(`[Groq Assistant] Model ${model} returned error:`, data.error.message)
      }
    } catch (err) {
      console.error(`[Groq Assistant] Failed with model ${model}:`, err)
    }
  }

  return null
}

async function askGemini(prompt: string): Promise<string | null> {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) return null

  const modelsToTry = [
    "gemini-2.0-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-pro"
  ]

  const apiVersions = ["v1beta", "v1"]

  for (const apiVersion of apiVersions) {
    for (const model of modelsToTry) {
      try {
        console.log(`[Gemini Assistant] Trying fallback model: ${model} via ${apiVersion}...`)
        const response = await fetch(
          `https://generativelanguage.googleapis.com/${apiVersion}/models/${model}:generateContent?key=${apiKey}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              contents: [
                {
                  parts: [
                    { text: `${portfolioContext}\n\nUser Question: ${prompt}\nAnswer:` }
                  ]
                }
              ]
            })
          }
        )

        const data = await response.json()
        if (data.error) {
          console.warn(`[Gemini Assistant] Model ${model} returned error:`, data.error.message)
          continue
        }

        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text
        if (reply) {
          console.log(`[Gemini Assistant] Success fallback with model: ${model}`)
          return reply.trim()
        }
      } catch (err) {
        console.error(`[Gemini Assistant] Failed fallback with model ${model}:`, err)
      }
    }
  }

  return null
}

export async function askAssistant(prompt: string): Promise<string | null> {
  // 1. Try Groq first
  let response = await askGroq(prompt)
  if (response) return response

  // 2. Fallback to Gemini
  console.log("[Assistant] Groq failed or key missing. Invoking Gemini fallback...")
  response = await askGemini(prompt)
  if (response) return response

  return null
}
