"use client"

import * as React from "react"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore keydown events from input elements
      const target = e.target as HTMLElement
      if (
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable
      ) {
        return
      }

      if (e.key.toLowerCase() === "d" && !e.metaKey && !e.ctrlKey && !e.altKey) {
        e.preventDefault()
        const currentTheme = theme === "system" ? resolvedTheme : theme
        setTheme(currentTheme === "dark" ? "light" : "dark")
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [theme, setTheme, resolvedTheme])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  // Prevent hydration mismatch by rendering a placeholder or default state until mounted
  if (!mounted) {
    return (
      <Button variant="ghost" size="icon" disabled>
         <Sun className="h-[1.2rem] w-[1.2rem]" />
         <span className="sr-only">Toggle theme</span>
      </Button>
    )
  }

  return (
    <Button variant="ghost" size="icon" onClick={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  )
}
