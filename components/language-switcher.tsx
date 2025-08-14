"use client"
import { Button } from "@/components/ui/button"
import { Globe } from "lucide-react"
import type { Language } from "@/lib/i18n"

interface LanguageSwitcherProps {
  onLanguageChange: (lang: Language) => void
  currentLanguage: Language
}

export function LanguageSwitcher({ onLanguageChange, currentLanguage }: LanguageSwitcherProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={() => onLanguageChange(currentLanguage === "en" ? "zh" : "en")}
      className="flex items-center gap-2"
    >
      <Globe className="h-4 w-4" />
      {currentLanguage === "en" ? "中文" : "English"}
    </Button>
  )
}
