import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Navigation from "@/components/navigation"
import { Toaster } from "react-hot-toast"

export const metadata: Metadata = {
  title: "TimeWeave - 时间编织",
  description: "Weave Your Time - Restructure Your Productivity | 重构你的生产力",
  generator: "v0.app",
  keywords: ["productivity", "time management", "knowledge graph", "automation", "生产力", "时间管理"],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <head>
        <style>{`
html {
  font-family: ${GeistSans.style.fontFamily};
  --font-sans: ${GeistSans.variable};
  --font-mono: ${GeistMono.variable};
}
        `}</style>
      </head>
      <body>
        <Navigation />
        <div className="pt-16">
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: "#1e293b",
                color: "#f1f5f9",
                border: "1px solid #475569",
              },
            }}
          />
        </div>
      </body>
    </html>
  )
}
