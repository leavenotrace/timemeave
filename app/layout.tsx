import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import "./globals.css"
import Navigation from "@/components/navigation"
import { Toaster } from "react-hot-toast"
import { ErrorProvider } from "@/components/providers/error-provider"
import { LoadingProvider } from "@/components/providers/loading-provider"
import { AuthProvider } from "@/components/providers/auth-provider"
import { ErrorBoundary } from "@/components/ui/error-boundary"
import { NetworkStatus } from "@/components/ui/network-status"

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
        <ErrorProvider>
          <LoadingProvider>
            <AuthProvider>
              <ErrorBoundary level="page" maxRetries={3} showErrorDetails={process.env.NODE_ENV === "development"}>
              <Navigation />
              <div className="pt-16 pb-16 md:pb-0">
                {/* Network status banner */}
                <div className="sticky top-16 z-40">
                  <NetworkStatus variant="banner" />
                </div>
                
                {/* Main content with mobile-optimized padding */}
                <ErrorBoundary level="component" maxRetries={2}>
                  <div className="min-h-[calc(100vh-8rem)] md:min-h-[calc(100vh-4rem)]">
                    {children}
                  </div>
                </ErrorBoundary>
                
                {/* Toast notifications */}
                <Toaster
                  position="top-right"
                  toastOptions={{
                    duration: 4000,
                    style: {
                      background: "#1e293b",
                      color: "#f1f5f9",
                      border: "1px solid #475569",
                    },
                    success: {
                      style: {
                        background: "#1e293b",
                        color: "#10b981",
                        border: "1px solid #10b981",
                      },
                    },
                    error: {
                      style: {
                        background: "#1e293b",
                        color: "#ef4444",
                        border: "1px solid #ef4444",
                      },
                    },
                  }}
                />
              </div>
              </ErrorBoundary>
            </AuthProvider>
          </LoadingProvider>
        </ErrorProvider>
      </body>
    </html>
  )
}
