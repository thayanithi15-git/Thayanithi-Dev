import type { Metadata, Viewport } from "next"
import { Geist_Mono, Silkscreen } from "next/font/google"
import { GeistPixelLine } from "geist/font/pixel"
import { Analytics } from "@vercel/analytics/next"
import "../styles/globals.css"

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

const silkscreen = Silkscreen({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-pixel",
})

const geistPixelLine = GeistPixelLine

export const metadata: Metadata = {
  title: "Thayanithi S | Portfolio",
  description:
    "Thayanithi S's minimalist, technical engineering showcase featuring character-based animations, pixel typography, and hardware/systems-focused sections.",
  generator: "Thayanithi S",
  keywords: [
    "Thayanithi S",
    "portfolio",
    "ASCII art",
    "monochrome",
    "frontend",
    "engineering",
    "developer",
  ],
  icons: {
    icon: [
      {
        // url: "/Light%20Logo.png",
        url: "/T_Light.png",
      },
    ],
    apple: "/T_Light.png",
  },
}

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
}

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={geistPixelLine.variable} suppressHydrationWarning>
      <body
        className={`${geistMono.variable} ${silkscreen.variable} font-mono antialiased`}
      >
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
