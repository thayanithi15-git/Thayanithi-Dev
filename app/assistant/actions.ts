"use server"

export async function askGemini(prompt: string) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return null; // fallback to local mock responder
  }

  try {
    const portfolioContext = `
You are the AI Portfolio Assistant for Thayanithi S, a Software Development Engineer.
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
5. DEV RANK: Developer ranking platform linking GitHub/LeetCode profiles. Live at: https://github.com/thayanithi15-git

Certifications:
- Programming in Java (NPTEL - IIT Kharagpur, Dec 2025) - 90% Elite Badge
- Google Cloud Associate Engineer (Oct 2025)
- Advanced React Systems Certificate (Jun 2025)

Instructions:
- Answer questions professionally, concisely, and system-oriented, matching a high-end console theme.
- Keep responses short (1-3 sentences).
- If the question is unrelated to Thayanithi S, answer politely but steer back to his profile.
`;

    const modelsToTry = [
      "gemini-2.0-flash",
      "gemini-1.5-flash",
      "gemini-2.0-flash-lite",
      "gemini-1.5-pro"
    ];

    const apiVersions = ["v1beta", "v1"];

    for (const apiVersion of apiVersions) {
      for (const model of modelsToTry) {
        try {
          console.log(`[Gemini Assistant] Trying model: ${model} via ${apiVersion}...`);
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
          );

          const data = await response.json();
          
          if (data.error) {
            console.warn(`[Gemini Assistant] Model ${model} (${apiVersion}) returned error:`, data.error.message);
            continue; // try next model/version
          }

          const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (reply) {
            console.log(`[Gemini Assistant] Success with model: ${model} (${apiVersion})`);
            return reply.trim();
          }
        } catch (err) {
          console.error(`[Gemini Assistant] Failed to fetch with model ${model} (${apiVersion}):`, err);
        }
      }
    }

    console.error("[Gemini Assistant] All Gemini models/versions exhausted. Falling back to local responder.");
    return null;
  } catch (error) {
    console.error("Gemini API Action Error:", error);
    return null;
  }
}
