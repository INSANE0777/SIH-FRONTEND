"use client"

import { Button } from "@/components/ui/button"
import { useLanguage } from "@/hooks/use-language"
import { Languages } from "lucide-react"

export function LanguageToggle() {
  const { language, setLanguage } = useLanguage()

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => setLanguage(language === "en" ? "hi" : "en")}
      // --- THE FIX: Removed hardcoded text-white and hover classes ---
      // This allows the button to inherit the correct text color from its parent
      // and use the theme's default hover effect.
      className="gap-2"
    >
      <Languages className="h-4 w-4" />
      {language === "en" ? "हिंदी" : "English"}
    </Button>
  )
}