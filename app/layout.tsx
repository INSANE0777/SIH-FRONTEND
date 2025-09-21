import type React from "react"
import type { Metadata } from "next"
import { Inter, JetBrains_Mono, Noto_Sans_Devanagari } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import "./globals.css"

// --- Leaflet CSS Imports ---
import "leaflet/dist/leaflet.css" // core Leaflet styles
import "leaflet.markercluster/dist/MarkerCluster.css" // clustering
import "leaflet.markercluster/dist/MarkerCluster.Default.css" // default clustering theme
// If you later add Leaflet plugins (e.g., draw/heatmap), import their CSS here too.

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
})

const notoSansDevanagari = Noto_Sans_Devanagari({
  subsets: ["devanagari"],
  variable: "--font-devanagari",
  display: "swap",
})

export const metadata: Metadata = {
  title: "BHUमि - वन अधिकार प्रबंधन पोर्टल | भारत सरकार",
  description: "वन अधिकार अधिनियम दावा प्रबंधन और निर्णय सहायता प्रणाली के लिए भारत सरकार का आधिकारिक पोर्टल",
  generator: "भारत सरकार",
  keywords: "BHUमि, वन अधिकार अधिनियम, FRA, भारत सरकार, दावा प्रबंधन, निर्णय सहायता, जनजातीय कार्य मंत्रालय",
  authors: [{ name: "जनजातीय कार्य मंत्रालय, भारत सरकार" }],
  robots: "index, follow",
  viewport: "width=device-width, initial-scale=1",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="hi" className="scroll-smooth">
      <body
        className={`font-sans antialiased ${inter.variable} ${jetbrainsMono.variable} ${notoSansDevanagari.variable}`}
      >
        <Suspense fallback={<div className="flex items-center justify-center min-h-screen">लोड हो रहा है...</div>}>
          {children}
        </Suspense>
        <Analytics />
      </body>
    </html>
  )
}
