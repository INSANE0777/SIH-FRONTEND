"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Menu, X, Home, BarChart3, Map, FileText, Brain, Users } from "lucide-react"
import { useState } from "react"
import Image from "next/image"
import { LanguageToggle } from "@/components/language-toggle"
import { useLanguage } from "@/hooks/use-language"

export function GovernmentHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { t } = useLanguage()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60 animate-fade-in">
      <div className="bg-primary text-primary-foreground py-6 px-4">
        <div className="container mx-auto flex items-center justify-between">
          <Image
            src="/images/mota-logo.jpg"
            alt="Ministry of Tribal Affairs"
            width={120}
            height={120}
            className="bg-white rounded p-3"
          />
          <Image
            src="/images/azadi-ka-amrit-mahotsav.jpg"
            alt="आज़ादी का अमृत महोत्सव"
            width={140}
            height={120}
            className="bg-white rounded p-3"
          />
          <Image
            src="/images/swachh-bharat.png"
            alt="स्वच्छ भारत"
            width={120}
            height={120}
            className="bg-white rounded p-3"
          />
        </div>
      </div>

      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div>
                <h1 className="text-2xl font-bold text-foreground bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  {t("siteTitle")}
                </h1>
                <p className="text-sm text-muted-foreground">{t("siteSubtitle")}</p>
              </div>
            </div>

            {/* Desktop Menu */}
            <nav className="hidden lg:flex items-center gap-6">
              <a
                href="/"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105"
              >
                <Home className="h-4 w-4" />
                {t("home")}
              </a>
              <a
                href="/dashboard"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105"
              >
                <BarChart3 className="h-4 w-4" />
                {t("dashboard")}
              </a>
              <a
                href="/map"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105"
              >
                <Map className="h-4 w-4" />
                {t("map")}
              </a>
              <a
                href="/claims"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105"
              >
                <FileText className="h-4 w-4" />
                Data Explorer
              </a>
              <a
                href="/ai-tools"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105"
              >
                <Brain className="h-4 w-4" />
                {t("aiTools")}
              </a>
              <a
                href="/village-profile"
                className="flex items-center gap-2 text-sm font-medium hover:text-primary transition-all duration-200 hover:scale-105"
              >
                <Users className="h-4 w-4" />
                DSS Engine
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <LanguageToggle />

           

            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t animate-slide-up">
            <nav className="flex flex-col gap-3 pt-4">
              <a href="/" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors py-2">
                <Home className="h-4 w-4" />
                {t("home")}
              </a>
              <a href="/dashboard" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors py-2">
                <BarChart3 className="h-4 w-4" />
                {t("dashboard")}
              </a>
              <a href="/map" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors py-2">
                <Map className="h-4 w-4" />
                {t("map")}
              </a>
              <a href="/claims" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors py-2">
                <FileText className="h-4 w-4" />
                Data Explorer
              </a>
              <a href="/ai-tools" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors py-2">
                <Brain className="h-4 w-4" />
                {t("aiTools")}
              </a>
              <a href="/village-profile" className="flex items-center gap-3 text-sm font-medium hover:text-primary transition-colors py-2">
                <Users className="h-4 w-4" />
                DSS Engine
              </a>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
